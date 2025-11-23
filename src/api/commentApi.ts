import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { IComment } from '../types/post';

/** 댓글 작성 */
export const addComment = async (
  postId: string,
  content: string,
  author: string
) => {
  await addDoc(collection(db, `posts/${postId}/comments`), {
    content,
    author,
    createdAt: Timestamp.now()
  });
};

/** 댓글 조회 */
export const getComments = async (postId: string): Promise<IComment[]> => {
  const commentsCollection = collection(db, `posts/${postId}/comments`);
  const snapshot = await getDocs(commentsCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    content: doc.data().content,
    author: doc.data().author,
    createdAt: doc.data().createdAt.toDate()
  }));
};

/** 댓글 삭제 */
export const deleteComment = async (postId: string, commentId: string) => {
  await deleteDoc(doc(db, `posts/${postId}/comments`, commentId));
};

/** 댓글 수정 */
export const updateComment = async (
  postId: string,
  commentId: string,
  updateData: { content: string }
) => {
  await updateDoc(doc(db, `posts/${postId}/comments`, commentId), updateData);
};
