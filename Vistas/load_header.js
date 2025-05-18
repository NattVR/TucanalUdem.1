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
