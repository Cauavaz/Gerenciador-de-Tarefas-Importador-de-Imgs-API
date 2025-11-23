import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Fade from '@mui/material/Fade';

const Modal = ({
  open,
  onClose,
  children,
  disableEscapeKeyDown = false,
  closeAfterTransition = false,
  hideBackdrop = false,
  ...other
}) => {
  useEffect(() => {
    if (!disableEscapeKeyDown && open) {
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          onClose?.();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, disableEscapeKeyDown, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      style={{
        position: 'fixed',
        zIndex: 1300,
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...other}
    >
      {!hideBackdrop && (
        <Fade in={open}>
          <div
            onClick={onClose}
            style={{
              position: 'fixed',
              zIndex: -1,
              inset: 0,
              backgroundColor: 'rgb(0 0 0 / 0.7)',
              WebkitTapHighlightColor: 'transparent',
            }}
          />
        </Fade>
      )}
      <Fade in={open}>
        <div style={{ position: 'relative', zIndex: 1301 }}>
          {children}
        </div>
      </Fade>
    </div>,
    document.body
  );
};

export default Modal;
