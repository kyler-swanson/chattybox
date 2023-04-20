import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { EmojiStyle, default as ReactEmojiPicker } from 'emoji-picker-react';

type EmojiPickerProps = {
  trigger: React.ReactNode;
  onEmojiClick: (emoji: any) => void;
  width?: number;
  height?: number;
};

export default function EmojiPicker({ trigger, onEmojiClick, width = 300, height = 400 }: EmojiPickerProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className='focus:outline-none'>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <ReactEmojiPicker
            width={width}
            height={height}
            lazyLoadEmojis={true}
            previewConfig={{ showPreview: false }}
            emojiStyle={EmojiStyle.NATIVE}
            onEmojiClick={onEmojiClick}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
