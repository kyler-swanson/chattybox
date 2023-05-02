import { WriteBatch, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { users } from '../common';
import { auth, db } from '../../config';

export const createAction = (): WriteBatch => {
  const batch = writeBatch(db);

  const userRef = doc(users, auth.currentUser?.uid);
  batch.update(userRef, {
    last_operation: serverTimestamp()
  });

  return batch;
};
