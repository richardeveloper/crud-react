import { useState } from 'react';

export const useToast = () => {

  const [showToast, setShowToast] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [background, setBackground] = useState('success');

  const showSuccess = (title, message) => {
    setTitle(title);
    setMessage(message);
    setBackground('success');
    setShowToast(true);
  };

  const showError = (title, message) => {
    setTitle(title);
    setMessage(message);
    setBackground('danger');
    setShowToast(true);
  };

  const showWarning = (title, message) => {
    setTitle(title);
    setMessage(message);
    setBackground('warning');
    setShowToast(true);
  };

  const closeToast = () => {
    setShowToast(false);
  };

  return {
    showToast,
    closeToast,
    title,
    message,
    background,
    showSuccess,
    showError,
    showWarning,
  };
};

