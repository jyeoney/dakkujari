import { useState, FormEvent, useEffect, useRef } from 'react';
import {
  Post,
  addPost,
  getPost,
  updatePost,
  uploadImage
} from '../firebase/firestoreService';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill-new';
import imageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', imageResize);
// Quill.register('formats/list', true);

const PostForm = () => {
  const { boardName, postId } = useParams<{
    boardName: string;
    postId?: string;
  }>();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [purpose, setPurpose] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { nickname } = useAuth();
  const quillRef = useRef<ReactQuill>(null);

  const BoardOptions: {
    [key: string]: { categories: string[]; purposes?: string[] };
  } = {
    dakkuGallery: {
      categories: ['아날로그 다꾸', '디지털 다꾸', '기타'],
      purposes: ['스크랩', '일상 기록', '여행', '스케줄', '기타']
    },
    reviewAndTips: {
      categories: ['용품 관련', '꾸미기 관련', '기타']
    },
    dakkuQnA: {
      categories: ['용품 관련', '꾸미기 관련', '기타']
    }
  };
  const currentOptions = boardName ? BoardOptions[boardName] : undefined;

  useEffect(() => {
    const loadPost = async () => {
      if (boardName && postId) {
        const post = (await getPost(boardName, postId)) as Post;
        setTitle(post.title);
        setCategory(post.category);
        setPurpose(post.purpose || '');
        setContent(post.content);
      }
    };
    loadPost();
  }, [boardName, postId]);

  const handleSumbit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requiresPurpose = currentOptions?.purposes
      ? currentOptions.purposes.length > 0
      : false;

    if (!title || !content || !category || (requiresPurpose && !purpose)) {
      alert('입력되지 않은 항목이 있습니다!');
      return;
    }
    const editor = quillRef.current?.getEditor();
    const contentHtml = editor ? editor.root.innerHTML : '';

    if (postId) {
      await updatePost(boardName || 'defaultBoard', postId, {
        title,
        content: contentHtml,
        category,
        purpose: requiresPurpose ? purpose || null : null,
        imageFile
      });
    } else {
      addPost(
        boardName || 'defaultBoard',
        title,
        contentHtml,
        nickname,
        category,
        requiresPurpose ? purpose || null : null,
        imageFile
      );
    }
    navigate(`/${boardName}`);
  };
  const handleCancel = () => {
    navigate(`/${boardName}`);
  };

  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const imageUrl = await uploadImage(file);
          const editor = quillRef.current?.getEditor();
          const range = editor?.getSelection();
          if (range) {
            editor?.insertEmbed(range.index, 'image', imageUrl);
          }
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
          alert('이미지 업로드 중 오류가 발생했습니다.');
        }
      }
    };
  };

  return (
    <form className="container mx-auto p-20" onSubmit={handleSumbit}>
      <table>
        <tbody>
          <tr>
            <td>
              <label htmlFor="title">제목: </label>
            </td>
            <td>
              <input
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </td>
          </tr>
          {currentOptions?.categories && (
            <tr>
              <td>
                <label htmlFor="category">카테고리: </label>
              </td>
              <td>
                <select
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}>
                  <option value="">카테고리 선택</option>
                  {currentOptions.categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          )}
          {currentOptions?.purposes && (
            <tr>
              <td>
                <label htmlFor="purpose">목적: </label>
              </td>
              <td>
                <select
                  id="purpose"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}>
                  <option value="">목적 선택</option>
                  {currentOptions.purposes.map(purpose => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="내용을 입력하세요"
          ref={quillRef}
          modules={{
            toolbar: {
              container: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ align: [] }],
                [{ color: [] }, { background: [] }],
                ['link', 'image'],
                ['clean']
              ]
              // handlers: {
              //   image: imageHandler
              // }
            },
            clipboard: {
              matchVisual: false
            },
            imageResize: {
              modules: ['Resize', 'DisplaySize', 'Toolbar']
            }
          }}
          formats={[
            'header',
            'font',
            'size',
            'bold',
            'italic',
            'underline',
            'strike',
            'blockquote',
            'list',
            // 'bullet',
            'align',
            'color',
            'background',
            'link',
            'image'
          ]}
        />
      </div>
      <button
        type="submit"
        className="mt-4 mr-4 px-4 py-2 bg-sky-300 text-white rounded-lg">
        {postId ? '수정 완료' : '등록'}
      </button>
      <button
        type="button"
        className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
        onClick={handleCancel}>
        취소
      </button>
    </form>
  );
};

export default PostForm;
// import { useState, FormEvent, useEffect, useRef } from 'react';
// import {
//   Post,
//   addPost,
//   getPost,
//   updatePost,
//   uploadImage
// } from '../firebase/firestoreService';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill, { Quill } from 'react-quill-new';
// import imageResize from 'quill-image-resize-module-react';

// Quill.register('modules/imageResize', imageResize);

// const PostForm = () => {
//   const { boardName, postId } = useParams<{
//     boardName: string;
//     postId?: string;
//   }>();
//   const [title, setTitle] = useState('');
//   const [category, setCategory] = useState('');
//   const [purpose, setPurpose] = useState('');
//   const [content, setContent] = useState('');
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const navigate = useNavigate();
//   const { nickname } = useAuth();
//   const quillRef = useRef<ReactQuill>(null);

