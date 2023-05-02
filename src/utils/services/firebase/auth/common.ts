import { UserInfo } from '../../../../types/UserInfo';
import { db } from '../config';
import { createCollection } from '../utils';

export const users = createCollection<UserInfo>(db, 'users');
