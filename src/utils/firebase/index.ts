import { initializeApp } from 'firebase/app';
import { getAuth, User } from 'firebase/auth';
import { getPerformance } from 'firebase/performance';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAnalytics } from 'firebase/analytics';
import {
  arrayUnion,
  arrayRemove,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  WriteBatch,
  writeBatch
} from 'firebase/firestore';
import { Message } from '../../types/Message';
import { Reaction } from '../../types/Reaction';
import { UserInfo } from '../../types/UserInfo';
import { config, RECAPTCHA_PUB_KEY } from './config';

const app = initializeApp(config);
const db = getFirestore(app);
const auth = getAuth(app);
const perf = getPerformance(app);
const analytics = getAnalytics(app);

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(RECAPTCHA_PUB_KEY!),
  isTokenAutoRefreshEnabled: true
});

const createCollection = <T = DocumentData>(name: string) => {
  return collection(db, name) as CollectionReference<T>;
};

export const messagesCollection = createCollection<Message>('messages');
export const usersCollection = createCollection<UserInfo>('users');

const createBatch = (): WriteBatch => {
  const batch = writeBatch(db);

  const userRef = doc(usersCollection, auth.currentUser?.uid);
  batch.update(userRef, {
    last_operation: serverTimestamp()
  });

  return batch;
};

const createUserInfo = async (user: User): Promise<UserInfo | void> => {
  try {
    const userRef = doc(usersCollection, user.uid);

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

const addMessage = async (message: string, repliesTo: Message | null = null) => {
  const user = auth.currentUser;

  if (!user) return;

  if (message.trim().length === 0) {
    return;
  }

  try {
    const newMessageRef = doc(messagesCollection);

    const batch = createBatch();
    batch.set(newMessageRef, {
      id: newMessageRef.id,
      message,
      authorUid: auth.currentUser?.uid,
      authorName: user.displayName || 'Anonymous',
      authorPhoto: user.photoURL || '',
      reactions: [] as Reaction[],
      repliesTo,
      edited: false,
      createdAt: serverTimestamp()
    });

    await batch.commit();
  } catch (error) {
    alert('Something went wrong, please try again.');
    console.error(error);
  }
};

const editMessage = async (messageId: string, message: string) => {
  if (!auth.currentUser) return;

  if (message.length === 0) {
    deleteMessage(messageId);
    return;
  }

  try {
    const batch = createBatch();
    batch.update(doc(messagesCollection, messageId), {
      message,
      edited: true
    });

    await batch.commit();
  } catch (error) {
    alert('Something went wrong, please try again.');
    console.error(error);
  }
};

const deleteMessage = async (messageId: string) => {
  if (!auth.currentUser) return;

  try {
    const batch = createBatch();
    batch.delete(doc(messagesCollection, messageId));

    await batch.commit();
  } catch (error) {
    alert('Something went wrong, please try again.');
    console.error(error);
  }
};

const addReaction = async (message: Message, emoji: string) => {
  if (!auth.currentUser) return;

  try {
    const newReactionRef = doc(messagesCollection, message.id);

    const batch = createBatch();
    batch.update(newReactionRef, {
      reactions: arrayUnion({
        emoji,
        authorUid: auth.currentUser?.uid,
        authorName: auth.currentUser?.displayName || 'Anonymous'
      })
    });

    await batch.commit();
  } catch (error) {
    alert('Something went wrong, please try again.');
    console.error(error);
  }
};

const removeReaction = async (message: Message, reaction: Reaction) => {
  if (!auth.currentUser) return;

  try {
    const newReactionRef = doc(messagesCollection, message.id);

    const batch = createBatch();
    batch.update(newReactionRef, {
      reactions: arrayRemove({
        emoji: reaction.emoji,
        authorUid: auth.currentUser?.uid,
        authorName: auth.currentUser?.displayName || 'Anonymous'
      })
    });

    await batch.commit();
  } catch (error) {
    alert('Something went wrong, please try again.');
    console.error(error);
  }
};

export {
  db,
  auth,
  perf,
  analytics,
  appCheck,
  createUserInfo,
  addMessage,
  editMessage,
  deleteMessage,
  addReaction,
  removeReaction
};
