import "./deleteRadioModal.css";
import { getRadioUid } from "../../pages/radioConfig/radioUtils/radioIO";

function DeleteRadioModal({ radio, index, onConfirm, onCancel }) {
  return (
    <div className="radio-modal-overlay" onClick={onCancel}>
      <div className="radio-modal" onClick={(e) => e.stopPropagation()}>
        <div className="radio-modal-title">Delete radio?</div>
        <div className="radio-modal-text">
          Are you sure you want to delete Radio {getRadioUid(radio) ?? index}?
        </div>
        <div className="radio-modal-actions">
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteRadioModal;