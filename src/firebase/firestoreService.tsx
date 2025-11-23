import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

/** 이미지 업로드 */
export const uploadImage = async (file: File): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `images/${file.name}`);
  // await uploadBytes(storageRef, file);
  // return await getDownloadURL(storageRef);

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
