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
import { db } from '../firebase/firebaseConfig';
import { BOARD_NAMES } from '../constant/boardConfig';
import { IPost } from '../types/post';
import { uploadImage } from '../firebase/firestoreService';

const tokenizeText = (text: string): string[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const plainText = doc.body.textContent || '';

  return plainText
    .toLowerCase()
    .split(/\s+/)
    .filter(token => token);
};

/** 게시물 작성 */
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
  const imageUrl = imageFile ? await uploadImage(imageFile) : null;

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

/** 게시물 조회 */
export const getPost = async (
  boardName: string,
  postId?: string
): Promise<IPost | IPost[]> => {
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
        likeByUsers: data.likeByUsers || [],
        imageUrl: data.imageUrl || null
      } as IPost;
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

/** 게시물 삭제 */
export const deletePost = async (boardName: string, postId: string) => {
  await deleteDoc(doc(db, boardName, postId));
};

/** 게시물 수정 */
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
  const imageUrl = updatedData.imageFile
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

/** 검색어로 게시물 조회 */
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
        createdAt: doc.data().createdAt.toDate(),
        imageUrl: doc.data().imageUrl || null
      });
    }
  }
  return results.sort((a, b) => b.createdAt - a.createdAt);
};

/** 인기 게시물 조회 */
export const getTopPosts = async (boardName: string): Promise<IPost[]> => {
  const postsCollection = collection(db, boardName);
  const q = query(postsCollection, orderBy('likeCount', 'desc'), limit(3));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      nickname: data.nickname,
      category: data.category,
      purpose: data.purpose || null,
      createdAt: data.createdAt.toDate(),
      likeCount: data.likeCount || 0,
      likeByUsers: data.likeByUsers || []
    } as IPost;
  });
};
