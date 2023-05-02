import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { Message } from '../types/Message';
import { messages } from '../utils/services/firebase/message/common';
import { useEffect } from 'react';

export const useMessageListener = (callback: (messages: Message[]) => void) => {
  useEffect(() => {
    const queryRef = query(messages, where('createdAt', '>', new Date()), orderBy('createdAt'));

    const unsub = onSnapshot(queryRef, (update) => {
      const messages = update.docs.map((doc) => doc.data());
      callback(messages);
    });

    return () => unsub();
  }, [callback]);
};
