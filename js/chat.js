// Conectar con el servidor de socket del backend en el puerto correcto
const socket = io('http://localhost:8030');

// Elementos del DOM
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const usernameInput = document.getElementById('username');

// Función para agregar mensajes al chat
const addMessageToChat = (message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.user}: ${message.message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
};

// Recibir mensajes desde el servidor
socket.on('message', (messages) => {
    chatBox.innerHTML = ''; // Limpiar mensajes anteriores
    messages.forEach(addMessageToChat); // Mostrar todos los mensajes
});

// Recibir nuevos mensajes en tiempo real
socket.on('messageLogs', (messages) => {
    chatBox.innerHTML = ''; // Limpiar mensajes anteriores
    messages.forEach(addMessageToChat); // Mostrar todos los mensajes
});

// Notificar cuando un nuevo usuario se conecta
socket.on('newUser', () => {
    const userElement = document.createElement('div');
    userElement.textContent = 'Un nuevo usuario se ha conectado.';
    chatBox.appendChild(userElement);
});

// Enviar mensaje al hacer clic en "Enviar"
sendButton.addEventListener('click', () => {
    const user = usernameInput.value;
    const message = messageInput.value;

    if (user && message) {
        // Enviar mensaje al servidor
        socket.emit('message', { user, message });

        // Limpiar input de mensaje
        messageInput.value = '';
    } else {
        alert('Por favor ingresa un nombre de usuario y un mensaje.');
    }
});