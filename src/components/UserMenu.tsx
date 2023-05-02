import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { TbLogout } from 'react-icons/tb';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Avatar from './ui/Avatar';
import { useCallback } from 'react';

export default function UserMenu() {
  const itemStyles =
    'flex items-center rounded-sm pl-3 pr-10 h-8 text-sm text-violet-950 outline-none cursor-pointer leading-none data-[highlighted]:bg-violet-900 data-[highlighted]:text-white dark:text-gray-50 dark:data-[highlighted]:bg-violet-600 dark:data-[highlighted]:text-white';

  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogOut = useCallback(() => {
    signOut().catch((error) => {
      alert('Logout failed. Please try again.');
      console.log(error);
    });
  }, [signOut]);

  const handleSwitchTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  return (
    <>
      {user && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className='select-none'>
            <Avatar size='sm' image={user.photoURL} name={user.displayName ? user.displayName : '?'} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className='min-w-[8rem] p-1 animate-in slide-in-from-top-2 shadow-md bg-white border border-slate-100 rounded-md overflow-hidden dark:bg-slate-700 dark:border-slate-600'
              sideOffset={4}
              align='end'
            >
              <div className='p-2'>
                <p className='font-medium dark:text-gray-50'>{user.displayName}</p>
                <p className='w-[200px] text-sm text-slate-600 dark:text-gray-400'>{user.email}</p>
              </div>
              <DropdownMenu.Separator className='m-1 h-px bg-slate-100 dark:bg-slate-600' />
              <DropdownMenu.Item className={itemStyles} onSelect={handleSwitchTheme}>
                {theme === 'light' && (
                  <>
                    <MdDarkMode className='mr-2' /> Dark Mode
                  </>
                )}
                {theme === 'dark' && (
                  <>
                    <MdLightMode className='mr-2' /> Light Mode
                  </>
                )}
              </DropdownMenu.Item>
              <DropdownMenu.Item className={itemStyles} onSelect={handleLogOut}>
                <TbLogout className='mr-2' /> Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </>
  );
}
