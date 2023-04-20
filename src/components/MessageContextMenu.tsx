import * as ContextMenu from '@radix-ui/react-context-menu';
import { EmojiClickData } from 'emoji-picker-react';
import { FiEdit2 } from 'react-icons/fi';
import { HiReply } from 'react-icons/hi';
import { MdOutlineAddReaction } from 'react-icons/md';
import { RiChatDeleteLine } from 'react-icons/ri';
import EmojiPicker from './reactions/EmojiPicker';

type MessageContextMenuProps = {
  children: React.ReactNode;
  reply: () => void;
  addReaction: (emoji: EmojiClickData) => Promise<void>;
  editMessage: () => Promise<void>;
  deleteMessage: () => Promise<void>;
  isMine?: boolean;
  disabled?: boolean;
};

export default function MessageContextMenu({
  children,
  reply,
  addReaction,
  editMessage,
  deleteMessage,
  disabled = false,
  isMine = false
}: MessageContextMenuProps) {
  const itemStyles =
    'flex items-center rounded-sm pl-3 pr-10 h-8 text-sm text-violet-950 outline-none cursor-pointer leading-none data-[highlighted]:bg-violet-900 data-[highlighted]:text-white';

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className='cursor-context-menu' disabled={disabled}>
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className='min-w-[8rem] p-1 animate-in slide-in-from-right-2 shadow-md bg-white border border-slate-100 rounded-md overflow-hidden'>
          <EmojiPicker
            trigger={
              <ContextMenu.Item className={itemStyles} onSelect={(e) => e.preventDefault()}>
                <MdOutlineAddReaction className='mr-2' /> Add Reaction
              </ContextMenu.Item>
            }
            onEmojiClick={addReaction}
          />
          <ContextMenu.Item className={itemStyles} onSelect={() => reply()}>
            <HiReply className='mr-2' /> Reply
          </ContextMenu.Item>
          {isMine && (
            <>
              <ContextMenu.Item className={itemStyles} onSelect={() => editMessage()}>
                <FiEdit2 className='mr-2' /> Edit
              </ContextMenu.Item>
              <ContextMenu.Item className={itemStyles} onSelect={() => deleteMessage()}>
                <RiChatDeleteLine className='mr-2' /> Delete
              </ContextMenu.Item>
            </>
          )}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
