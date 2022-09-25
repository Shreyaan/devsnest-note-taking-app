const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

let mainDiv = document.getElementById("main_note_div");

if (
  localStorage.getItem("notes") == null ||
  undefined ||
  params.id == null ||
  undefined
) {
  mainDiv.innerHTML = `  <div class="error"><h3>No Notes exist. Please add them from the  <a href="./">main page</h3></div></a>`;
  throw new Error("this note isnt available 🙁");
}

let note = getNoteFromLocal();

function getNoteFromLocal() {
  if (JSON.parse(localStorage.getItem("notes"))[params.id])
    return JSON.parse(localStorage.getItem("notes"))[params.id];
  else return false;
}

if (note === false) {
  mainDiv.innerHTML = `  <div class="error"><h3>This note isnt avaiable. Please add it from the  <a href="./">main page</h3></div></a>`;
  throw new Error("this note isnt available 🙁");
}

let outputArea = document.getElementById("output-area");
let inputArea = document.getElementById("input-area");
let noteTitleEl = document.getElementById("note_title");
let noteTitlePreviewEl = document.getElementById("note_preview_title");

if (note.title) {
  noteTitleEl.value = note.title;
  noteTitlePreviewEl.innerText = note.title + " - preview";
} else {
  noteTitleEl.value = "Untitled";
  noteTitlePreviewEl.innerText = "Untitled - preview";
}

inputArea.value = note.body;
outputArea.innerHTML = parseMd(inputArea.value);

inputArea.addEventListener("input", () => handleBodyInput());

function handleBodyInput() {
  if (document.querySelector(".right_half").style.display != "none") {
    outputArea.innerHTML = parseMd(removeTags(inputArea.value));
  }
  let notes = JSON.parse(localStorage.getItem("notes"));
  notes[params.id].body = removeTags(inputArea.value);
  localStorage.setItem("notes", JSON.stringify(notes));
}

noteTitleEl.addEventListener("input", () => handleTitleInput());

function handleTitleInput() {
  noteTitlePreviewEl.innerText = noteTitleEl.value + " - preview";
  let notes = JSON.parse(localStorage.getItem("notes"));
  notes[params.id].title = noteTitleEl.value;
  localStorage.setItem("notes", JSON.stringify(notes));
}

function removeTags(str) {
  if (str === null || str === "") return false;
  else str = str.toString();
  let newStr = str.replace(/(<([^>]+)>)/gi, "");
  if (newStr != str)
    newStr =
      "<small><i>●html tags have been removed from this note</i> <br></small>" +
      newStr;
  return newStr;
}

let boldBtn = document.getElementById("bold_button");

//better way - https://stackoverflow.com/a/28663818
boldBtn.addEventListener("click", function () {
  let NotesBody = document.getElementById("input-area");

  let selectedText = window.getSelection().toString();
  let location = NotesBody.value.indexOf(selectedText);
  let startingString = NotesBody.value.slice(0, location);
  let endingString = NotesBody.value.slice(
    selectedText.length + startingString.length,
    NotesBody.value.length
  );
  if (selectedText == null || selectedText == undefined || selectedText == "") {
    NotesBody.value += " **" + "Bold text" + "**";
    NotesBody.focus();
    NotesBody.selectionStart = NotesBody.value.length - 11;
    NotesBody.selectionEnd = NotesBody.value.length - 2;
    // }
    return;
  }
  if (location == 0) {
    NotesBody.value =
      startingString + " **" + selectedText + "**" + endingString;
  } else {
    NotesBody.value =
      startingString + "**" + selectedText + "**" + endingString;
  }
  outputArea.innerHTML = parseMd(removeTags(inputArea.value));
  let notes = JSON.parse(localStorage.getItem("notes"));
  notes[params.id].body = removeTags(inputArea.value);
  localStorage.setItem("notes", JSON.stringify(notes));
});

let underLineBtn = document.getElementById("underline_button");

underLineBtn.addEventListener("click", function () {
  let NotesBody = document.getElementById("input-area");

  let selectedText = window.getSelection().toString();
  let location = NotesBody.value.indexOf(selectedText);
  let startingString = NotesBody.value.slice(0, location);
  let endingString = NotesBody.value.slice(
    selectedText.length + startingString.length,
    NotesBody.value.length
  );
  if (selectedText == null || selectedText == undefined || selectedText == "") {
    NotesBody.value += " --" + "underline text" + "--";
    NotesBody.focus();
    NotesBody.selectionStart = NotesBody.value.length - 16;
    NotesBody.selectionEnd = NotesBody.value.length - 2;
    return;
  }

  NotesBody.value = startingString + "--" + selectedText + "--" + endingString;
  outputArea.innerHTML = parseMd(removeTags(inputArea.value));
  let notes = JSON.parse(localStorage.getItem("notes"));
  notes[params.id].body = removeTags(inputArea.value);
  localStorage.setItem("notes", JSON.stringify(notes));
});

//https://codepen.io/kvendrik/pen/bGKeEE
function parseMd(md) {
  //underline
  md = md.replace(/[\-\_]{2}([^\-\_]+)[\-\_]{2}/g, "<u>$1</u>");

  //font styles
  md = md.replace(/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g, "<b>$1</b>");
  md = md.replace(/[\*\_]{1}([^\*\_]+)[\*\_]{1}/g, "<i>$1</i>");
  md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, "<del>$1</del>");
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
