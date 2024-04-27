function euclideanDistance(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function CreateDataForXLSX(notes) {
  let data = [];
  for (let i = 0; i < notes.length; i++) {
    if (notes[i] === "newNote" || notes[i] === "") {
      continue;
    }
    const note = document.getElementById(`note-container${i}`);
    const dist_top = note.offsetTop;
    const dist_left = note.offsetLeft;
    const dist_top_left_corner = euclideanDistance(dist_top, dist_left);
    data.push({
      Notes: notes[i],
      "Distance from top": dist_top,
      "Distance from left": dist_left,
      "Distance from top-left corner": +dist_top_left_corner.toFixed(2),
    });
  }
  return data;
}

export default CreateDataForXLSX;
