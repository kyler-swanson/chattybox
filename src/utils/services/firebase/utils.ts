import { CollectionReference, DocumentData, Firestore, collection } from 'firebase/firestore';

export const createCollection = <T = DocumentData>(db: Firestore, name: string) => {
  return collection(db, name) as CollectionReference<T>;
};
