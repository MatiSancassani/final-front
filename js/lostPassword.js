const API = 'http://localhost:8030/api/auth/lostPassword'

document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('#lostPassword').addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.querySelector('#emailPassword').value;
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email }),
            credentials: 'include'
        });

        const messageElement = document.getElementById('message');
        if (response.ok) {
            messageElement.textContent = 'Check your email';
        } else {
            messageElement.textContent = error;
        }
    });

});

