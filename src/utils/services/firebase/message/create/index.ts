import { doc, serverTimestamp } from 'firebase/firestore';
import { Message } from '../../../../../types/Message';
import { Reaction } from '../../../../../types/Reaction';
import { getCurrentUser } from '../../auth/getCurrentUser';
import { messages } from '../common';
import { createAction } from '../../auth/createAction';

export const createMessage = async (message: string, repliesTo: Message | null = null) => {
  const user = getCurrentUser();

  if (!user) return;

  if (message.trim().length === 0) {
    return;
  }

  try {
    const newMessageRef = doc(messages);

    const action = createAction();
    action.set(newMessageRef, {
      id: newMessageRef.id,
      message,
      authorUid: user.uid,
      authorName: user.displayName || 'Anonymous',
      authorPhoto: user.photoURL || '',
      reactions: [] as Reaction[],
      repliesTo,
      edited: false,
      createdAt: serverTimestamp()
    });

    await action.commit();
  } catch (error) {
    alert('Something went wrong, please try again.');
    console.error(error);
  }
};
