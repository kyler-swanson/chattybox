import { useEffect, useRef, useState } from 'react';
import { HiReply } from 'react-icons/hi';
import { TbMarkdown, TbSend } from 'react-icons/tb';
import { RxCross1 } from 'react-icons/rx';
import { AiFillEdit } from 'react-icons/ai';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import useAutosizeTextArea from '../hooks/useAutosizeTextArea';
import Button from './ui/Button';
import CharacterCount from './ui/CharacterCount';
import Spinner from './ui/Spinner';

const MAX_LENGTH = 500;

export default function MessageInput() {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { user } = useAuth();
  const { message, editingMessage, replyingMessage, setMessage, sendMessage, startEditing, cancelEdit, cancelReply } =
    useChat();

  const [loading, setLoading] = useState<boolean>(false);

  useAutosizeTextArea(inputRef.current, message);

  useEffect(() => {
    if (editingMessage || replyingMessage) {
      // must wait until textarea is mounted
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 100);
    }
  }, [editingMessage, replyingMessage]);

  const handleSendMessage = async (): Promise<void> => {
    setLoading(true);
    await sendMessage();
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    if (e.target.value.length > MAX_LENGTH) {
      return;
    }

    setMessage(e.target.value);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (user && e.key === 'Enter' && !e.shiftKey && message.trim().length > 0) {
      handleSendMessage();
    }

    if (user && e.key === 'ArrowUp') {
      startEditing();
    }

    if (user && e.key === 'Escape') {
      cancelEdit();
      cancelReply();
    }
  };

  return (
    <>
      {replyingMessage && (
        <div className='flex items-center gap-2 animate-in slide-in-from-top-5'>
          <HiReply className='text-xl' />
          <p className='truncate'>
            Replying to <span className='font-bold'>{replyingMessage.authorName}</span>
          </p>
          <button onClick={() => cancelReply()}>
            <RxCross1 className='text-sm' />
          </button>
        </div>
      )}
      {editingMessage && (
        <div className='flex items-center gap-2 animate-in slide-in-from-top-5'>
          <AiFillEdit className='text-xl' />
          <p>Editing</p>
          <button onClick={() => cancelEdit()}>
            <RxCross1 className='text-sm' />
          </button>
        </div>
      )}
      <div className='flex gap-2'>
        <div className='p-2 grow relative border rounded-lg focus-within:outline-none focus-within:ring-2 ring-offset-3 ring-blue-500'>
          <textarea
            className='block w-11/12 h-full resize-none focus:outline-none'
            name='message'
            value={message}
            onChange={handleChange}
            onKeyDown={handleEnter}
            disabled={!user || loading}
            placeholder='Enter a message...'
            autoComplete='off'
            ref={inputRef}
          ></textarea>
          <a
            target='_blank'
            rel='noreferrer'
            href='https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax'
          >
            <TbMarkdown className='absolute right-0 top-2/4 -translate-x-4 -translate-y-2/4' />
          </a>
        </div>
        <Button
          type='primary'
          onClick={() => handleSendMessage()}
          disabled={!user || loading || message.trim().length === 0}
        >
          {loading ? <Spinner /> : <TbSend className='text-xl' />}
        </Button>
      </div>
      <CharacterCount count={message.length} maxLength={MAX_LENGTH} />
    </>
  );
}
