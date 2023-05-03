import { Grid, SearchBar, SearchContext, SearchContextManager } from '@giphy/react-components';
import { useContext } from 'react';
import { giphyConfig } from '../../utils/services/giphy/config';
import { IGif } from '@giphy/js-types';

type GiphyPickerProps = {
  onGifClick: (gif: IGif, e: any) => void;
};

export default function GiphyPicker({ onGifClick }: GiphyPickerProps) {
  const Picker = () => {
    const { fetchGifs, searchKey } = useContext(SearchContext);

    return (
      <div className='flex flex-col gap-2 h-[400px] p-3 animate-in slide-in-from-right-2 shadow-md bg-white border border-slate-100 rounded-md overflow-y-scroll dark:bg-slate-700 dark:border-slate-600'>
        <SearchBar className='sticky top-0 z-10 m-1 bg-white rounded-md dark:bg-slate-700 dark:border-slate-600 [&>input]:dark:bg-slate-700 [&>input]:dark:text-gray-50' />
        <Grid
          key={searchKey}
          columns={3}
          width={300}
          hideAttribution={true}
          fetchGifs={fetchGifs}
          noLink={true}
          onGifClick={onGifClick}
        />
      </div>
    );
  };

  return (
    <SearchContextManager apiKey={giphyConfig.apiKey!}>
      <Picker />
    </SearchContextManager>
  );
}
