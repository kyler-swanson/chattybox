import { createContext, useCallback, useContext, useState } from 'react';
import { useCooldown } from '../hooks/useCooldown';
import { useMessageListener } from '../hooks/useMessagesListener';
import { Message } from '../types/Message';
import { Reaction } from '../types/Reaction';
import { createMessage } from '../utils/services/firebase/message/create';
import { deleteMessage } from '../utils/services/firebase/message/delete';
import { editMessage } from '../utils/services/firebase/message/edit';
import { createReaction } from '../utils/services/firebase/message/reaction/create';
import { deleteReaction } from '../utils/services/firebase/message/reaction/delete';
import { useAuth } from './AuthContext';

const ACTION_COOLDOWN = 500;

type ChatContextType = {
  message: string;
  setMessage: (message: string) => void;

  messages: Message[];
  sendMessage: () => Promise<void>;
  removeMessage: (message: Message) => Promise<void>;

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

  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [replyingMessage, setReplyingMessage] = useState<Message | null>(null);

  const { tryAction } = useCooldown(ACTION_COOLDOWN);

  const { user } = useAuth();

  const handleNewMessages = useCallback(
    (newMessages: Message[]) => {
      setMessages(newMessages);

      if (user) {
        setSentMessages(
          newMessages.filter((msg) => {
            return msg.authorUid === user.uid;
          })
        );
      }
    },
    [user]
  );

  useMessageListener(handleNewMessages);

  const sendMessage = async () => {
    tryAction(async () => {
      if (editingMessage) {
        // if we are editing, we don't want to send a message
        await editMessage(editingMessage.id, message);
        setEditingMessage(null);
      } else {
        // if we are replying, we want to send a message with the reply, otherwise just send a message
        await createMessage(message, replyingMessage);
        setReplyingMessage(null);
      }

      setMessage('');
    }, 'You must wait before sending a message!');
  };

  const removeMessage = async (message: Message) => {
    tryAction(async () => await deleteMessage(message.id), 'You must wait before deleting a message!');
  };

  const addReaction = async (message: Message, emoji: string) => {
    tryAction(async () => await createReaction(message, emoji), 'You must wait before reacting to a message!');
  };

  const removeReaction = async (message: Message, reaction: Reaction) => {
    tryAction(async () => await deleteReaction(message, reaction), 'You must wait before removing a reaction!');
  };

  const startEditing = (message: Message | null = null) => {
    // can't edit a message when replying to another message
    if (replyingMessage) {
      setReplyingMessage(null);
    }

    // use the last sent message if no message is provided
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

  return {
    message,
    messages,
    editingMessage,
    replyingMessage,
    setMessage,
    sendMessage,
    removeMessage,
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
