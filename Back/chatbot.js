
document.getElementById('btn-send').addEventListener('click', sendMessage)

document.getElementById('chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const inputField = document.getElementById('chat-input');
    const message = inputField.value.trim();
    if (message !== '') {
        displayMessage('user', message);
        inputField.value = '';
        getResponse(message);
    }
};
const menu = `<br><br>
          1. Información de Pregrado y Posgrado<br>
          2. Información de Idiomas <br>
          3. Información diplomados y cursos de extensión <br>
          4. Información de Bienestar Universitario <br>
          5. Reserva de espacios <br>
          6. Solicitar documentos <br>
          7. Otro<br><br>
          Escribe el número de una de las opciones. `

const res1 = `🏫 La Universidad de Medellín tiene 27 programas de pregrado, 35 especializaciones, 20 maestrías y 5 doctorados. <br> 
🌐 Para más información: <a href="https://www.udem.edu.co/" target="_blank">haz clic aquí</a>`;

const res2 = `El Centro de Idiomas de la UdeMedellín ofrece una variedad de programas diseñados para adaptarse a las necesidades de los estudiantes:<br><br>
1. Cursos Regulares: Constan de 10 niveles, cada uno con una duración de 40 horas y una intensidad de 5 horas semanales. El costo por curso es de $615.000 COP.<br><br>
2. Cursos Intensivos: Diseñados para avanzar más rápidamente, estos cursos tienen una duración de 80 horas con una intensidad de 10 horas semanales. El costo por curso es de $1.230.000 COP.<br><br>
3. Cursos Vacacionales: Ofrecen la posibilidad de avanzar en dos niveles en un periodo corto, con una duración de 80 horas y una intensidad de 24 horas semanales. El costo por curso es de $1.230.000 COP.<br><br><br>
4. Inglés para Maestría y Doctorado: Programas especializados para estudiantes de posgrado. El costo por curso es de $488.000 COP y tiene una duración de 40 horas.<br><br>
<a href="https://centrodeidiomas.udemedellin.edu.co/" target="_blank">haz clic aquí</a>`;

const res3 = `🎓 Oferta de Educación Continuada UdeMedellín <br><br>
✅ Diplomados y Cursos<br>
Más de 300 programas en Derecho, Ingeniería, Diseño, Comunicación, Ciencias Económicas, Humanas y Básicas, enfocados en el desarrollo de competencias profesionales y personales.<br>
<a href="http://localhost:3000/Vistas/reserva_espacios.html" target="_blank">haz clic aquí 📅 </a><br><br>

✅ Cursos Gratuitos en Alianza con Comfenalco<br>
Para afiliados o desempleados, con modalidades virtual y semipresencial.<br>
<a href="http://localhost:3000/Vistas/reserva_espacios.html" target="_blank">haz clic aquí 📅 </a><br><br>

✅ Diplomatura en Moda (con Inexmoda)
Enfocada en el sistema moda y estrategias de mercado.<br>
<a href="http://localhost:3000/Vistas/reserva_espacios.html" target="_blank">haz clic aquí 📅 </a><br><br>

✅ Cursos Libres
Asignaturas individuales de pregrado y posgrado.<br>
Para personas externas a la universidad.<br>
Costo:<br>
Pregrado: $1.512.000 por asignatura.<br>
Posgrado: depende del número de créditos.<br>

<a href="http://localhost:3000/Vistas/reserva_espacios.html" target="_blank">haz clic aquí 📅 </a><br>`;

const res4 = `Bienestar Universitario de la Universidad de Medellín ofrece una variedad de servicios y programas destinados a promover la formación integral y el bienestar de toda la comunidad universitaria.<br><br>

🩺 Salud:<br> Atención primaria, primeros auxilios en campus y promoción de estilos de vida saludables.<br><br>

🧠 Orientación y Desarrollo Humano: <br>Apoyo psicológico, orientación socioeconómica y acompañamiento a estudiantes, padres y personal.<br><br>

🏃 Deportes: <br>Actividades deportivas recreativas y competitivas. Escuelas de formación abiertas a toda la comunidad.<br><br>

🎭 Arte y Cultura: <br> Talleres y proyectos para fortalecer la creatividad, la expresión artística y la participación cultural.<br><br>
Para mas información: <a href="https://bienestaruniversitario.udemedellin.edu.co/" target="_blank">haz clic 🔗 aquí</a>`

const res5 = ` Si eres estudiante de la Universidad de Medellín, puedes reservar los espacios de la universidad a través del siguiente enlace.
Si eres externo, comunícate al siguiente correo electrónico para recibir más información.  <br>
<a href="http://localhost:3000/Vistas/reserva_espacios.html" target="_blank">haz clic aquí 📅 </a><br>`;

const res6 = `Si eres estudiante de la Universidad de Medellín, y requieres solicitar documentos hazlo a través del siguiente enlace.<br>
<a href="http://localhost:3000/Vistas/mis_solicitudes.html" target="_blank">haz clic aquí 📋 </a><br>`;

const res7 =`Si tienes alguna otra consulta o quieres comunicarte con un asesor por favor haz click en el siguiente enlace.
<a href="http://localhost:3000/Vistas/mis_citas.html" target="_blank">haz clic aquí 🧑‍💻 </a>`;

function displayMessage (type, message) {
    const chatBox = document.getElementById('chatbot');
    const messageElement = document.createElement('li');
    if (type === 'bot') {
        messageElement.innerHTML = message; 
    } else {
        messageElement.textContent = message; 
    }
    messageElement.classList.add(type);
    chatBox.appendChild(messageElement); 
}

function getResponse(message) {
    let response= '';
    if(message === '1'){
        response= res1
    }
    else if(message === '2'){
        response = res2
    }
    else if(message === '3'){
        response = res3
    }
    else if(message === '4'){
        response = res4
    }
    else if(message === '5'){
        response = res5
    }
    else if(message === '6'){
        response = res6
    }
    else if(message === '7'){
        response = res7
    }
    else{
        response = 'Lo siento. Por favor, elige una opción válida.'+ menu;

    }
    setTimeout(() => {
        displayMessage('bot', response );
    }, 500);
}



