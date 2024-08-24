import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPen, faEraser } from '@fortawesome/free-solid-svg-icons';

const getSelectedText = () => {
  console.log("Getting selected text");
  let text = '';
  let parentElement = null;

  if (window.getSelection) {
    const selection = window.getSelection();
    text = selection.toString();
    if (selection.rangeCount > 0) {
      let range = selection.getRangeAt(0);
      parentElement = range.commonAncestorContainer;

      // Traverse up the DOM tree to find the element with the 'data-url' attribute
      while (parentElement && !parentElement.getAttribute('data-url')) {
        parentElement = parentElement.parentElement;
      }
    }
  } else if (document.selection && document.selection.type !== "Control") {
    const selection = document.selection.createRange();
    text = selection.text;
    parentElement = selection.parentElement();

    // Traverse up the DOM tree to find the element with the 'data-url' attribute
    while (parentElement && !parentElement.getAttribute('data-url')) {
      parentElement = parentElement.parentElement;
    }
  }

  const dataUrl = parentElement ? parentElement.getAttribute('data-url') : 'null';
  console.log(`selected text: ||${text}|| data-url: ||${dataUrl}||`);
  return { text, parentElement, current_posStr: dataUrl };
}

const handleUniversalAddMistake = async () => {
  console.log("handleUniversalAddMistake clicked");
  const { text, parentElement, current_posStr } = getSelectedText();

  const addMistakeButtonElement = parentElement.querySelector('.ayah-controls').querySelector('.ayah-add-mistake-button');
  console.log(text, addMistakeButtonElement);
  if (!text || !parentElement) return;

  addMistakeButtonElement.click();
};

const handleUniversalRemoveMistake = async () => {
  console.log("handleUniversalRemoveMistake clicked");
  const { text, parentElement, current_posStr } = getSelectedText();

  const removeMistakeButtonElement = parentElement.querySelector('.ayah-controls').querySelector('.ayah-remove-mistake-button');
  console.log(text, parentElement);
  if (!text || !parentElement) return;

  removeMistakeButtonElement.click()
};

export default function MistakeButtons() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      // Calculate screen boundaries
      const maxX = window.innerWidth - 106; // 96px is the width of the component
      const maxY = window.innerHeight - 58; // 48px is the height of the component

      // Apply boundary limits
      setPosition({
        x: Math.max(10, Math.min(newX, maxX)),
        y: Math.max(10, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="w-24 flex flex-row z-50 bg-gray-400 rounded"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <button
        className="text-gray-700 focus:outline-none w-6 border-r-gray-950 border-r-2"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <FontAwesomeIcon icon={faEllipsisV} size="lg"/>
        <FontAwesomeIcon icon={faEllipsisV} size="lg"/>
      </button>

      <button
        className="ayah-add-mistake-button"
        onClick={() => handleUniversalAddMistake()}
      >
        <i className="fas fa-pen"></i>
      </button>

      <button
        className="ayah-remove-mistake-button"
        onClick={() => handleUniversalRemoveMistake()}
      >
        <i className="fas fa-eraser"></i>
      </button>
    </div>
  );
}
