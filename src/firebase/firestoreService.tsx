import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export interface Post {
  id: string;
  title: string;
  content: string;
  nickname: string;
  category: string;
  purpose?: string | null;
  createdAt: Date;
}

export const addPost = async (
  boardName: string,
  title: string,
  content: string,
  nickname: string,
  category: string,
  purpose?: string | null
) => {
  await addDoc(collection(db, boardName), {
    title: title,
    content: content,
    nickname: nickname,
    category: category,
    purpose: purpose || null,
    createdAt: Timestamp.now()
  });
};

export const getPost = async (
  boardName: string,
  postId?: string
): Promise<Post | Post[]> => {
  if (postId) {
    const postDoc = await getDoc(doc(db, boardName, postId));
    if (postDoc.exists()) {
      const data = postDoc.data();
      return {
        id: postDoc.id,
        title: data.title,
        content: data.content,
        nickname: data.nickname,
        category: data.category,
        purpose: data.purpose,
        createdAt: data.createdAt.toDate()
      } as Post;
    } else {
      throw new Error('게시물을 찾을 수 없습니다.');
    }
  } else {
    const postsCollection = collection(db, boardName);
    const snapshot = await getDocs(postsCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      content: doc.data().content,
      author: doc.data().author,
      nickname: doc.data().nickname,
      category: doc.data().category,
      purpose: doc.data().purpose,
      createdAt: doc.data().createdAt.toDate()
    }));
  }
};

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

export const getComments = async (postId: string) => {
  const commentsCollection = collection(db, `posts/${postId}/comments`);
  const snapshot = await getDocs(commentsCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    content: doc.data().content,
    author: doc.data().author,
    createdAt: doc.data().createdAt
  }));
};

export const deleteComment = async (postId: string, commentId: string) => {
  await deleteDoc(doc(db, `posts/${postId}/comments`, commentId));
};

export const deletePost = async (boardName: string, postId: string) => {
  await deleteDoc(doc(db, boardName, postId));
};

export const updatePost = async (
  boardName: string,
  postId: string,
  updatedData: Partial<Post>
) => {
  await updateDoc(doc(db, boardName, postId), updatedData);
};
