const canMakeRansom = (note: string, magazineText: string): boolean => {
  const magazineTextArr = magazineText.split(" ");
  const noteText = note.split(" ");
  const wordObj: { [key: string]: number } = {};

  // Build the frequency map using forEach (no need to use map)
  magazineTextArr.forEach((word) => {
    wordObj[word] = (wordObj[word] || 0) + 1;
  });

  // Check if the note can be constructed
  const missingWords = noteText.some((item) => {
    if (wordObj[item] === 0 || !wordObj[item]) return true;
    wordObj[item] -= 1;
    return false;
  });

  return !missingWords;
}
