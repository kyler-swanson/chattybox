type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  type: 'primary' | 'secondary' | 'clear';
  onClick: () => void;
};

export default function Button({ children, disabled = false, type, onClick }: ButtonProps) {
  const buttonTypes = {
    primary: 'text-white bg-violet-950 hover:bg-violet-900',
    secondary: 'text-black border hover:bg-slate-100',
    clear: 'text-black'
  };

  return (
    <button
      className={`select-none rounded-lg px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-3 disabled:cursor-not-allowed disabled:opacity-70 ${buttonTypes[type]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
