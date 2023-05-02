import { Message } from '../../../../types/Message';
import { db } from '../config';
import { createCollection } from '../utils';

export const messages = createCollection<Message>(db, 'messages');
