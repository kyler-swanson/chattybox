import { doc } from 'firebase/firestore';
import { createAction } from '../../auth/createAction';
import { getCurrentUser } from '../../auth/getCurrentUser';
import { messages } from '../common';
import { deleteMessage } from '../delete';

export const editMessage = async (messageId: string, message: string) => {
  if (!getCurrentUser()) return;

  if (message.length === 0) {
    deleteMessage(messageId);
    return;
  }

  try {
    const action = createAction();
    action.update(doc(messages, messageId), {
      message,
      edited: true
    });

    await action.commit();
  } catch (error) {
    alert('Something went wrong, please try again.');
    console.error(error);
  }
};
