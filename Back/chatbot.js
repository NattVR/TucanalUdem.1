
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

function displayMessage (type, message) {
    const chatBox = document.getElementById('chatbot');
    const messageElement = document.createElement('li');
    messageElement.textContent = message;
    messageElement.classList.add(type);
    chatBox.appendChild(messageElement); 
}

function getResponse(message) {
    let response= '';
    if(message === '1'){
        response= "La universiad de Medellín tiene 27 programas de pregrado. \n Dentro de posgrados hay 35 especializaciones, 20 maestrías y 5 doctorados. \n Para mas información:"
    }
    else if(message === '2'){
        response = 'La UdeM ofrece cursos regulares, intensivos y vacacionales, con modalidades presenciales e híbridas. Para conocer más detalles sobre los programas, inscripciones y fechas 👉 centrodeidiomas.udemedellin.edu.co '
    }
    else if(message === '3'){
        response = 'opCION 3'
    }
    else if(message === '4'){
        response = 'opCION 4'
    }
    else if(message === '5'){
        response = "Para reservar espacios de la Universidad de Medellín dirigete a:"
    }
    else if(message === '6'){
        response = "Para solicitar documentos realiza el formulario y te mantendremos al tanto de tu solicitud"
    }
    else if(message === '7'){
        response = 'Por favor contáctate con uno de nuestros asesores, agenda tu cita en el siguiente enlace:'
    }
    else{
        response = 'Lo siento, opción no válida.';
    }
    setTimeout(() => {
        displayMessage('bot', response );
    }, 500);
}



