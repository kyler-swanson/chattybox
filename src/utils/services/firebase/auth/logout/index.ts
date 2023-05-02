import { auth } from '../../config';

export const logOut = async () => {
  await auth.signOut();
};
