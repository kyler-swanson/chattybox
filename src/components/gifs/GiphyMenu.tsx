import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import GiphyPicker from './GiphyPicker';
import { IGif } from '@giphy/js-types';

type GiphyButtonProps = {
  trigger: React.ReactNode;
  onGifClick: (gif: IGif, e: any) => void;
};

export default function GiphyMenu({ trigger, onGifClick }: GiphyButtonProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Content className='m-3'>
        <GiphyPicker onGifClick={onGifClick} />
        <DropdownMenu.Arrow className='fill-violet-950 dark:fill-gray-50' />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
