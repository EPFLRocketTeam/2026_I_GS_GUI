import "./deleteModal.css";
import { getRadioUid } from "../../pages/radioConfig/radioUtils/radioIO";

type DeleteModalProps = {
  readonly radio?: any;
  readonly index?: number;
  readonly itemName?: string;
  readonly title?: string;
  readonly message?: string;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
};

function DeleteModal({
  radio,
  index,
  itemName,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  const defaultName =
    itemName ?? (radio ? `Radio ${getRadioUid(radio) ?? index}` : "this item");

  return (
    <div className="radio-modal-overlay" onClick={onCancel}>
      <div className="radio-modal" onClick={(e) => e.stopPropagation()}>
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
