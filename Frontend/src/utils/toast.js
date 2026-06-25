import { toast } from 'react-toastify';

export const successToast = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  });
};

export const errorToast = (message) => {
  const msg = typeof message === 'string' 
    ? message 
    : message?.response?.data?.message || message?.response?.data?.error || message?.message || 'Something went wrong';
  
  toast.error(msg, {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  });
};
