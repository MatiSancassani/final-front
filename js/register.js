document.getElementById('registerForm').addEventListener('submit', async (e) => {
    try {
        e.preventDefault();
        const name = document.getElementById('name').value
        const lastName = document.getElementById('lastName').value
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        // const confirmPassword = document.getElementById('confirmPassword').value;

        const response = await fetch('https://final-back-o0ty.onrender.com/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, lastName, email, password })
        });
        const data = await response.json();

        if (data.status !== "success") {
            console.log('Error en registro:', data.error || 'Unknown error');

        } else {
            console.log('Registro exitoso', data);
            window.location.href = 'https://final-front-mva2.onrender.com/';
        }
    } catch (error) {
        console.log(error)
    }

});

