import { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { UserInfo } from '../types/UserInfo';
import { createUser } from '../utils/services/firebase/auth/createUser';
import { signInWithGoogle } from '../utils/services/firebase/auth/login';
import { logOut } from '../utils/services/firebase/auth/logout';
import { auth } from '../utils/services/firebase/config';

type AuthContextType = {
  user: UserInfo | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  return useContext(AuthContext)!;
};

export const useProvideAuth = () => {
  const [user, setUser] = useState<UserInfo | null>(null);

  const signIn = async () => {
    await signInWithGoogle();
  };

  const signOut = async () => {
    await logOut();
    setUser(null);
  };

  const handleUserUpdate = async (rawUser: User) => {
    if (rawUser) {
      const newUser = await createUser(rawUser);

      setUser(newUser!);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user: User | null) => await handleUserUpdate(user!));

    return () => unsub();
  }, [setUser]);

  return {
    user,
    signIn,
    signOut
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
