import { FormEvent, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  addComment,
  deleteComment,
  getComments
} from '../firebase/firestoreService';
import { AuthContext } from '../context/AuthContext';

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: { seconds: number };
}

const CommentSection = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const { nickname, isSignIn } = useAuth();
  const user = useContext(AuthContext);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsData = await getComments(postId);
      setComments(commentsData);
    };
    fetchComments();
  }, [postId]);

  useEffect(() => {
    setCurrentUser(user ? user.nickname : null);
  }, []);

  const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isSignIn) {
      alert('로그인 후 댓글을 작성할 수 있습니다.');
      return;
    }

    await addComment(postId, newComment, nickname);
    setNewComment('');

    const updatedComments = await getComments(postId);
    setComments(updatedComments);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (currentUser) {
      await deleteComment(postId, commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    }
  };

  return (
    <div>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            <span>
              {comment.author}: {comment.content}
            </span>
            {currentUser === comment.author && (
              <button onClick={() => handleDeleteComment(comment.id)}>
                삭제
              </button>
            )}
          </li>
        ))}
      </ul>
      {/* {comments.map(comment => (
        <div
          key={comment.id}
          style={{ borderBottom: '1px solid #cc', padding: '10px 0' }}>
          <p>
            <strong>{comment.author}</strong>(
            {new Date(comment.createdAt.seconds * 1000).toLocaleDateString()})
          </p>
          <p>{comment.content}</p>
        </div>
      ))} */}
      {/* {isSignIn ? (
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
          />
          <button type="submit">댓글 작성</button>
        </form>
      ) : (
        <p>로그인 후 댓글을 작성할 수 있습니다.</p>
      )} */}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button type="submit">댓글 작성</button>
      </form>
    </div>
  );
};

export default CommentSection;
