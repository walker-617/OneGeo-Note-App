import { useEffect, useState } from "react";

function Home() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const notes = [...Array(10)].map((_, i) => `note${i + 1}`);
    setNotes(notes);
  }, []);

  function allowDrop(ev) {
    ev.preventDefault();
  }

  function appendNote(ev) {
    ev.stopPropagation();
    var data = ev.dataTransfer.getData("text");
    ev.target.value += ev.target.value ? " " : "" + data;
    ev.dataTransfer.clearData();
  }

  function drag(ev) {
    ev.dataTransfer.setData("text/plain", window.getSelection().toString());
  }

  function addNote(ev) {
    ev.preventDefault();
    var sel = window.getSelection();
    sel.removeAllRanges();
    var note = ev.dataTransfer?.getData("text");
    if (!note) {
      note = "newNote";
    }
    setNotes([...notes, note]);
    ev.dataTransfer?.clearData();
  }

  function nothing(ev) {
    ev.stopPropagation();
    ev.preventDefault();
  }

  return (
    <div className="home">
      <button className="sign-in">Sign In</button>
      <div
        className="notes-area"
        onDrop={(e) => addNote(e)}
        onDragOver={(e) => allowDrop(e)}
        onDoubleClick={(e) => addNote(e)}
      >
        {notes.map((note, i) => (
          <textarea
            onDoubleClick={(e) =>nothing(e)}
            className="note"
            key={i}
            defaultValue={note === "newNote" ? "" : note}
            placeholder={note === "newNote" ? "Add new note" : ""}
            onDragStart={(e) => drag(e)}
            onDrop={(e) => appendNote(e)}
          ></textarea>
        ))}
      </div>
      <button className="export">Export to XLXS file</button>
    </div>
  );
}

export default Home;