//   const BoardOptions: {
//     [key: string]: { categories: string[]; purposes?: string[] };
//   } = {
//     dakkuGallery: {
//       categories: ['아날로그 다꾸', '디지털 다꾸', '기타'],
//       purposes: ['스크랩', '일상 기록', '여행', '스케줄', '기타']
//     },
//     reviewAndTips: {
//       categories: ['용품 관련', '꾸미기 관련', '기타']
//     },
//     dakkuQnA: {
//       categories: ['용품 관련', '꾸미기 관련', '기타']
//     }
//   };
//   const currentOptions = boardName ? BoardOptions[boardName] : undefined;

//   useEffect(() => {
//     const loadPost = async () => {
//       if (boardName && postId) {
//         const post = (await getPost(boardName, postId)) as Post;
//         setTitle(post.title);
//         setCategory(post.category);
//         setPurpose(post.purpose || '');
//         setContent(post.content);
//       }
//     };
//     loadPost();
//   }, [boardName, postId]);

//   const handleSumbit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const requiresPurpose = currentOptions?.purposes
//       ? currentOptions.purposes.length > 0
//       : false;

//     if (!title || !content || !category || (requiresPurpose && !purpose)) {
//       alert('입력되지 않은 항목이 있습니다!');
//       return;
//     }
//     const editor = quillRef.current?.getEditor();
//     const contentHtml = editor ? editor.root.innerHTML : '';

//     if (postId) {
//       await updatePost(boardName || 'defaultBoard', postId, {
//         title,
//         content: contentHtml,
//         category,
//         purpose: requiresPurpose ? purpose || null : null,
//         imageFile
//       });
//     } else {
//       addPost(
//         boardName || 'defaultBoard',
//         title,
//         contentHtml,
//         nickname,
//         category,
//         requiresPurpose ? purpose || null : null,
//         imageFile
//       );
//     }
//     navigate(`/${boardName}`);
//   };
//   const handleCancel = () => {
//     navigate(`/${boardName}`);
//   };

//   const imageHandler = async () => {
//     const input = document.createElement('input');
//     input.setAttribute('type', 'file');
//     input.setAttribute('accept', 'image/*');
//     input.click();

//     input.onchange = async () => {
//       const file = input.files?.[0];
//       if (file) {
//         try {
//           const imageUrl = await uploadImage(file);
//           const editor = quillRef.current?.getEditor();
//           const range = editor?.getSelection();
//           if (range) {
//             editor?.insertEmbed(range.index, 'image', imageUrl);
//           }
//         } catch (error) {
//           console.error('이미지 업로드 실패:', error);
//           alert('이미지 업로드 중 오류가 발생했습니다.');
//         }
//       }
//     };
//   };

//   return (
//     <form className="container mx-auto p-20" onSubmit={handleSumbit}>
//       <table>
//         <tbody>
//           <tr>
//             <td>
//               <label htmlFor="title">제목: </label>
//             </td>
//             <td>
//               <input
//                 type="text"
//                 id="title"
//                 value={title}
//                 onChange={e => setTitle(e.target.value)}
//               />
//             </td>
//           </tr>
//           {currentOptions?.categories && (
//             <tr>
//               <td>
//                 <label htmlFor="category">카테고리: </label>
//               </td>
//               <td>
//                 <select
//                   id="category"
//                   value={category}
//                   onChange={e => setCategory(e.target.value)}>
//                   <option value="">카테고리 선택</option>
//                   {currentOptions.categories.map(category => (
//                     <option key={category} value={category}>
//                       {category}
//                     </option>
//                   ))}
//                 </select>
//               </td>
//             </tr>
//           )}
//           {currentOptions?.purposes && (
//             <tr>
//               <td>
//                 <label htmlFor="purpose">목적: </label>
//               </td>
//               <td>
//                 <select
//                   id="purpose"
//                   value={purpose}
//                   onChange={e => setPurpose(e.target.value)}>
//                   <option value="">목적 선택</option>
//                   {currentOptions.purposes.map(purpose => (
//                     <option key={purpose} value={purpose}>
//                       {purpose}
//                     </option>
//                   ))}
//                 </select>
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//       <div>
//         <ReactQuill
//           value={content}
//           onChange={setContent}
//           placeholder="내용을 입력하세요"
//           ref={quillRef}
//           modules={{
//             toolbar: {
//               container: [
//                 [{ header: '1' }, { header: '2' }, { font: [] }],
//                 [{ size: [] }],
//                 ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//                 [{ list: 'ordered' }, { list: 'bullet' }],
//                 [{ align: [] }],
//                 [{ color: [] }, { background: [] }],
//                 ['link', 'image'],
//                 ['clean']
//               ],
//               handlers: {
//                 image: imageHandler
//               }
//             },
//             clipboard: {
//               matchVisual: false
//             },
//             imageResize: {
//               modules: ['Resize', 'DisplaySize', 'Toolbar']
//             }
//           }}
//           formats={[
//             'header',
//             'font',
//             'size',
//             'bold',
//             'italic',
//             'underline',
//             'strike',
//             'blockquote',
//             'list',
//             // 'bullet',
//             'align',
//             'color',
//             'background',
//             'link',
//             'image'
//           ]}
//         />
//       </div>
//       <button
//         type="submit"
//         className="mt-4 mr-4 px-4 py-2 bg-sky-300 text-white rounded-lg">
//         {postId ? '수정 완료' : '등록'}
//       </button>
//       <button
//         type="button"
//         className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
//         onClick={handleCancel}>
//         취소
//       </button>
//     </form>
//   );
// };

// export default PostForm;
