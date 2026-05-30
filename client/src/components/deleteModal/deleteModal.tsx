import "./deleteModal.css";
import { getRadioUid } from "../../pages/radioConfig/radioUtils/radioIO";
import { DeleteModalProps } from "../../types/types";
import {CONFIRM_DELETE, CANCEL_DELETE} from "../../constants/deleteModalConstants"

function DeleteModal({
  radio,
  index,
  itemName,
  title,
  message,
  confirmText = CONFIRM_DELETE,
  cancelText = CANCEL_DELETE,
  onConfirm,
  onCancel,
}: Readonly<DeleteModalProps>) {
  const defaultName =
    itemName ?? (radio ? `Radio ${getRadioUid(radio) ?? index}` : "this item");

  return (
    <div className="radio-modal-layer">
    <button 
      type = "button"
      onClick={onCancel}
      className="radio-modal-overlay"
      aria-label="Close modal"
      />
      <div className="radio-modal">
        <div className="radio-modal-title">
          {title ?? `Delete ${defaultName}?`}
        </div>
        <div className="radio-modal-text">
          {message ?? `Are you sure you want to delete ${defaultName}?`}
        </div>
        <div className="radio-modal-actions">
          <button className="btn" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
