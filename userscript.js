document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.endsWith('brukere.html')) {
        loadUserList();
    } else if (window.location.pathname.endsWith('bruker-info.html')) {
        displayUserDetails();
    } else if (window.location.pathname.endsWith('legg-til-bruker.html')) {
        setupAddUserForm();
    }
});

function loadUserList() {
    const userListElement = document.getElementById('user-list');
    userListElement.innerHTML = '';  
    // ↓ Bruk denne om du ønsker at APIen skal fungere med ubuntu serveren
    //let url = http://192.168.1.126:3000/Låntakere';
    // ↓ Bruk denne om du ønsker at APIen skal fungere lokalt    
    let url = 'http://localhost:3000/Låntakere';


    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                const userItem = document.createElement('li');
                userItem.classList.add('user');
                const userInfo = document.createElement('span');
                userInfo.textContent = `Elev:  ${user[3]}, ${user[1]} ${user[2]}`;
                userInfo.dataset.number = user[3];
                userInfo.addEventListener('click', () => {
                    window.location.href = `bruker-info.html?number=${user[3]}`;
                });



                userItem.appendChild(userInfo);
                userListElement.appendChild(userItem);
            });
        });
}

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const number = params.get('number');
    
    if (number) {
        // ↓ Bruk denne om du ønsker at APIen skal fungere med ubuntu serveren
        //fetch(`http://192.168.1.126:3000/Låntakere/${number}`)
        // ↓ Bruk denne om du ønsker at APIen skal fungere lokalt
        fetch(`http://localhost:3000/Låntakere/${number}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    displayUserDetails(data.bruker);
                } else {
                    document.getElementById('user-details').innerText = 'Bruker ble ikke funnet';
                }
            })
            .catch(error => console.error('Error:', error));
    }
});

function displayUserDetails(user) {
    const userDetails = document.getElementById('user-details');
    // ↓ Bruk denne om du ønsker at APIen skal fungere med ubuntu serveren
    //const imagePath = `http://192.168.1.126:3000/${user.image_path}`;
    //const photo = `http://192.168.1.126:3000/${user.photo}`;
    // ↓ Bruk denne om du ønsker at APIen skal fungere lokalt
    const imagePath = `http://localhost:3000/${user.image_path}`;
    const photo = `http://localhost:3000/${user.photo}`;
    userDetails.innerHTML = `
        <img src="${photo}" alt="Bilde av Brukeren">
        <h2>${user.fornavn}</h2>
        <p>${user.etternavn}</p>
        <p>Elev ${user.number}</p>
        <img src="${imagePath}" alt="Barcode">
        
    `;
    
}