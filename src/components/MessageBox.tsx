import { useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import UserMessage from './UserMessage';

export default function MessageBox() {
  const ref = useRef<null | HTMLDivElement>(null);

  const { messages } = useChat();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className='p-4 grow border rounded-lg flex flex-col gap-y-4 overflow-y-scroll overflow-x-hidden dark:bg-slate-800 dark:border-slate-700'>
      {messages.map((message) => (
        <UserMessage key={message.id} message={message} />
      ))}
      <div ref={ref}></div>
    </div>
  );
}
