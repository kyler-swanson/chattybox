import { useChat } from '../contexts/ChatContext';
import UserMessage from './UserMessage';

export default function MessageBox() {
  const { messages } = useChat();

  return (
    <div className='p-4 grow border rounded-lg flex flex-col gap-y-4 overflow-y-scroll overflow-x-hidden'>
      {messages.map((message) => (
        <UserMessage key={message.id} message={message} />
      ))}
    </div>
  );
}
