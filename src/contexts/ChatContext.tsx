import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Message } from '../types/Message';
import {
  addMessage,
  editMessage,
  deleteMessage as fbDelete,
  addReaction as fbAddReaction,
  removeReaction as fbRemoveReaction,
  messagesCollection
} from '../utils/firebase';
import { useAuth } from './AuthContext';
import { Reaction } from '../types/Reaction';

const ACTION_DELAY = 500;

type ChatContextType = {
  message: string;
  setMessage: (message: string) => void;

  messages: Message[];
  sendMessage: () => Promise<void>;
  deleteMessage: (message: Message) => Promise<void>;

  editingMessage: Message | null;
  startEditing: (message?: Message | null) => void;
  cancelEdit: () => void;

  replyingMessage: Message | null;
  startReplying: (message: Message) => void;
  cancelReply: () => void;

  addReaction: (message: Message, emoji: string) => Promise<void>;
  removeReaction: (message: Message, reaction: Reaction) => Promise<void>;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  return useContext(ChatContext)!;
};

const useProvideChat = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);

  const [lastAction, setLastAction] = useState<number>(0);

  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [replyingMessage, setReplyingMessage] = useState<Message | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const queryRef = query(
      messagesCollection,
      // get messages from last hour
      where('createdAt', '>', new Date(new Date().getTime() - 60 * 60 * 1000)),

      orderBy('createdAt')
    );

    const unsub = onSnapshot(queryRef, (update) => {
      const newMessages = update.docs.map((doc) => doc.data());

      setMessages(newMessages);

      if (user) {
        setSentMessages(
          newMessages.filter((msg) => {
            return msg.authorUid === user.uid;
          })
        );
      }
    });

    return () => unsub();
  }, [user]);

  const sendMessage = async () => {
    if (!isCalm()) {
      toast.error('You must wait before sending another message!');
      return;
    }

    setLastAction(new Date().getTime());

    if (editingMessage) {
      await editMessage(editingMessage.id, message);
      setEditingMessage(null);
    } else {
      await addMessage(message, replyingMessage);
      setReplyingMessage(null);
    }

    setMessage('');
  };

  const deleteMessage = async (message: Message) => {
    if (!isCalm()) {
      toast.error('You must wait before deleting another message!');
      return;
    }

    setLastAction(new Date().getTime());

    await fbDelete(message.id);
  };

  const isCalm = () => {
    return new Date().getTime() - lastAction > ACTION_DELAY;
  };

  const startEditing = (message: Message | null = null) => {
    // can't edit a message when replying to another message
    if (replyingMessage) {
      setReplyingMessage(null);
    }

    if (!message) {
      if (sentMessages.length === 0) {
        return;
      }

      message = sentMessages[sentMessages.length - 1];
    }

    setEditingMessage(message);
    setMessage(message.message);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setMessage('');
  };

  const startReplying = (message: Message) => {
    // can't reply to a message when editing another message
    if (editingMessage) {
      setEditingMessage(null);
    }

    setReplyingMessage(message);
  };

  const cancelReply = () => {
    setReplyingMessage(null);
  };

  const addReaction = async (message: Message, emoji: string) => {
    if (!isCalm()) {
      toast.error('You must wait before reacting to a message!');
      return;
    }

    setLastAction(new Date().getTime());

    await fbAddReaction(message, emoji);
  };

  const removeReaction = async (message: Message, reaction: Reaction) => {
    if (!isCalm()) {
      toast.error('You must wait before reacting to a message!');
      return;
    }

    setLastAction(new Date().getTime());

    await fbRemoveReaction(message, reaction);
  };

  return {
    message,
    messages,
    editingMessage,
    replyingMessage,
    setMessage,
    sendMessage,
    deleteMessage,
    startEditing,
    cancelEdit,
    startReplying,
    cancelReply,
    addReaction,
    removeReaction
  };
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const messageState = useProvideChat();

  return <ChatContext.Provider value={messageState}>{children}</ChatContext.Provider>;
};
