import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  where,
  query,
  Query,
  DocumentData,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { BOARD_NAMES } from '../constant/boardConfig';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

export interface Post {
  id: string;
  title: string;
  content: string;
  nickname: string;
  category: string;
  purpose?: string | null;
  createdAt: Date;
  likeCount: number;
  likeByUsers: string[];
}

const tokenizeText = (text: string): string[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const plainText = doc.body.textContent || '';

  return plainText
    .toLowerCase()
    .split(/\s+/)
    .filter(token => token);
};

export const addPost = async (
  boardName: string,
  title: string,
  content: string,
  nickname: string,
  category: string,
  purpose?: string | null,
  imageFile?: File | null
) => {
  const titleTokens = tokenizeText(title);
  const contentTokens = tokenizeText(content);
  let imageUrl = imageFile ? await uploadImage(imageFile) : null;

  await addDoc(collection(db, boardName), {
    title,
    content,
    nickname,
    category,
    purpose: purpose || null,
    createdAt: Timestamp.now(),
    likeCount: 0,
    likeByUsers: [],
    titleTokens,
    contentTokens,
    imageUrl: imageUrl || null
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
        createdAt: data.createdAt.toDate(),
        likeCount: data.likeCount || 0,
        likeByUsers: data.likeByUsers || []
        // imageUrl: data.imageUrl || null
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
      createdAt: doc.data().createdAt.toDate(),
      likeCount: doc.data().likeCount || 0,
      likeByUsers: doc.data().likeByUsers || []
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
    createdAt: doc.data().createdAt.toDate()
  }));
};

export const deleteComment = async (postId: string, commentId: string) => {
  await deleteDoc(doc(db, `posts/${postId}/comments`, commentId));
};

export const updateComment = async (
  postId: string,
  commentId: string,
  updateData: { content: string }
) => {
  await updateDoc(doc(db, `posts/${postId}/comments`, commentId), updateData);
};

export const deletePost = async (boardName: string, postId: string) => {
  await deleteDoc(doc(db, boardName, postId));
};

export const updatePost = async (
  boardName: string,
  postId: string,
  updatedData: {
    title: string;
    content: string;
    category: string;
    purpose: string | null;
    imageFile?: File | null;
  }
) => {
  let imageUrl = updatedData.imageFile
    ? await uploadImage(updatedData.imageFile)
    : null;

  const dataToUpdate = {
    title: updatedData.title,
    content: updatedData.content,
    category: updatedData.category,
    purpose: updatedData.purpose,
    imageUrl: imageUrl
  };

  await updateDoc(doc(db, boardName, postId), dataToUpdate);
};

export const getAllPostsBySearchQuery = async (
  searchQuery: string,
  searchField: string
) => {
  const results = [];

  const lowerSearchQuery = searchQuery.toLowerCase().split(/\s+/);

  for (const boardName of BOARD_NAMES) {
    const postsCollection = collection(db, boardName);
    let q: Query<DocumentData>;

    if (searchField === 'title') {
      q = query(
        postsCollection,
        where('titleTokens', 'array-contains-any', lowerSearchQuery)
      );
    } else if (searchField === 'content') {
      q = query(
        postsCollection,
        where('contentTokens', 'array-contains-any', lowerSearchQuery)
      );
    } else if (searchField === 'nickname') {
      q = query(
        postsCollection,
        where('nickname', '>=', lowerSearchQuery[0]),
        where('nickname', '<=', lowerSearchQuery[0] + '\uf8ff')
        // where('nickname', '>=', lowerSearchQuery),
        // where('nickname', '<=', lowerSearchQuery + '\uf8ff')
      );
    } else {
      q = query(postsCollection);
    }

    const snapshot = await getDocs(q);
    for (const doc of snapshot.docs) {
      results.push({
        id: doc.id,
        boardName,
        title: doc.data().title,
        content: doc.data().content,
        nickname: doc.data().nickname,
        createdAt: doc.data().createdAt.toDate()
        // imageUrl: doc.data().imageUrl || null
      });
    }
    // const snapshot = await getDocs(postsCollection);
    // for (const doc of snapshot.docs) {
    //   results.push({
    //     id: doc.id,
    //     boardName,
    //     createdAt: doc.data().createdAt.toDate(),
    //     ...doc.data()
    //   });
    // }
  }
  return results.sort((a, b) => b.createdAt - a.createdAt);
};

export const getTopPosts = async (boardName: string) => {
  const postsCollection = collection(db, boardName);
  const q = query(
    postsCollection,
    orderBy('likeCount', 'desc'),
    // orderBy('createdAt', 'desc'),
    limit(3)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  }));
};

export const uploadImage = async (file: File): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `images/${file.name}`);

  try {
    await uploadBytes(storageRef, file);
    console.log('파일 업로드 완료');

    const url = await getDownloadURL(storageRef);
    console.log('업로드된 이미지 URL:', url);
    return url;
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error);
    throw new Error('이미지 업로드에 실패했습니다');
  }
};
