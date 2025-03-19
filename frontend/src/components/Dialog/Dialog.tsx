import React, { forwardRef, useEffect } from 'react';

import './Dialog.css';

type DialogProps = {
  children: React.ReactNode;
  toggleDialog: () => void;
};

const DialogComponent = (
  { children, toggleDialog }: DialogProps,
  ref: React.Ref<HTMLDialogElement>,
) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      toggleDialog();
    }, 2000);

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
};

const Dialog = forwardRef(DialogComponent);

export default Dialog;
