// Add mistake to the current ayah
export const addMistake = async (studentId, courseId, current_posStr, verse, mistakes, setMistakes) => {
  console.log(`${studentId}||${courseId}||${current_posStr}||${verse}||${mistakes}||${setMistakes}||`);

  const selection = window.getSelection();
  if (selection.rangeCount === 0) {
    alert("Please select text to mark as a mistake.");
    return;
  }

  const selectedText = selection.toString().trim();
  if (!selectedText) {
    alert("Please select text to mark as a mistake.");
    return;
  }

  const ayahElement = document.querySelector(`[data-url='${current_posStr}'] .ayah`);
  if (!ayahElement) {
    alert("Error: Could not find the selected verse.");
    return;
  }

  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;
  const startOffset = range.startOffset;

  if (startContainer.nodeType !== Node.TEXT_NODE || !ayahElement.contains(startContainer)) {
    alert(`Error: Selected text is not within the correct verse. ${startContainer}`);
    return;
  }

  let startIndex = 0;
  let currentNode = startContainer;

  while (currentNode && currentNode !== ayahElement) {
    if (currentNode.previousSibling) {
      currentNode = currentNode.previousSibling;
      startIndex += currentNode.textContent.length;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  startIndex += startOffset;

  const ayahText = verse;
  if (startIndex === -1 || ayahText.substring(startIndex, startIndex + selectedText.length) !== selectedText) {
    alert(`Error: Selected text not found in the verse. \n|${selectedText}|`);
    return;
  }

  const mistakeIndexes = [];
  for (let i = startIndex; i < startIndex + selectedText.length; i++) {
    mistakeIndexes.push(i);
  }

  try {
    console.log("_____DEBUG 14_____")
    console.log(studentId);

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
    setMistakes([...mistakes, ...mistakeIndexes]);
  } catch (error) {
    console.error("Error adding mistake:", error);
  }
};

// Remove mistake from the current ayah
export const removeMistake = async (studentId, courseId, current_posStr, setMistakes) => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) {
    alert("Please select text to remove as a mistake.");
    return;
  }

  const selectedText = selection.toString().trim();
  if (!selectedText) {
    alert("Please select text to remove as a mistake.");
    return;
  }

  const ayahElement = document.querySelector(`[data-url='${current_posStr}'] .ayah`);
  if (!ayahElement) {
    alert("Error: Could not find the selected verse.");
    return;
  }

  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;
  const startOffset = range.startOffset;

  if (startContainer.nodeType !== Node.TEXT_NODE || !ayahElement.contains(startContainer)) {
    alert("Error: Selected text is not within the correct verse.");
    return;
  }

  let startIndex = 0;
  let currentNode = startContainer;

  while (currentNode && currentNode !== ayahElement) {
    if (currentNode.previousSibling) {
      currentNode = currentNode.previousSibling;
      startIndex += currentNode.textContent.length;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  startIndex += startOffset;

  const ayahText = ayahElement.textContent;
  if (startIndex === -1 || ayahText.substring(startIndex, startIndex + selectedText.length) !== selectedText) {
    alert("Error: Selected text not found in the verse.");
    return;
  }

  const mistakeIndexes = [];
  for (let i = startIndex; i < startIndex + selectedText.length; i++) {
    mistakeIndexes.push(i);
  }

  try {
    const response = await fetch("http://localhost:501/removeMistake", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, courseId, current_posStr, mistakeIndexes }),
    });
    if (!response.ok) {
      throw new Error("Failed to remove mistake");
    }

    setMistakes(prevMistakes => prevMistakes.filter(index => !mistakeIndexes.includes(index)));
  } catch (error) {
    console.error("Error removing mistake:", error);
  }
};

export const getSelectedText = () => {
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

export const handleUniversalAddMistake = async () => {
  console.log("handleUniversalAddMistake clicked");
  const { text, parentElement, current_posStr } = getSelectedText();

  const addMistakeButtonElement = parentElement.querySelector('.ayah-controls').querySelector('.ayah-add-mistake-button');
  console.log(text, addMistakeButtonElement);
  if (!text || !parentElement) return;

  addMistakeButtonElement.click();
};

export const handleUniversalRemoveMistake = async () => {
  console.log("handleUniversalRemoveMistake clicked");
  const { text, parentElement, current_posStr } = getSelectedText();

  const removeMistakeButtonElement = parentElement.querySelector('.ayah-controls').querySelector('.ayah-remove-mistake-button');
  console.log(text, parentElement);
  if (!text || !parentElement) return;

  removeMistakeButtonElement.click()
};
