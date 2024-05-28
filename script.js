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
                const bookInfo = document.createElement('span');
                bookInfo.textContent = `${book[1]} by ${book[2]}`;
                bookInfo.dataset.booknumber = book[4];
                bookInfo.addEventListener('click', () => {
                    window.location.href = `bok.html?booknumber=${book[4]}`;
                });

                const deleteButton = document.createElement('span');
                deleteButton.textContent = ' Slett';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    deleteBook(book[4]);
                });

                bookItem.appendChild(bookInfo);
                bookItem.appendChild(deleteButton);
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

                const deleteButton = document.getElementById('delete-book-button');
                deleteButton.addEventListener('click', () => {
                    deleteBook(book[4], true);
                });
                const backButton = document.getElementById('back-button');
                backButton.addEventListener('click', () => {
                    window.location.href = 'index.html';
                });
            });
    } else {
        bookDetailsElement.innerHTML = '<p>Boka ble ikke funnet.</p>';
    }
}

function deleteBook(booknumber, redirect = false) {
    fetch(`http://localhost:3000/slett/${booknumber}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Boka har blitt slettet');
            if (redirect) {
                window.location.href = 'index.html';
            } else {
                location.reload();
            }
        } else {
            alert('Klarte ikke å slette boka');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('En feil oppsto da du prøvde å slette denne boka!');
    });
}