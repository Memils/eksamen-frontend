document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        loadBookList();
        setupSearch();
    } else if (window.location.pathname.endsWith('bok.html')) {
        displayBookDetails();
    } else if (window.location.pathname.endsWith('legg-til.html')) {
        setupAddBookForm();
    }
});

function loadBookList(searchString = '') {
    const bookListElement = document.getElementById('book-list');
    bookListElement.innerHTML = '';  
    // ↓ Bruk denne om du ønsker at APIen skal fungere med ubuntu serveren
    //let url = http://192.168.1.126:3000/Bok';
    // ↓ Bruk denne om du ønsker at APIen skal fungere lokalt    
    let url = 'http://localhost:3000/Bok';
    if (searchString) {
        // ↓ Bruk denne om du ønsker at APIen skal fungere med ubuntu serveren
        //url = http://192.168.1.126:3000/filter/${searchString}';
        // ↓ Bruk denne om du ønsker at APIen skal fungere lokalt 
        url = `http://localhost:3000/filter/${searchString}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(book => {
                const bookItem = document.createElement('li');
                bookItem.classList.add('book');
                const bookInfo = document.createElement('span');
                bookInfo.textContent = `${book[1]} by ${book[2]}`;
                if (book[6] != null) {
                    bookInfo.classList.add('loaned');
                    bookInfo.textContent += ' (Utlånt)';
                }
                bookInfo.dataset.booknumber = book[4];
                bookInfo.addEventListener('click', () => {
                    window.location.href = `bok.html?booknumber=${book[4]}`;
                });

                const deleteButton = document.createElement('span');
                deleteButton.textContent = 'Slett X';
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

function setupSearch() {
    const searchBook = document.getElementById('search-book');
    searchBook.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const searchString = searchBook.value.trim();
            loadBookList(searchString);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const booknumber = params.get('booknumber');
    
    if (booknumber) {
        // ↓ Bruk denne om du ønsker at APIen skal fungere med ubuntu serveren
        //fetch(`http://192.168.1.126:3000/Bok/${booknumber}`)
        // ↓ Bruk denne om du ønsker at APIen skal fungere lokalt
        fetch(`http://localhost:3000/Bok/${booknumber}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayBookDetails(data.book);
                } else {
                    document.getElementById('book-details').innerText = 'Bok ikke funnet';
                }
            })
            .catch(error => console.error('Error:', error));
    }

    const deleteButton = document.getElementById('delete-book-button');
    deleteButton.addEventListener('click', function() {
        deleteBook(booknumber, true);
    });
});

function displayBookDetails(book) {
    const bookDetails = document.getElementById('book-details');
    // ↓ Bruk denne om du ønsker at APIen skal fungere med ubuntu serveren
    //const imagePath = `http://192.168.1.126:3000/${book.image_path}`;
    // ↓ Bruk denne om du ønsker at APIen skal fungere lokalt
    const imagePath = `http://localhost:3000/${book.image_path}`;
    bookDetails.innerHTML = `
        <h2>${book.title}</h2>
        <p>Forfatter: ${book.author}</p>
        <p>ISBN: ${book.isbn}</p>
        <p>Boknummer: ${book.booknumber}</p>
        <img src="${imagePath}" alt="Barcode">
        <p>Lånt av: ${book.loaned_to}</p>
        <p>Låndato: ${book.loan_date}</p>
    `;
}

function setupAddBookForm() {
    const addBookForm = document.getElementById('add-book-form');
    addBookForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(addBookForm);
        const bookData = {
            title: formData.get('title'),
            author: formData.get('author'),
            isbn: formData.get('isbn'),
            booknumber: formData.get('booknumber')
        };
        const jsonBookData = JSON.stringify(bookData);
        // ↓ Bruk denne om du ønsker at APIen skal fungere med ubuntu serveren
        //fetch(`http://192.168.1.126:3000/leggtilbok'), {
        // ↓ Bruk denne om du ønsker at APIen skal fungere lokalt
        fetch('http://localhost:3000/leggtilbok', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonBookData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Boka ble lagt til!');
                window.location.href = 'index.html';
            } else {
                alert('Klarte ikke legge til bok: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('En feil oppsto da du prøvde å legge til denne boka!');
        });
    });
}
function deleteBook(booknumber, redirect = false) {
    // ↓ Bruk denne om du ønsker at APIen skal fungere med ubuntu serveren
    //fetch(`http://192.168.1.126:3000/slett/${booknumber}`)
    // ↓ Bruk denne om du ønsker at APIen skal fungere lokalt
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
function searchByBarcode() {
    const barcodeInput = document.getElementById('barcode-search').value;
    if (barcodeInput) {
        window.location.href = `bok.html?booknumber=${barcodeInput}`;
    } else {
        alert('Vennligst skriv inn et boknummer');
    }
}

document.addEventListener('DOMContentLoaded', function() {

});

document.addEventListener('DOMContentLoaded', function() {
    const returnBookButton = document.getElementById('return-book-button');
    const returnBookSection = document.getElementById('return-book-section');
    const returnBookBarcodeInput = document.getElementById('returnBookBarcode');

    returnBookButton.addEventListener('click', function() {
        returnBookSection.style.display = 'block';
    });

    returnBookBarcodeInput.addEventListener('change', function() {
        const bookBarcode = returnBookBarcodeInput.value;
         // ↓ Bruk denne om du ønsker at APIen skal fungere med ubuntu serveren
        //fetch(`http://192.168.1.126:3000/Bok/innlever/${book}`)
        // ↓ Bruk denne om du ønsker at APIen skal fungere lokalt
        fetch(`http://localhost:3000/Bok/innlever/${bookBarcode}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Boka er innlevert');
                returnBookSection.style.display = 'none';
                returnBookBarcodeInput.value = '';
                loadBooks();  
            } else {
                alert('Klarte ikke å innlevere boka: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('En feil oppsto da du prøvde å innlevere denne boka!');
        });
    });

    function loadBooks() {
         // ↓ Bruk denne om du ønsker at APIen skal fungere med ubuntu serveren
         //fetch(`http://192.168.1.126:3000/bok`)
         // ↓ Bruk denne om du ønsker at APIen skal fungere lokalt
        fetch('http://localhost:3000/bok')
            .then(response => response.json())
            .then(data => {
                const bookList = document.getElementById('book-list');
                bookList.innerHTML = '';
                data.books.forEach(book => {
                    const li = document.createElement('li');
                    li.textContent = `${book.title} - ${book.author}`;
                    li.addEventListener('click', () => {
                        window.location.href = `bok.html?number=${book.booknumber}`;
                    });
                    bookList.appendChild(li);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    loadBooks();
});