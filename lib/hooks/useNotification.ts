import { useState, useEffect } from 'react';

export function useNotification(): boolean {
  const [isNotificationAllowed, setIsNotificationAllowed] = useState(false);

  useEffect(() => {
    const listenToPermissionChange = async (): Promise<void> => {
      const permission = await navigator.permissions.query({
        name: 'notifications'
      });

      permission.addEventListener('change', (): void => {
        const notificationStatus = permission.state === 'granted';
        setIsNotificationAllowed(notificationStatus);
      });
    };

    const notificationStatus = Notification.permission === 'granted';
    setIsNotificationAllowed(notificationStatus);

    void listenToPermissionChange();
  }, []);

  return isNotificationAllowed;
}
