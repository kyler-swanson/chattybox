import { HiChatAlt2 } from 'react-icons/hi';
import Login from './Login';

const Logo = () => (
  <div className='flex items-center'>
    <HiChatAlt2 className='text-5xl text-violet-950' />
    <h1 className='text-2xl font-bold ml-2'>ChattyBox</h1>
    <small className='ml-4 text-sm text-gray-500 hidden sm:block'>Join the conversation!</small>
  </div>
);

export default function Navbar() {
  return (
    <div className='flex gap-3 justify-between items-center'>
      <Logo />
      <Login />
    </div>
  );
}
