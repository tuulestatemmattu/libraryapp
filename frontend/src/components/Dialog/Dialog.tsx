import React, { forwardRef, useEffect } from 'react';
import './Dialog.css';

type Props = {
  children: React.ReactNode;
  toggleDialog: () => void;
};

const Dialog = forwardRef<HTMLDialogElement, Props>(({ children, toggleDialog }, ref) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      toggleDialog();
    }, 20000);

    return () => clearTimeout(timeout);
  }, [toggleDialog]);

  return (
    <dialog
      className="dialog-box"
      ref={ref}
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          toggleDialog();
        }
      }}
    >
      {children}
    </dialog>
  );
});

export default Dialog;
