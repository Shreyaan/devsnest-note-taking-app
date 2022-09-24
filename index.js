showAllNotes();

let addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", function (e) {
  let NotesBody = document.getElementById("notesBody");
  let NotesTitle = document.getElementById("notesTitle");
  getNotesFromLocal();
  mainNotesArray.push({ title: NotesTitle.value, body: NotesBody.value });
  localStorage.setItem("notes", JSON.stringify(mainNotesArray));
  NotesBody.value = "";
  NotesTitle.value = "";
  showAllNotes();
});

function showAllNotes() {
  getNotesFromLocal();
  let allCards = "";
  mainNotesArray.forEach(function (element, i) {
    allCards += cardHtml(i, element);
  });
  let notesContainer = document.getElementById("notes");
  if (mainNotesArray.length != 0) {
    notesContainer.innerHTML = allCards;
  } else {
    notesContainer.innerHTML = `Nothing to show! Use "Add a Note" button above to add notes.`;
  }
}

function deleteNote(index) {
  getNotesFromLocal();
  mainNotesArray.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(mainNotesArray));
  showAllNotes();
}

runSearch();

function runSearch() {
  let search = document.getElementById("searchTxt");
  let didItRan = false;

  search.addEventListener("input", function () {
    let inputValue = search.value.toLowerCase();
    let noteCardsArray = document.getElementsByClassName("noteCard");
    if (inputValue.length) {
      didItRan = true;
      
      Array.from(noteCardsArray).forEach(function (element) {
        let cardBody = element.querySelectorAll("#note_body")[0].innerText;
        let cardTitle = element.getElementsByTagName("h5")[0].innerText;
        if (cardTitle.includes(inputValue) || cardBody.includes(inputValue)) {
          element.style.display = "block";
        } else {
          element.style.display = "none";
        }
      });
    }
    //reset search
    if (!inputValue.length && didItRan) {
      Array.from(noteCardsArray).forEach(function (element) {
        element.style.display = "block";
      });
    }
  });
}

//helper functions

function getNotesFromLocal() {
  let notes = localStorage.getItem("notes");
  if (notes == null) {
    mainNotesArray = [];
  } else {
    mainNotesArray = JSON.parse(notes);
  }
}

function cardHtml(index, element) {
  return `
            <div class="noteCard my-2 mx-2 card" style="width: 18rem;">
                    <div class="card-body">
                    <div class="title_row">
                    <h5 class="card-title">${element.title} </h5>
                    <button id="${index}"onclick="deleteNote(this.id)" class="btn btn-danger">X</button> 
                   
                </div>
                        <hr>
                        <div class="card-text" id="note_body" >  ${parseMd(element.body)}</div>
                       
                    </div>
                </div>`;
}

//https://codepen.io/kvendrik/pen/bGKeEE
function parseMd(md) {
  //ul
  md = md.replace(/^\s*\n\*/gm, "<ul>\n*");
  md = md.replace(/^(\*.+)\s*\n([^\*])/gm, "$1\n</ul>\n\n$2");
  md = md.replace(/^\*(.+)/gm, "<li>$1</li>");

  //ol
  md = md.replace(/^\s*\n\d\./gm, "<ol>\n1.");
  md = md.replace(/^(\d\..+)\s*\n([^\d\.])/gm, "$1\n</ol>\n\n$2");
  md = md.replace(/^\d\.(.+)/gm, "<li>$1</li>");

  //blockquote
  md = md.replace(/^\>(.+)/gm, "<blockquote>$1</blockquote>");

  //h
  md = md.replace(/[\#]{6}(.+)/g, "<h6>$1</h6>");
  md = md.replace(/[\#]{5}(.+)/g, "<h5>$1</h5>");
  md = md.replace(/[\#]{4}(.+)/g, "<h4>$1</h4>");
  md = md.replace(/[\#]{3}(.+)/g, "<h3>$1</h3>");
  md = md.replace(/[\#]{2}(.+)/g, "<h2>$1</h2>");
  md = md.replace(/[\#]{1}(.+)/g, "<h1>$1</h1>");

  //alt h
  md = md.replace(/^(.+)\n\=+/gm, "<h1>$1</h1>");
  md = md.replace(/^(.+)\n\-+/gm, "<h2>$1</h2>");

  //images
  md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');

  //links
  md = md.replace(
    /[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g,
    '<a href="$2" title="$4">$1</a>'
  );

  //font styles
  md = md.replace(/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g, "<b>$1</b>");
  md = md.replace(/[\*\_]{1}([^\*\_]+)[\*\_]{1}/g, "<i>$1</i>");
  md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, "<del>$1</del>");

  //pre
  md = md.replace(/^\s*\n\`\`\`(([^\s]+))?/gm, '<pre class="$2">');
  md = md.replace(/^\`\`\`\s*\n/gm, "</pre>\n\n");

  //code
  md = md.replace(/[\`]{1}([^\`]+)[\`]{1}/g, "<code>$1</code>");

  //p
  md = md.replace(/^\s*(\n)?(.+)/gm, function (m) {
    return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m)
      ? m
      : "<p>" + m + "</p>";
  });

  //strip p from pre
  md = md.replace(/(\<pre.+\>)\s*\n\<p\>(.+)\<\/p\>/gm, "$1$2");

  return md;
}
