import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import Dialog from '../../components/Dialog/Dialog';

import './NotificationProvider.css';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (notification && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [notification]);

  const closeDialog = () => {
    setNotification(null);
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Dialog toggleDialog={closeDialog} ref={dialogRef}>
        {notification && (
          <Stack sx={{ width: '100%' }} spacing={2}>
            <div className="notif-box">
              <Alert className="notification" severity={notification.type}>
                {notification.message}
              </Alert>
            </div>
          </Stack>
        )}
      </Dialog>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};

export default NotificationProvider;
