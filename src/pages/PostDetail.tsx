import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Post, deletePost, updatePost } from '../firebase/firestoreService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import CommentSection from '../components/CommentSection';
import { AuthContext } from '../context/AuthContext';

const PostDetail = () => {
  const { boardName, postId } = useParams<{
    boardName: string;
    postId: string;
  }>();
  const [post, setPost] = useState<Post | null>(null);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (boardName && postId) {
        try {
          const postDoc = await getDoc(doc(db, boardName, postId));
          if (postDoc.exists()) {
            setPost({
              id: postDoc.id,
              createdAt: postDoc.data().createdAt.toDate(),
              ...postDoc.data()
            } as Post);
          } else {
            console.log('No such post!');
          }
        } catch (error) {
          console.error('Error fetching post: ', error);
        }
      }
    };
    fetchPost();
  }, [boardName, postId]);

  const handleDeletePost = async () => {
    if (post && boardName) {
      await deletePost(boardName, post.id);
      navigate(`/${boardName}`);
    }
  };

  const handleUpdatePost = async () => {
    if (post && boardName) {
      // const updatedData = {
      //   ...post,
      //   title: '수정된 제목',
      //   content: '수정된 내용'
      // };
      // await updatePost(boardName, post.id, updatedData);
      // setPost(updatedData);
      navigate(`/${boardName}/editPost/${postId}`);
    }
  };

  return (
    <div>
      {post ? (
        <>
          <table>
            <tbody>
              <tr>
                <td>제목</td>
                <td>{post.title}</td>
              </tr>
              <tr>
                <td>카테고리</td>
                <td>{post.category}</td>
              </tr>
              {post.purpose && (
                <tr>
                  <td>목적</td>
                  <td>{post.purpose}</td>
                </tr>
              )}
            </tbody>
          </table>
          <div>{post.content}</div>
          {authContext?.isSignIn && post.nickname === authContext.nickname && (
            <>
              <button onClick={handleDeletePost}>삭제</button>
              <button onClick={handleUpdatePost}>수정</button>
            </>
          )}
          <CommentSection postId={postId || ''} />
        </>
      ) : (
        <p>게시글을 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default PostDetail;
