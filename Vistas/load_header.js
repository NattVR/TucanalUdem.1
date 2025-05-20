document.addEventListener("DOMContentLoaded", async function () {
    try {
      const response = await fetch('http://localhost:5000/tu_canal_udem/checkAuth', {
        method: 'GET',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.loggedIn) {
        console.log('Usuario autenticado:', data.user);
        fetch('header_iniciado.html')
        .then(response => response.text())
        .then(data => {
          document.getElementById('header').innerHTML = data;

        const logoutbtn=document.getElementById("btnlogout");
          if (logoutbtn) {
            logoutbtn.addEventListener('click', logout);
          } else {
            console.warn('Botón de cerrar sesión no encontrado');
          }
        });

      } else {
        console.log('Usuario no autenticado');
        fetch('header.html')
        .then(response => response.text())
        .then(data => {
          document.getElementById('header').innerHTML = data;
        });
      }
    } catch (error) {
        console.error('Error:', error);
    }});

function logout() {
    fetch('http://localhost:5000/tu_canal_udem/logout', {
        method: 'POST',
        credentials: 'include', 
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            console.log('Sesión cerrada exitosamente');
            window.location.href = 'index.html';
        } else {
            console.error('Error al cerrar sesión');
        }
    })
}