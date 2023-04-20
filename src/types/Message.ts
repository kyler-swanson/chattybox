import { Timestamp } from 'firebase/firestore';
import { Reaction } from './Reaction';

export interface Message {
  id: string;
  message: string;
  authorUid: string;
  authorName: string;
  authorPhoto: string;
  reactions: Reaction[];
  repliesTo: Message | null;
  edited: boolean;
  createdAt?: Timestamp;
}
