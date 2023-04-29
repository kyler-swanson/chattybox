import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { Message } from '../../types/Message';
import { Reaction } from '../../types/Reaction';

type ReactionButtonProps = {
  message: Message;
  reaction: Reaction;
};

export default function ReactionButton({ message, reaction }: ReactionButtonProps) {
  const { user } = useAuth();
  const { removeReaction } = useChat();

  return (
    <button
      className='py-1 px-2 rounded-md bg-slate-100 border animate-in slide-in-from-right-3 hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700'
      onClick={() => removeReaction(message, reaction)}
      disabled={!user || reaction.authorUid !== user.uid}
    >
      {reaction.emoji}
    </button>
  );
}
