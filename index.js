showAllNotes();

let addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", function (e) {
  let NotesBody = document.getElementById("notesBody");
  let NotesTitle = document.getElementById("notesTitle");
  getNotesFromLocal();
  notesObj.push({ title: NotesTitle.value, body: NotesBody.value });
  localStorage.setItem("notes", JSON.stringify(notesObj));
  NotesBody.value = "";
  NotesTitle.value = "";
  showAllNotes();
});

function showAllNotes() {
  getNotesFromLocal();
  let allCards = "";
  notesObj.forEach(function (element, i) {
    allCards += cardHtml(i, element);
  });
  let notesContainer = document.getElementById("notes");
  if (notesObj.length != 0) {
    notesContainer.innerHTML = allCards;
  } else {
    notesContainer.innerHTML = `Nothing to show! Use "Add a Note" button above to add notes.`;
  }
}

function deleteNote(index) {
  getNotesFromLocal();
  notesObj.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notesObj));
  showAllNotes();
}

searchFunct();

function searchFunct() {
  let search = document.getElementById("searchTxt");
  search.addEventListener("input", function () {
    let inputValue = search.value.toLowerCase();
    let noteCards = document.getElementsByClassName("noteCard");
    Array.from(noteCards).forEach(function (element) {
      let cardBody = element.getElementsByTagName("p")[0].innerText;
      let cardTitle = element.getElementsByTagName("h5")[0].innerText;
      if (cardTitle.includes(inputValue) || cardBody.includes(inputValue)) {
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }
    });
  });
}

//helper function

function getNotesFromLocal() {
  let notes = localStorage.getItem("notes");
  if (notes == null) {
    notesObj = [];
  } else {
    notesObj = JSON.parse(notes);
  }
}

function cardHtml(index, element) {
  return `
            <div class="noteCard my-2 mx-2 card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <p class="card-text"> ${element.body}</p>
                        <button id="${index}"onclick="deleteNote(this.id)" class="btn btn-primary">Delete Note</button>
                    </div>
                </div>`;
}
