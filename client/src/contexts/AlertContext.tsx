import { createContext, useContext, useState, type ReactNode } from 'react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
}

interface AlertContextType {
  alerts: Alert[];
  showAlert: (type: AlertType, message: string) => void;
  hideAlert: (id: string) => void;
  showInfo: (message: string) => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
  showError: (message: string) => void;
  confirm: (message: string) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [confirmCallback, setConfirmCallback] = useState<((result: boolean) => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string>('');

  const showAlert = (type: AlertType, message: string) => {
    // eslint-disable-next-line react-hooks/purity
    const id = Math.random().toString(36).substring(7);
    const newAlert: Alert = { id, type, message };
    
    setAlerts(prev => [...prev, newAlert]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      hideAlert(id);
    }, 5000);
  };

  const hideAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const showInfo = (message: string) => showAlert('info', message);
  const showSuccess = (message: string) => showAlert('success', message);
  const showWarning = (message: string) => showAlert('warning', message);
  const showError = (message: string) => showAlert('error', message);

  const confirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmMessage(message);
      setConfirmCallback(() => resolve);
    });
  };

  const handleConfirm = (result: boolean) => {
    if (confirmCallback) {
      confirmCallback(result);
      setConfirmCallback(null);
      setConfirmMessage('');
    }
  };

  const getAlertClass = (type: AlertType) => {
    const classes = {
      info: 'alert-info',
      success: 'alert-success',
      warning: 'alert-warning',
      error: 'alert-error',
    };
    return classes[type];
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        showAlert,
        hideAlert,
        showInfo,
        showSuccess,
        showWarning,
        showError,
        confirm,
      }}
    >
      {children}

      {/* Alert Container - Fixed position at top right */}
      <div className="toast toast-top toast-end z-50">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            role="alert"
            className={`alert ${getAlertClass(alert.type)} shadow-lg min-w-75 max-w-md`}
          >
            {getAlertIcon(alert.type)}
            <span className="flex-1">{alert.message}</span>
            <button
              onClick={() => hideAlert(alert.id)}
              className="btn btn-sm btn-ghost"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Confirm Dialog Modal */}
      {confirmCallback && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Xác nhận</h3>
            <p className="py-4">{confirmMessage}</p>
            <div className="modal-action">
              <button
                onClick={() => handleConfirm(false)}
                className="btn btn-ghost"
              >
                Hủy
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className="btn btn-primary"
              >
                Xác nhận
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => handleConfirm(false)}></div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
