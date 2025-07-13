import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Notes App main component.
 * Features: create, update, delete, list, view, and search notes.
 * Minimalist, light-themed UI with custom color scheme.
 */

// PUBLIC_INTERFACE
function App() {
  // Notes state: [{id, title, content, createdAt, updatedAt}]
  const [notes, setNotes] = useState(() => {
    // Persist notes to localStorage for demo
    const data = localStorage.getItem("notes");
    return data ? JSON.parse(data) : [];
  });
  // For filtering/search
  const [searchTerm, setSearchTerm] = useState("");
  // Which note is being viewed/edited
  const [selectedId, setSelectedId] = useState(null);
  // Whether the editor for a new note is open
  const [editorOpen, setEditorOpen] = useState(false);
  // Temp states for the editor
  const [draft, setDraft] = useState({ title: "", content: "" });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Get notes filtered by search (case-insensitive search in title/content)
  const filteredNotes = notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  // PUBLIC_INTERFACE
  function handleSelectNote(id) {
    setSelectedId(id);
    setEditorOpen(false);
  }

  // PUBLIC_INTERFACE
  function handleEditNote(id) {
    const note = notes.find((n) => n.id === id);
    setDraft({ title: note.title, content: note.content });
    setSelectedId(id);
    setEditorOpen(true);
  }

  // PUBLIC_INTERFACE
  function handleDeleteNote(id) {
    if (window.confirm("Delete this note?")) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setEditorOpen(false);
      }
    }
  }

  // PUBLIC_INTERFACE
  function handleNewNote() {
    setDraft({ title: "", content: "" });
    setSelectedId(null);
    setEditorOpen(true);
  }

  // PUBLIC_INTERFACE
  function handleEditorChange(e) {
    const { name, value } = e.target;
    setDraft((d) => ({ ...d, [name]: value }));
  }

  // PUBLIC_INTERFACE
  function handleSaveNote(e) {
    e.preventDefault();
    const title = draft.title.trim();
    const content = draft.content.trim();
    if (!title) return alert("Title is required");
    const now = new Date().toISOString();
    if (selectedId && notes.some((n) => n.id === selectedId)) {
      // Edit
      setNotes((prev) =>
        prev.map((n) =>
          n.id === selectedId
            ? { ...n, title, content, updatedAt: now }
            : n
        )
      );
      setSelectedId(selectedId);
    } else {
      // New
      const id = Date.now().toString();
      setNotes([
        { id, title, content, createdAt: now, updatedAt: now },
        ...notes,
      ]);
      setSelectedId(id);
    }
    setEditorOpen(false);
  }

  // Get the selected note object
  const selectedNote = notes.find((n) => n.id === selectedId);

  // Colors (inline styles for accenting)
  const colors = {
    accent: "#ff9800",
    primary: "#1976d2",
    secondary: "#424242",
  };

  // Minimalistic layout
  return (
    <div className="notes-app-light" style={{ background: "#fafbfc", minHeight: "100vh" }}>
      {/* Header */}
      <header
        className="notes-header"
        style={{
          background: "#fff",
          borderBottom: "1.5px solid #e9ecef",
          padding: "1.5rem 0.5rem 1rem 0.5rem",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 1px 4px 0 rgba(30,30,30,0.03)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            className="notes-logo"
            style={{
              background: colors.primary,
              color: "#fff",
              borderRadius: "50%",
              width: "2.5rem",
              height: "2.5rem",
              marginRight: "0.9rem",
              fontWeight: "bold",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            aria-label="Notes logo"
          >
            <span role="img" aria-label="Notebook">📝</span>
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.5rem",
              color: colors.primary, letterSpacing: "0.01em"
            }}
          >
            Notes
          </span>
        </div>
        <input
          className="notes-search"
          aria-label="Search notes"
          type="search"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: "#f8f9fa",
            border: "1px solid #e3e4e7",
            borderRadius: "16px",
            padding: "8px 16px",
            fontSize: "1rem",
            width: "210px",
            outline: "none",
            color: "#393e46"
          }}
        />
      </header>
      {/* Main content area */}
      <main
        className="notes-main"
        style={{
          maxWidth: 920,
          margin: "2.2rem auto 0 auto",
          display: "flex",
          flexDirection: "row",
          gap: "1.8rem"
        }}
      >
        {/* Notes list */}
        <section
          className="notes-list-section"
          style={{
            width: "320px",
            minWidth: "200px",
            paddingRight: "0.6rem",
            borderRight: "1px solid #ececec",
          }}
        >
          <div
            className="notes-list-label"
            style={{
              fontSize: "1.09rem",
              color: colors.secondary,
              fontWeight: 500,
              marginBottom: "0.7rem",
              letterSpacing: "0.02em",
            }}
          >
            All Notes
          </div>
          <ul
            className="notes-list"
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              maxHeight: "69vh",
              overflowY: "auto"
            }}
          >
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <li
                  key={note.id}
                  className={note.id === selectedId ? "note-item selected" : "note-item"}
                  style={{
                    background:
                      note.id === selectedId
                        ? colors.accent + "11"
                        : "#fff",
                    border: note.id === selectedId
                      ? "1.5px solid " + colors.accent
                      : "1.5px solid #ebecec",
                    borderRadius: "9px",
                    padding: "0.85rem 1rem",
                    marginBottom: "0.85rem",
                    cursor: "pointer",
                    boxShadow: note.id === selectedId
                      ? "0 2px 16px 0 rgba(255,152,0,0.05)"
                      : "0 1px 10px 0 rgba(200,200,200,0.03)",
                    transition: "border, background 120ms"
                  }}
                  tabIndex="0"
                  onClick={() => handleSelectNote(note.id)}
                  onDoubleClick={() => handleEditNote(note.id)}
                >
                  <div
                    className="note-title-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <span
                      className="note-title"
                      style={{
                        fontWeight: 600,
                        color: "#282d32",
                        fontSize: "1.08rem",
                        maxWidth: "180px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {note.title || <em style={{ color: "#888" }}>[untitled]</em>}
                    </span>
                    <span
                      className="note-edit-btn"
                      title="Edit"
                      style={{
                        marginLeft: "0.7em",
                        color: colors.primary,
                        cursor: "pointer",
                        fontSize: "1rem"
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        handleEditNote(note.id);
                      }}
                    >
                      ✏️
                    </span>
                  </div>
                  <div
                    className="note-snippet"
                    style={{
                      color: "#a8a8a8",
                      fontSize: "0.95rem",
                      margin: "0.25em 0",
                      maxWidth: "97%",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {note.content.slice(0, 42) + (note.content.length > 42 ? "…" : "")}
                  </div>
                  <div
                    className="note-time"
                    style={{
                      fontSize: "0.85rem",
                      color: "#b3b3b3",
                      marginTop: "0.15em"
                    }}
                  >
                    {note.updatedAt
                      ? ("Edited " +
                        new Date(note.updatedAt).toLocaleString().replace(",", ""))
                      : ""}
                  </div>
                </li>
              ))
            ) : (
              <li
                style={{
                  color: "#b1b1b1",
                  fontStyle: "italic",
                  textAlign: "center", marginTop: "1.2em"
                }}
              >
                No notes found
              </li>
            )}
          </ul>
        </section>
        {/* Main panel: either note details (read) or the editor */}
        <section
          className="notes-details-section"
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            paddingLeft: "0.7rem"
          }}
        >
          {editorOpen ? (
            <form
              className="note-editor"
              style={{
                background: "#fff",
                border: "1.5px solid #e9ecef",
                borderRadius: "14px",
                padding: "2rem 2rem 1.5rem 2rem",
                boxShadow: "0 1px 14px 0 rgba(60,60,60,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
                maxWidth: "570px"
              }}
              onSubmit={handleSaveNote}
              autoComplete="off"
              aria-label={selectedId ? "Edit note" : "New note"}
            >
              <div style={{ fontSize: "1.16rem", fontWeight: 500, color: colors.secondary }}>
                {selectedId ? "Edit Note" : "New Note"}
              </div>
              <input
                type="text"
                name="title"
                value={draft.title}
                maxLength={100}
                placeholder="Note title"
                onChange={handleEditorChange}
                autoFocus
                required
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 500,
                  padding: "0.7em",
                  border: "1px solid #dee3e6",
                  borderRadius: "8px",
                  outline: "none",
                  marginBottom: "0.6em",
                }}
              />
              <textarea
                name="content"
                value={draft.content}
                placeholder="Write your note here..."
                rows={9}
                onChange={handleEditorChange}
                style={{
                  fontFamily: "inherit",
                  fontSize: "1.07rem",
                  border: "1px solid #e2e3e6",
                  borderRadius: "8px",
                  resize: "vertical",
                  minHeight: 120,
                  padding: "0.7em"
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.7rem" }}>
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  style={{
                    background: "#eee",
                    color: colors.secondary,
                    border: "none",
                    borderRadius: "7px",
                    padding: "9px 22px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: colors.primary,
                    color: "#fff",
                    border: "none",
                    borderRadius: "7px",
                    padding: "9px 22px",
                    fontWeight: 600,
                    boxShadow: "0 2px 6px 0 rgba(25,118,210,0.09)",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          ) : selectedNote ? (
            <div
              className="note-details-pane"
              style={{
                background: "#fff",
                border: "1.5px solid #e9ecef",
                borderRadius: "14px",
                padding: "2.2rem 2.4rem 2rem 2.4rem",
                boxShadow: "0 2px 18px 0 rgba(60,60,60,0.08)",
                minHeight: "300px",
                maxWidth: "670px",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div>
                <h2 style={{ color: colors.primary, margin: 0, fontWeight: 700, fontSize: "2rem" }}>
                  {selectedNote.title || <em style={{ color: "#9199a7" }}>[untitled]</em>}
                </h2>
                <div style={{ color: "#9a9aaa", fontSize: "1.07rem", marginTop: "0.45em", marginBottom: "1.2em" }}>
                  Created {new Date(selectedNote.createdAt).toLocaleString().replace(",", "")}
                  <br />
                  Last edited {new Date(selectedNote.updatedAt).toLocaleString().replace(",", "")}
                </div>
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    fontSize: "1.13rem",
                    color: "#2b2e36",
                    minHeight: "3em",
                    marginBottom: "1.3em"
                  }}
                >
                  {selectedNote.content || <em style={{ color: "#b8b8b8" }}>[empty note]</em>}
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => handleEditNote(selectedNote.id)}
                  style={{
                    background: colors.primary,
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: 500,
                    padding: "10px 20px",
                    cursor: "pointer"
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteNote(selectedNote.id)}
                  style={{
                    background: colors.accent,
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: 500,
                    padding: "10px 20px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div style={{ color: "#b3b3b3", fontStyle: "italic", marginTop: "2.5em", fontSize: "1.25rem" }}>
              Select a note to view its details or create a new note.
            </div>
          )}
        </section>
      </main>
      {/* Floating Action Button for creating a new note */}
      <button
        className="fab"
        title="Add new note"
        aria-label="Add new note"
        onClick={handleNewNote}
        style={{
          position: "fixed",
          right: 32,
          bottom: 32,
          width: "66px",
          height: "66px",
          background: colors.accent,
          color: "#fff",
          fontSize: "2.05rem",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 24px 0 rgba(255,152,0,0.21)",
          outline: "none",
          border: "none",
          zIndex: 100,
          transition: "background 130ms",
          cursor: "pointer"
        }}
      >
        <span aria-hidden="true" style={{fontSize: "2.15rem"}}>+</span>
      </button>
      {/* Minimalistic signature/footer */}
      <footer
        style={{
          marginTop: "4.5rem",
          textAlign: "center",
          color: "#bcc3c9",
          fontSize: "0.97rem",
        }}
      >
        <span style={{ color: colors.primary, fontWeight: 500 }}>notes</span>{" "}
        <span style={{ color: colors.accent }}>app</span> — minimal UI powered by React &nbsp;
        <span style={{ fontSize: "0.92em", color: "#db9002" }}>©</span>
      </footer>
    </div>
  );
}

export default App;
