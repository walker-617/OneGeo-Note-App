import { useEffect, useState } from "react";

import CreateDataForXLSX from "../utils/CreateData";
import exportToExcel from "../utils/Export";
import Header from "./header";

import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";

function Home() {
  const [notes, setNotes] = useState([]);
  const [prevNote, setPrevNote] = useState("");

  const [notesChanged, setNotesChanged] = useState(false);

  useEffect(() => {
    const notes = [
      "walker",
      "avinash",
      "jahnav",
      "govind",
      "krishna",
      "nivas",
      "vishnu",
      "kushal",
    ];
    setNotes(notes);
  }, []);

  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev, i) {
    ev.dataTransfer.setData("text/plain", window.getSelection().toString());
  }

  function appendNote(ev, i) {
    ev.stopPropagation();
    var data = ev.dataTransfer.getData("text");
    const newNote = ev.target.value + (ev.target.value ? " " : "") + data;
    if (notes.includes(newNote)) {
      setError("Note already exists","rgb(216, 31, 31)");
      ev.dataTransfer?.clearData();
      return;
    }
    ev.target.value = newNote;
    ev.dataTransfer.clearData();
    const newNotes = [...notes];
    newNotes[i] = newNote;
    updateChange();
    setNotes(newNotes);
  }

  function addNote(ev) {
    ev.preventDefault();
    var sel = window.getSelection();
    sel.removeAllRanges();
    var note = ev.dataTransfer?.getData("text");
    if (!note) {
      note = "";
    }
    if (notes.includes(note)) {
      if (note === "") {
        setError("Empty note already exists","rgb(216, 31, 31)");
      } else {
        setError("Note already exists","rgb(216, 31, 31)");
      }
      ev.dataTransfer?.clearData();
      return;
    }
    updateChange();
    setNotes([...notes, note]);
    ev.dataTransfer?.clearData();
  }

  function showIcons(ev, i) {
    document.getElementById(`delete-note${i}`).style.display = "block";
  }

  function hideIcons(ev, i) {
    document.getElementById(`delete-note${i}`).style.display = "none";
  }

  function saveNote(ev, i) {
    ev.stopPropagation();
    ev.preventDefault();
    const note = ev.target.value;
    if (note === prevNote) {
      return;
    }
    setNotesChanged(true);
    if (notes.includes(note)) {
      if (note === "") {
        setError("Empty note already exists","rgb(216, 31, 31)");
      } else {
        setError("Note already exists","rgb(216, 31, 31)");
      }
      ev.target.value = prevNote;
      setPrevNote("");
      ev.dataTransfer?.clearData();
      return;
    }
    const newNotes = [...notes];
    newNotes[i] = note;
    setNotes(newNotes);
  }

  function deleteNote(ev, i) {
    ev.stopPropagation();
    ev.preventDefault();
    const newNotes = [...notes];
    newNotes.splice(i, 1);
    setNotes(newNotes);
    setNotesChanged(true);
  }

  function updateChange() {
    setNotesChanged(true);
  }

  function setError(error,color){
    document.getElementById("error").style.display = "block";
    document.getElementById("error").style.background = color;
    document.getElementById("error").innerText = error;
    setTimeout(() => {
      document.getElementById("error").style.display = "none";
    }, 3000);
  }

  function nothing(ev) {
    ev.stopPropagation();
    ev.preventDefault();
  }

  function exportToXLSX() {
    const data = CreateDataForXLSX(notes);
    console.log(data);
    // exportToExcel(data,"Notes");
  }

  return (
    <div className="home">
      <Header />
      <div className="error" id="error"></div>
      <div
        className="notes-area"
        onDrop={(e) => addNote(e)}
        onDragOver={(e) => allowDrop(e)}
        onDoubleClick={(e) => addNote(e)}
      >
        {notes.map((note, i) => (
          <div
            className="note-container"
            id={`note-container${i}`}
            key={note}
            onMouseEnter={(e) => showIcons(e, i)}
            onMouseLeave={(e) => hideIcons(e, i)}
          >
            <textarea
              onDoubleClick={(e) => nothing(e)}
              className="note"
              id={`note${i}`}
              placeholder={note === "" ? "Add new note..." : ""}
              defaultValue={note}
              onDragStart={(e) => drag(e, i)}
              onDrop={(e) => appendNote(e, i)}
              onBlur={(e) => saveNote(e, i)}
              onFocus={(e) => setPrevNote(e.target.value)}
              spellCheck="false"
            ></textarea>
            <MdDelete
              className="delete-note"
              id={`delete-note${i}`}
              onMouseDown={(e) => deleteNote(e, i)}
            />
          </div>
        ))}
      </div>
      <div className="export" onClick={() => exportToXLSX()}>
        <PiMicrosoftExcelLogoFill className="xlicon" /> Export Notes
      </div>
    </div>
  );
}

export default Home;
