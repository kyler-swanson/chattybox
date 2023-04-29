type CharacterCountProps = {
  count: number;
  maxLength: number;
  extraClasses?: string;
};

export default function CharacterCount({ count, maxLength, extraClasses = '' }: CharacterCountProps) {
  return (
    <div className={`text-xs text-gray-500 dark:text-gray-400 ${extraClasses}`}>
      {count} / {maxLength}
    </div>
  );
}
