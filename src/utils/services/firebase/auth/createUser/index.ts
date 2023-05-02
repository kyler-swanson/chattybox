import { User } from 'firebase/auth';
import { UserInfo } from '../../../../../types/UserInfo';
import { users } from '../common';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

export const createUser = async (user: User): Promise<UserInfo | void> => {
  try {
    const userRef = doc(users, user.uid);

    await setDoc(
      userRef,
      {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        last_operation: serverTimestamp()
      },
      { merge: true }
    );

    const userDoc = await getDoc(userRef);

    return userDoc.data();
  } catch (error) {
    alert('Something went wrong, please try again.');
    console.error(error);
  }
};
