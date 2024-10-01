class Note {
  constructor(id = Date.now(), title = '', content = '', active = true) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.active = active;
  }
}

class App {
  constructor() {
    this.storageKey = 'notes';
    this.list = document.getElementById('list');
    this.btnCreate = document.getElementById('btnCreate');
    this.form = document.getElementById('form');
    this.titleField = document.getElementById('titleField');
    this.contentField = document.getElementById('contentField');

    this.getNotes();
    this.addEvents();
  }

  addEvents = () => {
    this.btnCreate.addEventListener('click', this.createNote);
    this.form.addEventListener('submit', e => e.preventDefault());
    this.titleField.addEventListener('input', this.updateNote);
    this.contentField.addEventListener('input', this.updateNote);
  };

  getNotes = () => {
    let data = localStorage.getItem(this.storageKey);
    data = data !== 'undefined' ? JSON.parse(data) : data;

    this.notes = Array.isArray(data) ? data : [];
    this.updateNotes();
  };

  updateNotes = () => {
    if (!this.notes.length) {
      this.createNote();
      return;
    }

    if (!this.notes.find(note => note.active)) {
      this.readNote(this.notes[this.notes.length - 1].id);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
    this.list.innerHTML = '';
    this.buildNotes();
  };

  buildNotes = () => {
    this.notes.forEach((note, index) => {
      const item = document.createElement('li');
      const btnOpen = document.createElement('button');
      const btnDelete = document.createElement('button');

      btnOpen.innerHTML = note.title || 'Untitled note';
      btnOpen.setAttribute('type', 'button');
      btnOpen.addEventListener('click', () => this.readNote(note.id));

      btnDelete.innerHTML = '&#10006;';
      btnDelete.setAttribute('type', 'button');
      btnDelete.addEventListener('click', () => this.deleteNote(index));

      item.appendChild(btnOpen);
      item.appendChild(btnDelete);

      if (note.active) {
        item.classList.add('current');
        this.titleField.value = note.title;
        this.contentField.value = note.content;
      }

      this.list.appendChild(item);
    });
  };

  createNote = () => {
    const note = new Note();

    this.notes.push(note);
    this.readNote(note.id);
    this.updateNotes();
  };

  readNote = id => {
    this.notes.forEach(note => (note.active = note.id === id));
    this.updateNotes();
  };

  updateNote = () => {
    const note = this.notes.find(note => note.active);

    note.title = this.titleField.value;
    note.content = this.contentField.value;
    this.updateNotes();
  };

  deleteNote = index => {
    if (confirm('Are you sure you want to remove this note?')) {
      this.notes.splice(index, 1);
      this.updateNotes();
    }
  };
}

document.addEventListener('DOMContentLoaded', () => new App());
