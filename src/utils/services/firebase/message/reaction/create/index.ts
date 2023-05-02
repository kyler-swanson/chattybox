import { arrayUnion, doc } from 'firebase/firestore';
import { Message } from '../../../../../../types/Message';
import { createAction } from '../../../auth/createAction';
import { getCurrentUser } from '../../../auth/getCurrentUser';
import { messages } from '../../common';

export const createReaction = async (message: Message, emoji: string) => {
  const user = getCurrentUser();

  if (!user) return;

  try {
    const newReactionRef = doc(messages, message.id);

    const action = createAction();
    action.update(newReactionRef, {
      reactions: arrayUnion({
        emoji,
        authorUid: user.uid,
        authorName: user.displayName || 'Anonymous'
      })
    });

    await action.commit();
  } catch (error) {
    alert('Something went wrong, please try again.');
    console.error(error);
  }
};
