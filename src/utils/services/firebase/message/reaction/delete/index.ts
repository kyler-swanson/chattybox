import { arrayRemove, doc } from 'firebase/firestore';
import { Message } from '../../../../../../types/Message';
import { Reaction } from '../../../../../../types/Reaction';
import { createAction } from '../../../auth/createAction';
import { getCurrentUser } from '../../../auth/getCurrentUser';
import { messages } from '../../common';

export const deleteReaction = async (message: Message, reaction: Reaction) => {
  const user = getCurrentUser();

  if (!user) return;

  try {
    const newReactionRef = doc(messages, message.id);

    const action = createAction();
    action.update(newReactionRef, {
      reactions: arrayRemove({
        emoji: reaction.emoji,
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
