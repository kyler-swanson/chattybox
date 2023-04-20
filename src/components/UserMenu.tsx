import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './ui/Avatar';

export default function UserMenu() {
  const itemStyles =
    'flex items-center rounded-sm pl-3 pr-10 h-8 text-sm text-violet-950 outline-none cursor-pointer leading-none data-[highlighted]:bg-violet-900 data-[highlighted]:text-white';

  const { user, signOut } = useAuth();

  const handleLogOut = () => {
    signOut().catch((error) => {
      alert('Logout failed. Please try again.');
      console.log(error);
    });
  };

  return (
    <>
      {user && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className='select-none'>
            <Avatar size='sm' image={user.photoURL} name={user.displayName ? user.displayName : '?'} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className='min-w-[8rem] p-1 animate-in slide-in-from-top-2 shadow-md bg-white border border-slate-100 rounded-md overflow-hidden'
              sideOffset={4}
              align='end'
            >
              <div className='p-2'>
                <p className='font-medium'>{user.displayName}</p>
                <p className='w-[200px] text-sm text-slate-600'>{user.email}</p>
              </div>
              <DropdownMenu.Separator className='m-1 h-px bg-slate-100' />
              <DropdownMenu.Item className={itemStyles} onSelect={handleLogOut}>
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </>
  );
}
