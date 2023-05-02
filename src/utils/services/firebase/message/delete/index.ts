import { doc } from 'firebase/firestore';
import { createAction } from '../../auth/createAction';
import { getCurrentUser } from '../../auth/getCurrentUser';
import { messages } from '../common';

export const deleteMessage = async (messageId: string) => {
  if (!getCurrentUser()) return;

  try {
    const action = createAction();
    action.delete(doc(messages, messageId));

    await action.commit();
  } catch (error) {
    alert('Something went wrong, please try again.');
    console.error(error);
  }
};
