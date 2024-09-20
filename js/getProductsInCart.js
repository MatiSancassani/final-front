const cartContainer = document.querySelector('#productsInCart');
const cid = localStorage.getItem('cart_id')
const APIWITHID = `http://localhost:8030/api/carts/${cid}`;
const totalCart = document.querySelector('#totalCart');
let productsInCart = [];
window.addEventListener('DOMContentLoaded', () => {
    getProductsInCart();
})

const getProductsInCart = async () => {
    try {
        const response = await fetch(APIWITHID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Para enviar cookies en la petición
        });
        if (!response.ok) {
            throw new Error('Error al cargar los productos del carrito')
        }
        const data = await response.json();
        const cartProducts = data.payload.cart.products;
        productsInCart = cartProducts
        cartContainer.innerHTML = '';

        // ACA GUARDO LO TRAIDO DE LA BASE DE DATOS EN LA VARIABLE CREADA AL PRINCIPIO, PARA HACER USO GLOBAL LUEGO!!

        cartProducts.forEach(products => {
            const div = document.createElement("div");
            div.classList.add('cartContainer');
            div.innerHTML = `
                <div class="cartCard">
                    <img src="${products.id.thumbnail}" alt="${products.id.title}" class="imgCart">
                    
                    <div class="itemContainer">
                        <h3>Producto:</h3>
                        <small>${products.id.title}</small>
                    </div>
                    <div class="itemContainer">
                        <h3>Description:</h3>
                        <small>${products.id.description}</small>
                    </div>
                    <div class="itemContainer">
                        <h3>Precio:</h3>
                        <small>$${products.id.price}</small>
                    </div>
                    <div class="itemContainer">
                        <h3>Cantidad:</h3>
                        <div class="itemCant">
                            <button class="buttonCant" id="less-${products.id._id}">-</button>
                            <small id="quantity-${products.id._id}">${products.quantity}</small>
                            <button class="buttonCant" id="more-${products.id._id}">+</button>
                        </div>
                    </div>
                    <div class="itemContainer">
                        <h3>Total:</h3>
                        <small>$${products.id.price * products.quantity}</small>
                    </div>     
                    <button class="btn"  id="delete${products.id._id}" onclick="obtainIdProduct('${products.id._id}')">
                        <svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" class="icon">
                        <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
                        </svg>
                     </button>
                    </div>
                    `;

            cartContainer.append(div);

            const deleteProduct = document.querySelector(`#delete${products.id._id}`)
            deleteProduct.addEventListener('click', () => {
                deleteProductInCart();
            })

            const updateQuantity = (pid, currentQuantity) => {
                let newQuantity = currentQuantity;
                if (newQuantity < 1) return;
                updateProductQuantity(pid, newQuantity);
            };

            const quantityElement = document.querySelector(`#quantity-${products.id._id}`);
            const buttonLess = document.querySelector(`#less-${products.id._id}`);
            const buttonMore = document.querySelector(`#more-${products.id._id}`);
            let quantity = parseInt(quantityElement.textContent);

            buttonLess.addEventListener('click', () => {
                if (quantity > 1) {
                    quantity--;
                    quantityElement.textContent = quantity;
                    updateQuantity(products.id._id, quantity, -1);
                }
            })

            buttonMore.addEventListener('click', () => {
                if (quantity) {
                    quantity++;
                    quantityElement.textContent = quantity;
                    updateQuantity(products.id._id, quantity, 1);
                }

            });

            function updateTotal() {
                const totalPrice = productsInCart.reduce((acc, products) => acc + (products.id.price * products.quantity), 0)
                totalCart.innerHTML = `$${totalPrice}`
            }
            updateTotal();



        });

    } catch (error) {
        console.log(error)
        throw error
    }
}

const obtainIdProduct = (productId) => {
    let product = productsInCart.find(p => p.id._id === productId);
    if (product) {
        const id = product.id._id;
        localStorage.setItem('ID', id); // Guarda el ID en localStorage
        // console.log(`Producto con ID ${id} guardado en localStorage`);
    } else {
        console.error('Producto no encontrado');
    }
}

const updateProductQuantity = async (pid, newQuantity) => {
    try {
        const cid = localStorage.getItem('cart_id');
        const API_URL = `http://localhost:8030/api/carts/${cid}/products/${pid}`;

        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ quantity: newQuantity })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la cantidad del producto');
        }

        const data = await response.json();
        console.log('Cantidad actualizada', data);


        getProductsInCart();
    } catch (error) {
        console.error(error);
    }
};


const deleteProductInCart = async () => {
    try {
        const pid = localStorage.getItem('ID')
        const response = await fetch(`${APIWITHID}/products/${pid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const jsonresponse = response.json();

        getProductsInCart();

    } catch (error) {
        console.log('Algo salio mal en DELETE:', error)
    }
}

const deleteAllProductsInCart = async () => {
    try {
        const response = await fetch(APIWITHID, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const jsonresponse = response.json()
        getProductsInCart()
    } catch (error) {
        console.log('Algo salio mal en DELETE:', error)
    }
}

const vaciarCart = document.querySelector('#vaciarCart')
vaciarCart.addEventListener('click', deleteAllProductsInCart)

const pucharseCart = async () => {
    try {
        const response = await fetch(`${APIWITHID}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const jsonResponse = response.json()
        deleteAllProductsInCart()

    } catch (error) {
        console.log('Algo salio mal en PURCHASE:', error)
    }
}

const buyToCart = document.querySelector('#buyToCart')
buyToCart.addEventListener('click', pucharseCart);




