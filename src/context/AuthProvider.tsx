import { User, onAuthStateChanged } from 'firebase/auth';
import { ReactNode, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { AuthContext } from './AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState<string | null>(null);
  const isSignIn = !!user;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().nickname) {
          setNickname(userDoc.data().nickname);
        }
        setUser(currentUser);
      } else {
        setUser(null);
        setNickname(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && user && !nickname && pathname !== '/create-nickname') {
      navigate('/create-nickname');
    }
  }, [loading, user, nickname, pathname, navigate]);

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, isSignIn, nickname, setNickname }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
