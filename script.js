document.addEventListener("DOMContentLoaded", () => {
    const bookListElement = document.getElementById('book-list');
    const bookDetailsElement = document.getElementById('book-details');

    fetch('http://localhost:3000/Bok')
        .then(response => response.json())
        .then(data => {
            data.forEach(book => {
                const bookItem = document.createElement('li');
                bookItem.classList.add('book');
                bookItem.textContent = `${book[1]} by ${book[2]}`;
                bookItem.dataset.booknumber = book[4];
                bookListElement.appendChild(bookItem);
            });
        });

    bookListElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('book')) {
            const booknumber = event.target.dataset.booknumber;
            fetch(`http://localhost:3000/Bok/${booknumber}`)
                .then(response => response.json())
                .then(data => {
                    const book = data[0];
                    bookDetailsElement.innerHTML = `
                        <h3>${book[1]}</h3>
                        <p>Author: ${book[2]}</p>
                        <p>ISBN: ${book[3]}</p>
                        <p>Book Number: ${book[4]}</p>
                        <img src="${book[5]}" alt="Barcode for ${book[1]}">
                    `;
                });
        }
    });
});