import { MdOutlineAddReaction } from 'react-icons/md';
import EmojiPicker from './EmojiPicker';

type ReactButtonProps = {
  onEmojiClick: (emoji: any) => void;
};

export default function ReactButton({ onEmojiClick }: ReactButtonProps) {
  const ReactButtonTrigger = <MdOutlineAddReaction className='text-xl' />;

  return (
    <div className='inline-block flex items-center justify-middle p-1 dark:text-gray-50'>
      <EmojiPicker trigger={ReactButtonTrigger} onEmojiClick={onEmojiClick} />
    </div>
  );
}
