<script lang="ts">
  import { writable } from 'svelte/store';


export interface Notification {
  id: number;
  type: 'trip' | 'message' | 'invite' | 'activity' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
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