const saveKeyword = document.querySelector("#saveKeyword");
let keywordInput = document.querySelector("#keywordsInput");
const printSection = document.querySelector("#printKeywords");
const saveBtn = document.querySelector("#saveBtn");
const pdfToUpload = document.querySelector("#pdfUpload");
const notesAddBtn = document.querySelector('#saveNotes');
const noteTextArea = document.querySelector('#notesText');
const printNoteSection =  document.querySelector('#printNotes');

const api_key_cloudinary = '127717317775552';
const cloud_name = 'du1rn35uq';
recordedNotes = [];

let pdfURL;

keywordArray = [];
saveKeyword.addEventListener("click", function() {
    let keyword = keywordInput.value || "";
    if (!keywordArray.includes(keyword)) {
        keywordArray.push(keyword)
    }
    printSection.innerHTML = keywordArray.join(", ");
    keywordInput.value = "";
})

// initalizes the widget in memory
var myWidget = cloudinary.createUploadWidget({
    cloudName: 'du1rn35uq',
    uploadPreset: 'pdfSearch'
}, (error, result) => {
if (!error && result && result.event === 'success'){
    console.log("Success");
    pdfURL = result.info.secure_url;
    // // not producing proofs of PDFs
    // const img = document.createElement('img');
    // img.classList.add('pdfProof');
    // img.src = pdfURL;
    // document.body.appendChild(img);
    // console.log(pdfURL)
} else {console.error(error)}})


document.querySelector('.cloudinary-button').addEventListener('click', function() {
    myWidget.open()
}, false);

// generate unique ID function 
function generateUniqueId() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const result = [];
    for (var i = 0; i < 10; i++) {
      let randomIndex = Math.floor(Math.random() * characters.length );
      let randomCharacter = characters.charAt(randomIndex);
      result.push(randomCharacter)
    }
    return result.join('')
  }


notesAddBtn.addEventListener('click', () => {
  let noteText = noteTextArea.value || "";
  recordedNotes.push(noteText);
  printNoteSection.innerHTML += '';
  printNoteSection.innerHTML = recordedNotes.join(", ");
  noteTextArea.value = '';

})

// save bundle of information and post to server
let saveBundle;
saveBtn.addEventListener("click", function() {
    var saveBundle = {
        id: generateUniqueId(),
        fileName: pdfURL,
        keywords: keywordArray,
        notes: recordedNotes
    };

    console.log(saveBundle);

    fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saveBundle),
    }).then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error))
    
    // clear page
    keywordArray = [];
    printSection.innerHTML = ''; 
    printNoteSection.innerHTML = "";

})

