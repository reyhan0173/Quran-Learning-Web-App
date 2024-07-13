import React from "react";
import { addMistake, removeMistake } from '../functions/mistakesFunctions';

const handleAddMistake = async () => {
  // await addMistake(studentId, courseId, current_posStr, verse, mistakes, setMistakes);
};

const handleRemoveMistake = async () => {
  // await removeMistake(studentId, courseId, current_posStr, setMistakes);
};

export default function MistakeButtons() {
  return (
    <div className="ayah-controls flex-row">
      <button
        className="ayah-add-mistake-button"
        onClick={handleAddMistake}
      >
        <i className={`fas fa-pen`}></i>
      </button>
      <button
        className="ayah-remove-mistake-button"
        onClick={handleRemoveMistake}
      >
        <i className={`fas fa-eraser`}></i>
      </button>
    </div>
  );
}
