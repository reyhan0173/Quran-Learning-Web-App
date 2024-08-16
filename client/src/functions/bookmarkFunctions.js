// Toggle bookmark state
export const toggleBookmark = async (setIsBookmarked, isBookmarked, current_posStr) => {
  try {
    const endpoint = isBookmarked ? "http://localhost:501/removeBookmark" : "http://localhost:501/addBookmark";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ current_posStr }),
    });
    if (!response.ok) {
      throw new Error(`Failed to ${isBookmarked ? "remove" : "add"} bookmark`);
    }
    setIsBookmarked(!isBookmarked); // Toggle the bookmark state
  } catch (error) {
    console.error(`Error ${isBookmarked ? "removing" : "adding"} bookmark:`, error);
  }
};
