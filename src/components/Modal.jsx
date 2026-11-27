import { useEffect, useRef } from "react";
import "./Modal.css";

export default function Modal({ isOpen, onClose, titleId, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  function handleBackdropClick(event) {
    if (event.target === dialogRef.current) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        className="modal-close"
        onClick={onClose}
        aria-label="Chiudi finestra"
      >
        ×
      </button>
      <div className="modal-content">{children}</div>
    </dialog>
  );
}
