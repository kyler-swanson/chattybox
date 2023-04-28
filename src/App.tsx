import { Toaster } from 'react-hot-toast';
import Chat from './components/Chat';
import Navbar from './components/Navbar';
import './styles.css';

function App() {
  return (
    <>
      <div className='p-3 xs:p-5 flex flex-col gap-5 absolute inset-0'>
        <Navbar />
        <Chat />
      </div>
      <Toaster />
    </>
  );
}

export default App;
