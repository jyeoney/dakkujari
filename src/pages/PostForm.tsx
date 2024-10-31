import { useState, FormEvent, useEffect } from 'react';
import {
  Post,
  addPost,
  getPost,
  updatePost
} from '../firebase/firestoreService';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PostForm = () => {
  const { boardName, postId } = useParams<{
    boardName: string;
    postId?: string;
  }>();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [purpose, setPurpose] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { nickname } = useAuth();

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
    if (postId) {
      await updatePost(boardName || 'defaultBoard', postId, {
        title,
        content,
        category,
        purpose: purpose || null
      });
    } else {
      addPost(
        boardName || 'defaultBoard',
        title,
        content,
        nickname,
        category,
        purpose || null
      );
    }
    navigate(`/${boardName}`);
  };
  const handleCancel = () => {
    navigate(`/${boardName}`);
  };

  return (
    <form onSubmit={handleSumbit}>
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
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}></textarea>
      </div>
      <button type="submit">{postId ? '수정 완료' : '등록'}</button>
      <button type="button" onClick={handleCancel}>
        취소
      </button>
    </form>
  );
};

export default PostForm;
