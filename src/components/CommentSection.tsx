import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  addComment,
  deleteComment,
  getComments,
  updateComment
} from '../api/commentApi';
import { IComment } from '../types/post';

const CommentSection = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user, nickname, isSignIn } = useAuth();

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsData = await getComments(postId);
      const sortedComments = commentsData.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
      setComments(sortedComments);
    };
    fetchComments();
  }, [postId]);

  useEffect(() => {
    if (editingCommentId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editingCommentId]);

  const handleSubmitComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isSignIn) {
      alert('로그인 후 댓글을 작성할 수 있습니다.');
      return;
    }

    await addComment(postId, newComment, nickname);
    setNewComment('');

    const refreshedComments = await getComments(postId);
    const sortedRefreshedComments = refreshedComments.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
    setComments(sortedRefreshedComments);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (user) {
      await deleteComment(postId, commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    }
  };

  const handleEditComment = (comment: IComment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const handleUpdateComment = async (commentId: string) => {
    if (editingCommentContent.trim()) {
      await updateComment(postId, commentId, {
        content: editingCommentContent
      });
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, content: editingCommentContent }
            : comment
        )
      );
    }
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  return (
    <div className="container mx-auto w-full flex flex-col items-center mt-4">
      <ul className="w-full space-y-4 list-none mr-10">
        {comments.map(comment => (
          <li key={comment.id} className="border-b pb-2 text-left">
            <div>
              <strong>{comment.author}</strong> {comment.content}
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>
                {comment.createdAt.toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
              {user && nickname === comment.author && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditComment(comment)}
                    className="hover:underline hover:text-sky-500">
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="hover:underline hover:text-red-500">
                    삭제
                  </button>
                </div>
              )}
            </div>
            {editingCommentId === comment.id && (
              <div className="mt-2">
                <textarea
                  ref={textareaRef}
                  className="border-2 rounded p-2 w-full focus:border-sky-300 focus:outline-none"
                  value={editingCommentContent}
                  onChange={e => setEditingCommentContent(e.target.value)}
                  placeholder="수정할 댓글을 입력하세요"
                />
                <button
                  onClick={() => handleUpdateComment(comment.id)}
                  className="mt-1 bg-sky-300 text-white rounded px-3 py-1">
                  완료
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleSubmitComment}
        className="w-full mt-4 flex items-center space-x-2">
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="border-2 rounded p-2 w-full focus:border-sky-300 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-sky-300 text-white rounded-lg w-20 px-2 py-2 flex flex-col justify-center items-center">
          <span>댓글</span>
          <span>작성</span>
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
