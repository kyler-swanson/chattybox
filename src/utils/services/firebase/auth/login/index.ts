import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../config';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<void> => {
  //await auth.setPersistence(browserSessionPersistence);
  await signInWithPopup(auth, provider);
};
