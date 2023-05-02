import { useState } from 'react';
import toast from 'react-hot-toast';

export const useCooldown = (cooldown: number) => {
  const [lastAction, setLastAction] = useState<number>(0);

  const isCalm = () => {
    return new Date().getTime() - lastAction > cooldown;
  };

  const tryAction = (callback: () => void, errMessage: string) => {
    if (!isCalm()) {
      toast.error(errMessage);
      return;
    }

    setLastAction(new Date().getTime());

    callback();
  };

  return {
    tryAction
  };
};
