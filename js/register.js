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

// Función para obtener los parámetros de la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Obtener el cart_id de los parámetros de la URL
const cartId = getQueryParam('cart_id');

// Si existe el cart_id, guárdalo en el localStorage
if (cartId) {
    localStorage.setItem('cart_id', cartId);
    console.log(`cart_id guardado en localStorage: ${cartId}`);
}

document.getElementById('github').addEventListener('click', function () {
    window.location.href = 'https://final-back-o0ty.onrender.com/api/auth/github';
});