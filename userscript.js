document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.endsWith('brukere.html')) {
        loadUserList();
    } else if (window.location.pathname.endsWith('bruker-info.html')) {
        loadUserDetails();
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