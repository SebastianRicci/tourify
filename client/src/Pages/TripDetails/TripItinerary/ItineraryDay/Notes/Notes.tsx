import './Notes.css';
import { v4 as uuidv4 } from 'uuid';
import { BiNote } from 'react-icons/bi';
import Note from './Note/Note';
import { NotesProps } from '../../../../../../types/props';
import { FormEvent } from 'react';
import { Note as NoteType } from '../../../../../../types/models';

function Notes({
  notesInputActive,
  notes,
  setNotes,
  setItinerary,
  dayIndex,
  renderToast,
  isAuth
}: NotesProps) {
  const addNote = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    type TargetType = EventTarget & {
      note: {
        value: string
      }
    };

    const target = e.target as TargetType;

    if (target.note.value === '') return;
    const newNote = {
      note: target.note.value,
      id: uuidv4()
    };
    setItinerary((prev) => {
      const newItinerary = [];
      for (let i = 0; i < prev.length; i++) {
        if (i === dayIndex) {
          newItinerary.push({
            ...prev[i],
            notes: [...notes, newNote]
          });
        } else {
          newItinerary.push(prev[i]);
        }
      }
      return newItinerary;
    });
    setNotes((prev) => [...prev, newNote]);
    target.note.value = '';
    renderToast('Success', 'success', 'itinerary successfully updated');
  };

  const deleteNote = (note: NoteType) => {
    setItinerary((prev) => {
      const newItinerary = [];
      for (let i = 0; i < prev.length; i++) {
        if (i === dayIndex) {
          newItinerary.push({
            ...prev[i],
            notes: prev[i].notes.filter((n) => n.id !== note.id)
          });
        } else {
          newItinerary.push(prev[i]);
        }
      }
      return newItinerary;
    });
    setNotes((prev) => prev.filter((p) => p.id !== note.id));
    renderToast('Success', 'success', 'itinerary successfully updated');
  };

  return (
    <div className="notes">
      {notes.length ? (
        <div className="notes-container">
          <h1 className="heading">Notes:</h1>
          {notes.map((note, index) => (
            <Note
              note={note}
              key={index}
              deleteNote={deleteNote}
              setItinerary={setItinerary}
              dayIndex={dayIndex}
              renderToast={renderToast}
              isAuth={isAuth}
            />
          ))}
        </div>
      ) : null}
      {notesInputActive ? (
        <form className="notes-input-container" onSubmit={addNote}>
          <BiNote className="icon note-icon" />
          <textarea
            name="note"
            className="notes-text"
            placeholder="Add a note..."
          ></textarea>
          <button className="add-note input-btn">Add Note</button>
        </form>
      ) : null}
    </div>
  );
}

export default Notes;
