import { User, onAuthStateChanged } from 'firebase/auth';
import { ReactNode, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { AuthContext } from './AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import CreateNickname from '../pages/CreateNickname';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState<string>('');
  const isSignIn = !!user;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const fetchedNicname = userDoc.data().nickname;
          console.log('Fetched nickname: ', fetchedNicname);
          setNickname(fetchedNicname || currentUser.displayName || '사용자');
        }
        setUser(currentUser);
      } else {
        setUser(null);
        setNickname('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, isSignIn, nickname, setNickname }}>
      {!loading && (nickname === null ? <CreateNickname /> : children)}
    </AuthContext.Provider>
  );
};
