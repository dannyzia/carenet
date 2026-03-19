import { createContext, useContext } from "react";
import type { UnreadCounts } from "./useUnreadCounts";

const noop = () => {};

const defaultValue: UnreadCounts = {
  messages: 0,
  notifications: 0,
  decrementMessages: noop,
  decrementNotifications: noop,
  refresh: noop,
};

export const UnreadCountsContext = createContext<UnreadCounts>(defaultValue);

/**
 * Consume the shared unread-counts object anywhere below AuthenticatedLayout.
 * ChatPanel uses this to optimistically decrement the badge when a conversation
 * is opened and its messages are marked as read.
 */
export function useUnreadCountsCtx(): UnreadCounts {
  return useContext(UnreadCountsContext);
}
