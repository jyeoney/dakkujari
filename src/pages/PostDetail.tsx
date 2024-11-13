import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Post, deletePost } from '../firebase/firestoreService';
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  increment,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import CommentSection from '../components/CommentSection';
import DOMPurify from 'dompurify';
import { VscHeart, VscHeartFilled } from 'react-icons/vsc';
import { useAuth } from '../hooks/useAuth';

const PostDetail = () => {
  const { boardName, postId } = useParams<{
    boardName: string;
    postId: string;
  }>();
  const [post, setPost] = useState<Post | null>(null);
  const { isSignIn, nickname } = useAuth();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [likecount, setLikeCount] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (boardName && postId) {
        try {
          const postDoc = await getDoc(doc(db, boardName, postId));
          if (postDoc.exists()) {
            setPost({
              id: postDoc.id,
              createdAt: postDoc.data().createdAt.toDate(),
              likeCount: postDoc.data().likeCount || 0,
              ...postDoc.data()
            } as Post);
            const hasLiked = postDoc.data().likeByUsers?.includes(nickname);
            // setLiked(postDoc.data().includes(authContext?.nickname));
            // setLikeCount(postDoc.data().likeCount || 0);
            setLiked(hasLiked || false);
            setLikeCount(postDoc.data().likeCount || 0);
          } else {
            console.log('No such post!');
          }
        } catch (error) {
          console.error('Error fetching post: ', error);
        }
      }
    };
    fetchPost();
  }, [boardName, postId, nickname]);

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

  const sanitizedContent = post?.content
    ? DOMPurify.sanitize(post.content, { USE_PROFILES: { html: true } })
    : '';

  const toggleLike = async () => {
    if (!boardName || !postId) {
      throw new Error('게시물 ID 또는 보드 이름이 유효하지 않습니다.');
    }

    const postRef = doc(db, boardName, postId);

    try {
      if (liked) {
        await updateDoc(postRef, {
          likeByUsers: arrayRemove(nickname),
          likeCount: increment(-1)
        });
      } else {
        await updateDoc(postRef, {
          likeByUsers: arrayUnion(nickname),
          likeCount: increment(1)
        });
      }
      setLiked(!liked);
      setLikeCount(prevCount => (liked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.log('toggleLike Error', error);
    }
  };

  return (
    <div className="container mx-auto p-20">
      {post ? (
        <>
          <table className="w-full mb-4 border">
            <tbody>
              <tr>
                <td className="font-bold">제목</td>
                <td>{post.title}</td>
              </tr>
              <tr>
                <td className="font-bold">카테고리</td>
                <td>{post.category}</td>
              </tr>
              {post.purpose && (
                <tr>
                  <td className="font-bold">목적</td>
                  <td>{post.purpose}</td>
                </tr>
              )}
            </tbody>
          </table>
          <div
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            className="mb-4"></div>
          <div className="flex justify-between items-center mb-4">
            <button
              className="flex items-center justify-center p-2 rounded-lg transition border "
              onClick={toggleLike}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}>
              {liked || hovered ? (
                <VscHeartFilled size={20} />
              ) : (
                <VscHeart size={20} />
              )}
              <span className="ml-2 text-xl relative top-[1px]">
                {likecount}
              </span>
            </button>
            {isSignIn && post.nickname === nickname && (
              <div className="flex space-x-4">
                <button
                  className="hover:underline hover:text-sky-500"
                  onClick={handleUpdatePost}>
                  수정
                </button>
                <button
                  className="hover:underline hover:text-red-500"
                  onClick={handleDeletePost}>
                  삭제
                </button>
              </div>
            )}
          </div>
          <CommentSection postId={postId || ''} />
        </>
      ) : (
        <p>게시글을 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default PostDetail;
