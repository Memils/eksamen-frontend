document.addEventListener('DOMContentLoaded', function() {
    const userBarcodeInput = document.getElementById('userBarcode');
    const bookBarcodeInput = document.getElementById('bookBarcode');
    const confirmLoanButton = document.getElementById('confirm-loan');

    let currentUser = null;
    let currentBook = null;

    userBarcodeInput.addEventListener('change', function() {
        const userBarcode = userBarcodeInput.value;
        fetch(`http://localhost:3000/Låntakere/${userBarcode}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    currentUser = data.bruker;
                    displayUserDetails(currentUser);
                    userBarcodeInput.disabled = true;
                } else {
                    alert('Bruker ble ikke funnet');
                }
            })
            .catch(error => console.error('Error:', error));
    });

    bookBarcodeInput.addEventListener('change', function() {
        const bookBarcode = bookBarcodeInput.value;
        fetch(`http://localhost:3000/Bok/${bookBarcode}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    currentBook = data.book;
                    displayBookDetails(currentBook);
                    bookBarcodeInput.disabled = true;
                    confirmLoanButton.disabled = false;
                } else {
                    alert('Bok ble ikke funnet');
                }
            })
            .catch(error => console.error('Error:', error));
    });

    confirmLoanButton.addEventListener('click', function() {
        if (currentUser && currentBook) {
            const loanData = {
                usernumber: currentUser.number,
                loan_date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
            };
            fetch(`http://localhost:3000/Bok/lån/${currentBook.booknumber}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loanData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Boka er lånt ut');
                    window.location.href = 'index.html';
                } else {
                    alert('Klarte ikke låne ut boka: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    function displayUserDetails(user) {
        const userDetails = document.getElementById('user-details');
        userDetails.innerHTML = `
            <p>Navn: ${user.fornavn} ${user.etternavn}</p>
            <p>Strekkode: ${user.number}</p>
            <img src="http://localhost:3000/${user.photo}" alt="Bilde av Brukeren">
        `;
    }

    function displayBookDetails(book) {
        const bookDetails = document.getElementById('book-details');
        bookDetails.innerHTML = `
            <p>Tittel: ${book.title}</p>
            <p>Forfatter: ${book.author}</p>
            <img src="http://localhost:3000/${book.image_path}" alt="Barcode">
        `;
    }
});