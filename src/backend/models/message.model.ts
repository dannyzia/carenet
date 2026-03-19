/** Chat message in a conversation */
export interface ChatMessage {
  id: string;
  sender: "self" | "other";
  senderName?: string;
  text: string;
  time: string;
  read: boolean;
  attachment?: { type: "image" | "file"; url: string; name?: string };
}

/** Conversation thread summary */
export interface ConversationThread {
  id: string;
  contactName: string;
  contactRole: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  avatar?: string;
  online?: boolean;
}

/** Conversation item for messages list (used across roles) */
export interface ConversationItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  pinned?: boolean;
}