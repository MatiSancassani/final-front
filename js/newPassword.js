const API = 'https://final-back-o0ty.onrender.com/api/auth/resetPassword'

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Obtener el token de la URL
const token = getQueryParam('token');

// Asignar el token al campo input
if (token) {
    document.getElementById('tokenInput').value = token;
}


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('resetPasswordForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const token = document.querySelector('input[name="token"]').value;
        const newPassword = document.getElementById('newPassword').value;

        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, newPassword }),
            credentials: 'include'
        });

        const messageElement = document.getElementById('message');
        if (response.ok) {
            const result = await response.json();
            messageElement.textContent = result.message;
            setTimeout(() => {
                window.location.href = result.redirectUrl;
            }, 2000);
        } else {
            const error = await response.text();
            messageElement.textContent = error;
        }
    });
});