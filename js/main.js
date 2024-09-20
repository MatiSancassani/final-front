const productsContainer = document.querySelector('#productsContainer');
let buttonCard = document.querySelectorAll("#button-card");
const detailProduct = document.querySelector('#detailProduct');



const API = 'http://localhost:8030/api/products';
const APIUSERS = 'http://localhost:8030/api/users';

let productsData = [];



window.addEventListener('DOMContentLoaded', () => {
    getProducts();
})

// OBTENER LISTA DE PRODUCTOS CON METODO GET
const getProducts = async () => {
    try {
        const response = await fetch(API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Para enviar cookies en la petición
        });
        if (!response.ok) {
            throw new Error('Error al cargar los productos')
        }
        const jsonResponse = await response.json();
        const products = jsonResponse.payload;
        // ACA GUARDO LO TRAIDO DE LA BASE DE DATOS EN LA VARIABLE CREADA AL PRINCIPIO, PARA HACER USO GLOBAL LUEGO!!
        productsData = products
        productsContainer.innerHTML = '';
        const email = localStorage.getItem('userEmail');
        const rolUser = localStorage.getItem('userRol');
        products.forEach(product => {
            const div = document.createElement("div");
            div.classList.add("card-container");
            if (email === product.owner || rolUser === 'admin') {
                div.innerHTML = `
            <div class="actionMenu">
                <button type="button" class="btn buttonEdit" data-bs-toggle="modal" data-bs-target="#exampleModa2" onclick="editProduct('${product._id}')">
                    <i class="bi bi-pencil-square buttonEdit"></i>
                </button>

                <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal3" onclick="obtainIdProduct('${product._id}')">
                    <i class="bi bi-trash3-fill buttonRemove"></i>
                </button>        
            </div>
                <img class="img-card" src="${product.thumbnail}" alt="${product.title}">                
                <h3 class="title-card">${product.title}</h3>
                <p class="desc-card">${product.description}</p>
                <p class="price-card">$${product.price}</p>
            `;
            } else {
                div.innerHTML = `
                <img class="img-card" src="${product.thumbnail}" alt="${product.title}">                
                <h3 class="title-card">${product.title}</h3>
                <p class="desc-card">${product.description}</p>
                <p class="price-card">$${product.price}</p>
                <button class="button-card" id="buttonAddToCart" onclick="addProductInCart('${product._id}')">Add to cart</button>
            `;
            }
            productsContainer.append(div);
        })

    } catch (error) {
        console.log(error)
    }
};

// EDITAR FORM CON METODO PUT
const editProduct = (productId) => {

    let product = productsData.find(p => p._id === productId);
    if (product) {
        console.log('Producto seleccionado:', product);
    } else {
        console.log('Producto no encontrado');
    }
    document.querySelector('#edit-title').value = product.title;
    document.querySelector('#edit-description').value = product.description;
    document.querySelector('#edit-price').value = product.price;
    document.querySelector('#edit-stock').value = product.stock;
    document.querySelector('#edit-category').value = product.category;
    document.querySelector('#edit-ID').value = productId;
}

const updateProduct = async () => {
    try {
        const API2 = `http://localhost:8030/api/products/${document.querySelector('#edit-ID').value}`
        // Creo un nuevo producto asignandole los nuevos valores a las propiedades de la DB
        const productUpdated = {
            title: document.querySelector('#edit-title').value,
            description: document.querySelector('#edit-description').value,
            price: document.querySelector('#edit-price').value,
            stock: document.querySelector('#edit-stock').value,
            category: document.querySelector('#edit-category').value
        };

        if (!productUpdated.title || !productUpdated.description || !productUpdated.price || !productUpdated.stock || !productUpdated.category) {
            console.log('Error, faltan campos por completar')
            return
        };
        const response = await fetch(API2, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productUpdated),
            credentials: 'include' // Para enviar cookies en la petición
        });
        const jsonResponse = await response.json();
        getProducts();
    } catch (error) {
        console.log('Algo salio mal en PUT:', error)
    }
}
const confirmEditButton = document.querySelector('#confirmEditButton');
confirmEditButton.addEventListener('click', updateProduct);

//  OBTENER ID AL CLICKEAR MODAL DELETE
const obtainIdProduct = (productId) => {
    let product = productsData.find(p => p._id === productId);
    if (product) {
        const id = product._id;
        const IdLS = localStorage.setItem('ID', id);
    }
}

window.obtainIdProduct = obtainIdProduct;


const deleteProduct = async () => {
    try {
        const pid = localStorage.getItem('ID')
        const API2 = `http://localhost:8030/api/products/${pid}`

        const response = await fetch(API2, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(),
            credentials: 'include'
        });
        const jsonResponse = await response.json();
        getProducts();
        // console.log(jsonResponse)
    } catch (error) {
        console.log('Algo salio mal en DELETE:', error)
    }
}
const confirmDeleteButtons = document.querySelector('#confirmDeleteButton');
confirmDeleteButtons.addEventListener('click', deleteProduct);


// ADD PRODUCT IN CART


const addProductInCart = async (pid) => {
    try {
        // const pid = localStorage.getItem('ID');
        const cid = localStorage.getItem('cart_id');
        if (!cid || !pid) {
            console.log('Faltan datos: cid o pid no está definido');
            return;
        }
        const APICART = `http://localhost:8030/api/carts/${cid}/product/${pid}`;
        const response = await fetch(APICART, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(),
            credentials: 'include'
        });

        const jsonResponse = await response.json();
        console.log(jsonResponse)
        if (response.ok) {
            Toastify({
                text: "Producto agregado al carrito con éxito.",
                duration: 1500,
                close: true,
                gravity: "bottom",
                position: "right",
                style: {
                    background: "#000",
                    color: "#fff",
                    textAlign: 'center',
                    borderRadius: '1rem'
                }
            }).showToast()
        }
        updateCartCount()
    } catch (error) {
        console.log('Algo salio mal en AddToCart:', error)
    }
}
window.addProductInCart = addProductInCart;

// Función para actualizar el número de elementos en el carrito
const updateCartCount = async () => {
    try {
        const cid = localStorage.getItem('cart_id');
        if (!cid) {
            console.log('Carrito no encontrado.');
            return;
        }

        const APICART = `http://localhost:8030/api/carts/${cid}`;
        const response = await fetch(APICART, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.ok) {
            const cart = await response.json();
            // console.log(cart.payload.cart.products);

            const totalItems = cart.payload.cart.products.reduce((total, product) => {
                return total + product.quantity;
            }, 0);

            // console.log('Total items in cart:', totalItems);


            document.getElementById('numCart').textContent = totalItems;
        } else {
            console.log('Error al obtener los datos del carrito.');
        }
    } catch (error) {
        console.log('Error al actualizar el contador del carrito:', error);
    }
};
updateCartCount();

// LOGOUT
const closeSession = document.querySelector('#logout');

const logout = async () => {
    try {
        const response = await fetch('http://localhost:8030/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const jsonresponse = response.json()
        if (response.ok) {
            localStorage.clear();
            console.log('Session Cerrada')
            window.location.href = 'http://127.0.0.1:5500/front/pages/login.html';
        }
    } catch (error) {
        console.log('Error al cerrar session', error)
    }
}
closeSession.addEventListener('click', logout);



