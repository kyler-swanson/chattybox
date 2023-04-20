import { Timestamp } from 'firebase/firestore';

export interface UserInfo {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  last_operation: Timestamp;
}
