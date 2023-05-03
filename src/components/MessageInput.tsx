import { useCallback, useEffect, useRef, useState } from 'react';
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
import GiphyMenu from './gifs/GiphyMenu';
import { MdGif } from 'react-icons/md';
import { IGif } from '@giphy/js-types';

const MAX_LENGTH = 500;

export default function MessageInput() {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { user } = useAuth();
  const {
    message,
    editingMessage,
    replyingMessage,
    setMessage,
    sendMessage,
    sendGif,
    startEditing,
    cancelEdit,
    cancelReply
  } = useChat();

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

  const handleSendMessage = useCallback(async (): Promise<void> => {
    inputRef.current?.focus();

    setLoading(true);
    await sendMessage();
    setLoading(false);
  }, [sendMessage]);

  const handleSendGif = useCallback(
    async (gif: IGif, e: any): Promise<void> => {
      e.preventDefault();
      setLoading(true);
      await sendGif(gif);
      setLoading(false);
    },
    [sendGif]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
      if (e.target.value.length > MAX_LENGTH) {
        return;
      }

      setMessage(e.target.value);
    },
    [setMessage]
  );

  const handleEnter = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
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
    },
    [user, message, handleSendMessage, startEditing, cancelEdit, cancelReply]
  );

  return (
    <>
      {replyingMessage && (
        <div className='flex items-center gap-2 animate-in slide-in-from-top-5 dark:text-gray-50'>
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
        <div className='flex items-center gap-2 animate-in slide-in-from-top-5 dark:text-gray-50'>
          <AiFillEdit className='text-xl' />
          <p>Editing</p>
          <button onClick={() => cancelEdit()}>
            <RxCross1 className='text-sm' />
          </button>
        </div>
      )}
      <div className='flex gap-2'>
        <div className='p-2 grow relative border rounded-lg focus-within:outline-none focus-within:ring-2 ring-offset-3 ring-blue-500 dark:bg-slate-800 dark:border-slate-700'>
          <textarea
            className='block w-11/12 h-full resize-none focus:outline-none disabled:bg-white disabled:cursor-not-allowed dark:bg-slate-800 dark:text-gray-50'
            name='message'
            value={message}
            onChange={handleChange}
            onKeyDown={handleEnter}
            disabled={!user || loading}
            placeholder={!user ? 'Please log in to send messages.' : 'Enter a message...'}
            autoComplete='off'
            ref={inputRef}
          ></textarea>
          <a
            target='_blank'
            rel='noreferrer'
            href='https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax'
          >
            <TbMarkdown className='absolute right-0 top-2/4 -translate-x-4 -translate-y-2/4 dark:text-slate-400' />
          </a>
        </div>
        <GiphyMenu
          trigger={<MdGif className='text-4xl text-violet-950 dark:text-gray-50' />}
          onGifClick={handleSendGif}
        />
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
