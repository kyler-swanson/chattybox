import { GoogleAuthProvider, User, browserSessionPersistence, signInWithPopup } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { UserInfo } from '../types/UserInfo';
import { auth, createUserInfo } from '../utils/firebase';

type AuthContextType = {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  return useContext(AuthContext)!;
};

export const useProvideAuth = () => {
  const [user, setUser] = useState<UserInfo | null>(null);

  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();

    await auth.setPersistence(browserSessionPersistence);
    const result = await signInWithPopup(auth, provider);

    await handleUser(result.user!);
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  const handleUser = async (rawUser: User) => {
    if (rawUser) {
      const newUser = await createUserInfo(rawUser);

      setUser(newUser!);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => await handleUser(user!));

    return () => unsub();
  }, [setUser]);

  return {
    user,
    setUser,
    signInWithGoogle,
    signOut
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
