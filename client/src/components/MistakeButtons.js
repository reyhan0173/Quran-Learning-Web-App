import React, { useState } from "react";

export const removeMistake = async (studentId, courseId, current_posStr, selectedText, start_idx, end_idx) => {

  console.log(`${studentId}||${courseId}||${current_posStr}||${selectedText}||${start_idx}||${end_idx}`);
  console.log(start_idx);

  const mistakeIndexes = []
  if (Number(start_idx) >= 0 && Number(end_idx) >= Number(start_idx)) {
    console.log("loop begins");
    for (let i = start_idx; i <= end_idx; i++) {
      mistakeIndexes.push(i);
    }
  }

  try {
    console.log("_____DEBUG 14_____")
    console.log(mistakeIndexes);

    const response = await fetch("http://localhost:501/removeMistake", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, courseId, current_posStr, mistakeIndexes }),
    });
    if (!response.ok) {
      throw new Error("Failed to add mistake");
    }
  } catch (error) {
    console.error("Error adding mistake:", error);
  }
};

export const addMistake = async (studentId, courseId, current_posStr, selectedText, start_idx, end_idx) => {

  console.log(`${studentId}||${courseId}||${current_posStr}||${selectedText}||${start_idx}||${end_idx}`);
  console.log(start_idx);

  const mistakeIndexes = []
  if (Number(start_idx) >= 0 && Number(end_idx) >= Number(start_idx)) {
    console.log("loop begins");
    for (let i = start_idx; i <= end_idx; i++) {
      mistakeIndexes.push(i);
    }
  }

  try {
    console.log("_____DEBUG 14_____")
    console.log(mistakeIndexes);

    const response = await fetch("http://localhost:501/addMistake", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, courseId, current_posStr, mistakeIndexes }),
    });
    if (!response.ok) {
      throw new Error("Failed to add mistake");
    }
  } catch (error) {
    console.error("Error adding mistake:", error);
  }
};


const handleUniversalAddMistake = async () => {
  console.log("handleUniversalAddMistake clicked");
  const { text, parentElement, current_posStr } = getSelectedText();

  const addMistakeButtonElement = parentElement.querySelector('.ayah-controls').querySelector('.ayah-add-mistake-button');
  console.log(text, addMistakeButtonElement);
  if (!text || !parentElement) return;

  addMistakeButtonElement.click();

  // old Method
  // const verse = parentElement.querySelector('.ayah').textContent;
  //
  // const studentId = 1111115; // Replace with actual studentId if needed
  // const courseId = 123; // Replace with actual courseId if needed
  //
  // if (current_posStr && verse) {
  //   const start_idx = verse.indexOf(text);
  //   const end_idx = start_idx + text.length;
  //   await addMistake(studentId, courseId, current_posStr, text, start_idx, end_idx);
  // }
};

const handleUniversalRemoveMistake = async () => {
  console.log("handleUniversalRemoveMistake clicked");
  const { text, parentElement, current_posStr } = getSelectedText();

  const removeMistakeButtonElement = parentElement.querySelector('.ayah-controls').querySelector('.ayah-remove-mistake-button');
  console.log(text, parentElement);
  if (!text || !parentElement) return;

  removeMistakeButtonElement.click()

  // old Method
  // const verse = parentElement.querySelector('.ayah').textContent;
  //
  // const studentId = 1111115; // Replace with actual studentId if needed
  // const courseId = 123; // Replace with actual courseId if needed
  //
  // if (current_posStr && verse) {
  //   const start_idx = verse.indexOf(text);
  //   const end_idx = start_idx + text.length;
  //   await removeMistake(studentId, courseId, current_posStr, text, start_idx, end_idx);
  // }
};

export default function MistakeButtons() {
  return (
    <div className="ayah-controls flex flex-row">
      <button
        className="ayah-add-mistake-button"
        onClick={() => handleUniversalAddMistake()}
      >
        <i className={`fas fa-pen`}></i>
      </button>
      <button
        className="ayah-remove-mistake-button"
        onClick={() => handleUniversalRemoveMistake()}
      >
        <i className={`fas fa-eraser`}></i>
      </button>
    </div>
  );
}

function getSelectedText() {
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
