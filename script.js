/* ROLE CHECK */

let role = localStorage.getItem("role");

if(!role){
window.location.href="login.html";
}

/* STUDENT UI MODE */

if(role === "student"){

document.body.classList.add("student-mode");

document.getElementById("dashboardTitle").innerText="📚 Student Library";

}

/* BOOK DATABASE */

let books = JSON.parse(localStorage.getItem("books"));

if(!books || books.length === 0){

books = [

{
id:1,
title:"The Great Gatsby",
author:"F. Scott Fitzgerald",
category:"Classic",
rating:4,
status:"Available",
student:"",
image:"https://covers.openlibrary.org/b/id/7222246-L.jpg"
},

{
id:2,
title:"Harry Potter",
author:"J.K Rowling",
category:"Fantasy",
rating:5,
status:"Available",
student:"",
image:"https://covers.openlibrary.org/b/id/7984916-L.jpg"
},

{
id:3,
title:"The Alchemist",
author:"Paulo Coelho",
category:"Fiction",
rating:4,
status:"Available",
student:"",
image:"https://covers.openlibrary.org/b/id/8279251-L.jpg"
}

];

localStorage.setItem("books",JSON.stringify(books));

}

/* SAVE DATABASE */

function save(){

localStorage.setItem("books",JSON.stringify(books));

updateStats();

}

/* FORM CONTROL */

function openForm(){

document.getElementById("formPopup").style.display="block";

}

function closeForm(){

document.getElementById("formPopup").style.display="none";

}

/* ADD BOOK (LIBRARIAN ONLY) */

function addBook(){

if(role !== "librarian"){
alert("Only librarian can add books");
return;
}

let title=document.getElementById("title").value;
let author=document.getElementById("author").value;
let image=document.getElementById("image").value;
let category=document.getElementById("category").value;

let book={

id:Date.now(),

title,

author,

category,

rating:4,

status:"Available",

student:"",

image:image || "https://picsum.photos/200"

};

books.push(book);

save();

displayBooks();

closeForm();

}

/* DISPLAY BOOKS */

function displayBooks(){

let container=document.getElementById("book-container");

container.innerHTML="";

books.forEach(book=>{

let statusClass = book.status==="Available" ? "available":"issued";

let stars="";

for(let i=0;i<book.rating;i++){
stars+="★";
}

let actions="";

/* ROLE BASED BUTTONS */

if(role==="librarian"){

actions=`

<div class="book-actions">

<button onclick="issueBook(${book.id})">Issue</button>

<button onclick="returnBook(${book.id})">Return</button>

<button onclick="deleteBook(${book.id})">Delete</button>

</div>

`;

}else{

actions=`

<div class="book-actions">

<button onclick="issueBook(${book.id})">Borrow</button>

<button onclick="returnBook(${book.id})">Return</button>

</div>

`;

}

let card=document.createElement("div");

card.className="book-card";

card.innerHTML=`

<img src="${book.image}">

<div class="book-info">

<h3>${book.title}</h3>

<p class="author">${book.author}</p>

<span class="category">${book.category}</span>

<div class="rating">${stars}</div>

<p class="status ${statusClass}">
${book.status}
</p>

${actions}

</div>

`;

container.appendChild(card);

});

updateStats();

}

/* ISSUE BOOK */

function issueBook(id){

let student=prompt("Enter student name");

books = books.map(book=>{

if(book.id===id){

book.status="Issued";

book.student=student;

}

return book;

});

save();

displayBooks();

}

/* RETURN BOOK */

function returnBook(id){

books = books.map(book=>{

if(book.id===id){

book.status="Available";

book.student="";

}

return book;

});

save();

displayBooks();

}

/* DELETE BOOK (LIBRARIAN ONLY) */

function deleteBook(id){

if(role !== "librarian"){
alert("Only librarian can delete books");
return;
}

books = books.filter(book=>book.id!==id);

save();

displayBooks();

}

/* SEARCH BOOK */

function searchBook(){

let keyword=document.getElementById("search").value.toLowerCase();

let filtered=books.filter(book=>

book.title.toLowerCase().includes(keyword) ||

book.author.toLowerCase().includes(keyword)

);

renderFiltered(filtered);

}

/* RENDER FILTER */

function renderFiltered(data){

let container=document.getElementById("book-container");

container.innerHTML="";

data.forEach(book=>{

let card=document.createElement("div");

card.className="book-card";

card.innerHTML=`

<img src="${book.image}">

<div class="book-info">

<h3>${book.title}</h3>

<p>${book.author}</p>

</div>

`;

container.appendChild(card);

});

}

/* UPDATE DASHBOARD */

function updateStats(){

let total=books.length;

let issued=books.filter(b=>b.status==="Issued").length;

let totalEl=document.getElementById("totalBooks");

let issuedEl=document.getElementById("issuedBooks");

if(totalEl) totalEl.innerText=total;

if(issuedEl) issuedEl.innerText=issued;

}

/* DARK MODE */

function toggleDarkMode(){

document.body.classList.toggle("dark");

}

/* LOGOUT */

function logout(){

localStorage.removeItem("role");

window.location.href="login.html";

}

/* INITIAL LOAD */

displayBooks();
