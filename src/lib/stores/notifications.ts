import { writable } from 'svelte/store';

export const toastMessage = writable('');
export const showToast = writable(false);
export interface Notification {
  id: number;
  type: 'trip' | 'message' | 'invite' | 'activity' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}
// Optionally: define a helper function
export function triggerToast(message: string, duration = 3000) {
  toastMessage.set(message);
  showToast.set(true);
  setTimeout(() => {
    showToast.set(false);
  }, duration);
}

function createNotificationsStore() {
  const { subscribe, update, set } = writable<Notification[]>([]);

  return {
    subscribe,
    addNotification: (notification: Notification) => 
      update(notifications => [
        {...notification, id: Date.now()}, 
        ...notifications
      ]),
    markAsRead: (id: number) => 
      update(notifications => 
        notifications.map(n => 
          n.id === id ? {...n, read: true} : n
        )
      ),
    clearNotifications: () => set([]),
    markAllAsRead: () => 
      update(notifications => 
        notifications.map(n => ({...n, read: true}))
      )
  };
}

export const notifications = createNotificationsStore();
export const notificationsPanelOpen = writable(false);