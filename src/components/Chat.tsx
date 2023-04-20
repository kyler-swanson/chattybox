import { ChatProvider } from '../contexts/ChatContext';
import MessageBox from './MessageBox';
import MessageInput from './MessageInput';

export default function Chat() {
  return (
    <ChatProvider>
      <MessageBox />
      <MessageInput />
    </ChatProvider>
  );
}
