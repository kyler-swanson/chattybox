import { auth } from '../../config';

export const getCurrentUser = () => {
  return auth.currentUser;
};
