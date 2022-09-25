if (localStorage.getItem("notes") == null || undefined) {
  noteObj = {
    title: "Markdown Preview",
    body: MarkdownPreview(),
  };
  let mainNotesArray = [];
  mainNotesArray.push(noteObj);
  mainNotesArray.push({ title: "",
  body: 'note 2',});
  mainNotesArray.push({ title: "note 3",
  body: '',});
  localStorage.setItem("notes", JSON.stringify(mainNotesArray));
}

showAllNotes();

let boldBtn = document.getElementById("bold_button");

//better way - https://stackoverflow.com/a/28663818
boldBtn.addEventListener("click", function () {
  let NotesBody = document.getElementById("notesBody");

  let selectedText = window.getSelection().toString();
  let location = NotesBody.value.indexOf(selectedText);
  let startingString = NotesBody.value.slice(0, location);
  let endingString = NotesBody.value.slice(
    selectedText.length + startingString.length,
    NotesBody.value.length
  );
  if (selectedText == null || selectedText == undefined || selectedText == "") {
      NotesBody.value += " **" +  'Bold text' + "**"
      NotesBody.focus();
      NotesBody.selectionStart= NotesBody.value.length-11
      NotesBody.selectionEnd= NotesBody.value.length-2
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
});

let underLineBtn = document.getElementById("underline_button");

underLineBtn.addEventListener("click", function () {
  let NotesBody = document.getElementById("notesBody");

  let selectedText = window.getSelection().toString();
  let location = NotesBody.value.indexOf(selectedText);
  let startingString = NotesBody.value.slice(0, location);
  let endingString = NotesBody.value.slice(
    selectedText.length + startingString.length,
    NotesBody.value.length
  );
  if (selectedText == null || selectedText == undefined || selectedText == "") {
    NotesBody.value += " --" +  'underline text' + "--"
    NotesBody.focus();
    NotesBody.selectionStart= NotesBody.value.length-16
    NotesBody.selectionEnd= NotesBody.value.length-2
    return;
  }

  NotesBody.value = startingString + "--" + selectedText + "--" + endingString;
});

let addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", function (e) {
  let NotesBody = document.getElementById("notesBody");
  let NotesTitle = document.getElementById("notesTitle");
  getNotesFromLocal();
  noteObj = {
    title: NotesTitle.value,
    body: removeTags(NotesBody.value),
  };
  mainNotesArray.push(noteObj);
  localStorage.setItem("notes", JSON.stringify(mainNotesArray));
  NotesBody.value = "";
  NotesTitle.value = "";
  showAllNotes();
});

function showAllNotes() {
  getNotesFromLocal();
  let allCards = "";
  // mainNotesArray.forEach(function (element, i) {
  //   allCards += cardHtml(i, element);
  // });
  for (let i = 0; i < mainNotesArray.length; i++) {
    const element = mainNotesArray[i];
    allCards += cardHtml(i, element);
  }
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
        let cardBody = element.querySelectorAll("#note_body")[0].innerHTML.toLowerCase();
        let cardTitle = element.getElementsByTagName("h5")[0].innerText.toLowerCase();
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


function copyFunc(id) {
  getNotesFromLocal();
   let copyText = mainNotesArray[id]
   let title
   let body =copyText.body
   if(copyText.title==null|| copyText.title== undefined||copyText.title== '') title = "Untitled"
   else title = copyText.title

   if(copyText.body == false) body = ""
   navigator.clipboard.writeText(title + '\n' + body);
    showSnackBar(title + " " + "Note copied!!")
 }

//helper functions

function showSnackBar(msg) {
  let snackbar = document.getElementById("snackbar");
  snackbar.innerHTML = msg
  snackbar.className = "show";
  setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 1500)}

function getNotesFromLocal() {
  let notes = localStorage.getItem("notes");
  if (notes == null) {
    mainNotesArray = [];
  } else {
    mainNotesArray = JSON.parse(notes);
  }
}

function cardHtml(index, element) {
  let svgIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 4h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711v2zm-7 15.5c0-1.267.37-2.447 1-3.448v-6.052c0-.552.447-1 1-1s1 .448 1 1v4.032c.879-.565 1.901-.922 3-1.006v-7.026h-18v18h13.82c-1.124-1.169-1.82-2.753-1.82-4.5zm-7 .5c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.552.447-1 1-1s1 .448 1 1v10zm5 0c0 .552-.447 1-1 1s-1-.448-1-1v-10c0-.552.447-1 1-1s1 .448 1 1v10zm13-.5c0 2.485-2.017 4.5-4.5 4.5s-4.5-2.015-4.5-4.5 2.017-4.5 4.5-4.5 4.5 2.015 4.5 4.5zm-3.086-2.122l-1.414 1.414-1.414-1.414-.707.708 1.414 1.414-1.414 1.414.707.708 1.414-1.414 1.414 1.414.708-.708-1.414-1.414 1.414-1.414-.708-.708z"/></svg>';

  let limit = 100;
  let truncatedNotesBody;
  let BodyText;
  if (element.body.length >= limit) {
    truncatedNotesBody = element.body.slice(0, limit) + ".....";
    truncatedNotesBody = parseMd(truncatedNotesBody);
    BodyText = truncatedNotesBody;
  }
 else if (element.body.length > 0) {
    BodyText = parseMd(element.body);
  } else BodyText = "";
  return ` <div class="noteCard my-2 mx-2 card" style="width: 18rem">
<div class="card-body">
  <div class="title_row">
    <h5 class="card-title">${
      element.title ? element.title : "Untitled"
    }</h5>
   <div class="note_button">
   <button class="btn btn-success trash " onclick="copyFunc(${index})"> 📋</button>
   <button id="${index}" onclick="deleteNote(this.id)" class="btn btn-danger trash">
     🗑
   </button></div>
  </div>
  <hr />
  <div class="card-text" id="note_body">
    ${BodyText}
  </div>
  <a href="note.html?id=${index}" class="btn btn-outline-primary" role="button">Go to note</a>
</div>
</div> `;
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

//https://codepen.io/kvendrik/pen/bGKeEE
function parseMd(md) {
  //underline
  md = md.replace(/[\-\_]{2}([^\-\_]+)[\-\_]{2}/g, "<u>$1</u>");
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

function MarkdownPreview() {
  return `
  # Markdown syntax guide

## Headers 
 
# This is a Heading h1
## This is a Heading h2 
###### This is a Heading h6

## Emphasis

*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
* Item 2a
* Item 2b

### Ordered

1. Item 1
1. Item 2
1. Item 3
  1. Item 3a
  1. Item 3b

## Images

![This is an alt text.](https://picsum.photos/200/300 "This is a sample image.")

## Links
[Go back to main page](./)

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

  `;
}
