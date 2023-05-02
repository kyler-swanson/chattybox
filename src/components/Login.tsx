import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import UserMenu from './UserMenu';
import { useCallback, useState } from 'react';
import Avatar from './ui/Avatar';

export default function Login() {
  const { user, signIn } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = useCallback(() => {
    setLoading(true);

    signIn()
      .then(() => setLoading(false))
      .catch((error) => {
        alert(error);
        console.log(error);
        setLoading(false);
      });
  }, [signIn]);

  return (
    <>
      {!user ? (
        loading ? (
          <Avatar.Skeleton size='sm' />
        ) : (
          <Button type='primary' onClick={handleLogin}>
            <FaGoogle className='text-xl inline' />
            <small className='hidden xs:inline xs:ml-2'>Login with Google</small>
          </Button>
        )
      ) : (
        <UserMenu />
      )}
    </>
  );
}
