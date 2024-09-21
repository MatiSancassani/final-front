const API = 'https://final-back-o0ty.onrender.com/api/carts';

export const getCartId = async () => {
    try {
        const response = await fetch(API, {
            method: 'GET',
            credentials: 'include' // Para enviar cookies en la petición
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud getCartId')
        }
        const data = await response.json();
        const cartId = data.cartId;
        if (cartId) {
            localStorage.setItem('cart_id', cartId);
            return cartId;
        } else {
            console.error("Error al obtener el cartId:", data.error);
            return null;
        }

    } catch (error) {
        console.error("Error en fetchCartId:", error);
        return null;
    }
}

// 1. Obtener la URL actual
const currentUrl = window.location.href;

// 2. Crear un objeto URLSearchParams con los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);

// 3. Extraer el valor de 'cart_id'
const cartId = urlParams.get('cart_id');

// Si existe el cart_id, guárdalo en el localStorage
if (cartId) {
    localStorage.setItem('cart_id', cartId);
    console.log(`cart_id guardado en localStorage: ${cartId}`);
}

document.getElementById('github').addEventListener('click', function () {
    window.location.href = 'https://final-back-o0ty.onrender.com/api/auth/github';
});