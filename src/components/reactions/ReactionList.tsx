import { EmojiClickData } from 'emoji-picker-react';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../types/Message';
import ReactButton from './ReactButton';
import ReactionButton from './ReactionButton';
import { useChat } from '../../contexts/ChatContext';
import { useCallback } from 'react';

export default function ReactionList({ message }: { message: Message }) {
  const { user } = useAuth();
  const { addReaction } = useChat();

  const handleEmojiClick = useCallback(
    async (emojiData: EmojiClickData) => {
      await addReaction(message, emojiData.emoji);
    },
    [message, addReaction]
  );

  return (
    <div className={`inline-flex items-center flex-wrap gap-1 ${message.reactions.length === 0 && 'hidden'}`}>
      {message.reactions.map((reaction, i) => (
        <ReactionButton key={i} message={message} reaction={reaction} />
      ))}
      {user && <ReactButton onEmojiClick={handleEmojiClick} />}
    </div>
  );
}
