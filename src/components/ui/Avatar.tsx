import * as RadixAvatar from '@radix-ui/react-avatar';
import React from 'react';

type AvatarProps = {
  size?: 'sm' | 'md' | 'lg';
  image: string | null;
  name: string;
};

export default function Avatar({ size = 'md', image, name }: AvatarProps) {
  const sizeClass = size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16';

  const [first, last] = name.split(' ');

  return (
    <RadixAvatar.Root
      className={`select-none inline-flex items-center justify-center align-middle overflow-hidden rounded-full dark:border dark:border-slate-500 ${sizeClass}`}
    >
      {image && (
        <RadixAvatar.Image
          className='w-full h-full object-cover'
          src={image}
          alt={`${name}`}
          referrerPolicy='no-referrer'
        />
      )}
      <RadixAvatar.Fallback
        className={`select-none inline-flex items-center justify-center align-middle overflow-hidden rounded-full bg-slate-200 ${sizeClass}`}
        delayMs={600}
      >
        {first[0] + last[0]}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}

Avatar.Skeleton = function AvatarSkeleton({ size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16';

  return (
    <div
      className={`select-none inline-flex items-center justify-center align-middle overflow-hidden rounded-full bg-slate-200 animate-pulse ${sizeClass}`}
    />
  );
};
