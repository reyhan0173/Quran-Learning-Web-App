function trackNumberInput(loopElement, newValue) {
  // console.log(`Number input changed to ${value} for ${ayahId}`);
  loopElement.parentElement.parentElement.querySelector('.ayah-control-button').setAttribute('data-loop', newValue);

  const loopCounterElement = loopElement.parentElement.querySelector('.loop-counter');
  loopCounterElement.setAttribute('data-loop', newValue);
  let count = loopCounterElement.getAttribute('data-count');
  loopCounterElement.textContent = `${count}/${newValue}`;
}

async function fetchAudioUrl(ayahId, recitor) {
  const api = `https://api.quran.com/api/v4/recitations/${recitor}/by_ayah/${ayahId}`;

  const response = await fetch(api);
  if (!response.ok) {
    throw new Error("Failed to fetch data: " + response.statusText);
  }
  const data = await response.json();
  const directory = data.audio_files[0].url;
  const audioUrl = `https://verses.quran.com/${directory}`;

  return audioUrl;
}

async function playPauseAudio(buttonElement) {
  console.log(buttonElement.parentElement.parentElement.querySelector('.loop-counter'));
  
  let recitor = 4;
  let ayahId = buttonElement.getAttribute("data-ayahId");
  let loop = buttonElement.getAttribute("data-loop");
  
  const loopCounterElement = buttonElement.parentElement.parentElement.querySelector('.loop-counter')
  
  
  const audioElement = document.querySelector("audio");
  if (!audioElement) {
    console.log("Audio element not found");
  }
  
  if (
    ayahId == audioElement.prev_ayah &&
    recitor == audioElement.prev_recitor
  ) {
    console.log("paused");
    audioElement.pause();
    audioElement.prev_ayah = "";
    audioElement.prev_recitor = "";
    return;
  }
  
  let i = loopCounterElement.getAttribute('data-count');
  if (i >= loop || i == 0) {
    i = 0;
    loopCounterElement.setAttribute('data-count', 0);
    loopCounterElement.textContent = `${i}/${loop}`;
  }

  while (i < loop) {
    console.log("played");
    if (
      audioElement.prev_src_ayah != ayahId ||
      audioElement.prev_src_recitor != recitor
    ) {
      audioElement.src = await fetchAudioUrl(ayahId, recitor);
      
      audioElement.prev_src_ayah = ayahId;
      audioElement.prev_src_recitor = recitor;
    }
    
    await audioElement.play();
    audioElement.prev_ayah = ayahId;
    audioElement.prev_recitor = recitor;
    
    await new Promise((resolve) => {
      audioElement.onended = resolve;
    });

    loop = buttonElement.getAttribute("data-loop");
    loopCounterElement.textContent = `${i + 1}/${loop}`;
    loopCounterElement.setAttribute('data-count', i + 1);
    i++;
  }

  console.log("paused");
  audioElement.prev_ayah = "";
  audioElement.prev_recitor = "";
}

async function bookmark(current_posStr) {
  // Check if the button has the "isBookmarked" class to determine whether to add or remove a bookmark
  const buttonElement = document.querySelector(`[data-url='${current_posStr}'] .ayah-bookmark-button`);
  console.log(buttonElement)
  const isBookmarked = buttonElement.parentElement.parentElement.classList.contains("isBookmarked");

  const endpoint = isBookmarked ? "/removeBookmark" : "/addBookmark";
  const method = "POST";

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ current_posStr }),
    });
    if (!response.ok) {
      throw new Error(`Failed to ${isBookmarked ? 'remove' : 'add'} bookmark`);
    }
    // Optionally, you can handle success response here
    // Toggle bookmark status
    buttonElement.parentElement.parentElement.classList.toggle("isBookmarked");
    buttonElement.textContent = isBookmarked ? "Bookmark" : "Unbookmark";
  } catch (error) {
    console.error(`Error ${isBookmarked ? 'removing' : 'adding'} bookmark:`, error);
  }
}

async function mistake(current_posStr) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) {
    alert("Please select text to mark as a mistake.");
    return;
  }

  const selectedText = selection.toString();
  if (!selectedText) {
    alert("Please select text to mark as a mistake.");
    return;
  }

  // Find the specific verse element
  const ayahElement = document.querySelector(`[data-url='${current_posStr}'] .ayah`);
  if (!ayahElement) {
    alert("Error: Could not find the selected verse.");
    return;
  }

  const ayahText = ayahElement.textContent;
  const range = selection.getRangeAt(0);

  // Check if the selection is within the ayah element
  if (!ayahElement.contains(range.commonAncestorContainer)) {
    alert("Error: Selected text is not within the correct verse.");
    return;
  }

  const startContainer = range.startContainer;
  const startOffset = range.startOffset;
  let startIndex = -1;

  // Calculate the start index based on the character offset within the ayah text
  if (startContainer.nodeType === Node.TEXT_NODE) {
    startIndex = Array.from(ayahElement.childNodes).reduce((acc, node) => {
      if (node === startContainer) {
        return acc + startOffset;
      } else {
        return acc + (node.textContent.length || 0);
      }
    }, 0);
  }

  if (startIndex === -1 || ayahText.substring(startIndex, startIndex + selectedText.length) !== selectedText) {
    alert("Error: Selected text not found in the verse.");
    return;
  }

  const mistakeIndexes = [];
  for (let i = startIndex; i < startIndex + selectedText.length; i++) {
    mistakeIndexes.push(i);
  }

  // Send mistake indexes to the server
  try {
    const response = await fetch("/addMistake", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ current_posStr, mistakeIndexes }),
    });
    if (!response.ok) {
      throw new Error("Failed to add mistake");
    }
    alert("Mistake marked successfully");
  } catch (error) {
    console.error("Error adding mistake:", error);
    alert("Error adding mistake");
  }
}

