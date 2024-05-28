document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        loadBookList();
    } else if (window.location.pathname.endsWith('bok.html')) {
        loadBookDetails();
    }
});

function loadBookList() {
    const bookListElement = document.getElementById('book-list');

    fetch('http://localhost:3000/Bok')
        .then(response => response.json())
        .then(data => {
            data.forEach(book => {
                const bookItem = document.createElement('li');
                bookItem.classList.add('book');
                bookItem.textContent = `${book[1]} by ${book[2]}`;
                bookItem.dataset.booknumber = book[4];
                bookItem.addEventListener('click', () => {
                    window.location.href = `bok.html?booknumber=${book[4]}`;
                });
                bookListElement.appendChild(bookItem);
            });
        });
}

function loadBookDetails() {
    const bookDetailsElement = document.getElementById('book-details');
    const urlParams = new URLSearchParams(window.location.search);
    const booknumber = urlParams.get('booknumber');

    if (booknumber) {
        fetch(`http://localhost:3000/Bok/${booknumber}`)
            .then(response => response.json())
            .then(data => {
                const book = data[0];
                const imagePath = `http://localhost:3000/${book[5]}`;
                bookDetailsElement.innerHTML = `
                    <h3>${book[1]}</h3>
                    <p>Author: ${book[2]}</p>
                    <p>ISBN: ${book[3]}</p>
                    <p>Book Number: ${book[4]}</p>
                    <img src="${imagePath}" alt="Strekkode for ${book[1]}">
                `;
            });
    } else {
        bookDetailsElement.innerHTML = '<p>Beklager, vi fant ikke boken du leter etter.</p>';
    }
}