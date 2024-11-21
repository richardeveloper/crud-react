import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastComponent = ({ show, title, message, background, onClose, delay = 3000, autohide = true }) => {
  return (
    <ToastContainer className="position-fixed bottom-0 end-0 p-3">
      <Toast show={show} onClose={onClose} bg={background} delay={delay} autohide={autohide}>
        <Toast.Header>
            <strong className="me-auto">{title}</strong>
          </Toast.Header>
        <Toast.Body>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastComponent;
