import { useEffect, useRef } from 'react';
import { IoReturnUpForward } from 'react-icons/io5';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { Message } from '../types/Message';
import { formatDate } from '../utils/helpers';
import MessageContextMenu from './MessageContextMenu';
import ReactionList from './reactions/ReactionList';
import Avatar from './ui/Avatar';
import { EmojiClickData } from 'emoji-picker-react';

export default function UserMessage({ message }: { message: Message }) {
  const ref = useRef<null | HTMLDivElement>(null);

  const { user } = useAuth();
  const { deleteMessage, addReaction, startEditing, startReplying } = useChat();

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  const handleReply = async (): Promise<void> => {
    startReplying(message);
  };

  const handleReaction = async (emoji: EmojiClickData): Promise<void> => {
    await addReaction(message, emoji.emoji);
  };

  const handleEditMessage = async (): Promise<void> => {
    startEditing(message);
  };

  const handleDeleteMessage = async (): Promise<void> => {
    await deleteMessage(message);
  };

  return (
    <div ref={ref}>
      <MessageContextMenu
        reply={handleReply}
        addReaction={handleReaction}
        editMessage={handleEditMessage}
        deleteMessage={handleDeleteMessage}
        isMine={user?.uid === message.authorUid}
        disabled={!user}
      >
        {message.repliesTo && (
          <div className='flex gap-x-3 translate-x-5'>
            <IoReturnUpForward />
            <small className='mr-2 truncate'>
              <span className='font-bold'>{message.repliesTo.authorName}</span> {message.repliesTo.message}
            </small>
          </div>
        )}
        <div className='flex gap-x-3 animate-in slide-in-from-bottom-3'>
          <div className='shrink-0'>
            <Avatar image={message.authorPhoto} name={message.authorName} />
          </div>
          <div className='grow select-none'>
            <p className='font-bold truncate'>
              {message.authorName}{' '}
              {message.createdAt && <small className='ml-1 font-thin'>{formatDate(message.createdAt.toDate())}</small>}
            </p>
            <span className='prose'>
              <ReactMarkdown>{message.message}</ReactMarkdown>
            </span>
            {message.edited && <small className='block text-gray-700 font-thin'>(edited)</small>}
            <ReactionList message={message} />
          </div>
        </div>
      </MessageContextMenu>
    </div>
  );
}
