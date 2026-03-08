// js/products.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import { getFirestore, collection, getDocs, orderBy, query } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyBOrkthWvp-RXs7-DN2XTH2ssL3o77hnQc",
    authDomain: "tamyos-admin.firebaseapp.com",
    projectId: "tamyos-admin",
    storageBucket: "tamyos-admin.firebasestorage.app",
    messagingSenderId: "407186220422",
    appId: "1:407186220422:web:114c26b4c174a3f8e73807"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// fetch products from Firestore
const fetchProducts = async () => {
    const productsGrid = document.getElementById('products-grid')

    try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
            productsGrid.innerHTML = '<p class="no-products">No products yet.</p>'
            return
        }

        // clear loading state
        productsGrid.innerHTML = ''

        snapshot.forEach((doc) => {
            const product = doc.data()
            const card = createProductCard(product)
            productsGrid.appendChild(card)
        })

    } catch (err) {
        console.error(err)
        productsGrid.innerHTML = '<p class="no-products">Failed to load products.</p>'
    }
}

// create a product card element
const createProductCard = (product) => {
    const li = document.createElement('li')
    li.className = 'product-card'
    li.innerHTML = `
        <a href="${product.depopLink}" target="_blank" rel="noopener" class="product-card__link">
            <div class="product-card__image-wrap">
                <img
                    src="${product.imageUrl}"
                    alt="${product.name}"
                    loading="lazy"
                />
            </div>
            <div class="product-card__body">
                <h2 class="product-card__name">${product.name}</h2>
                <p class="product-card__size">Size: ${product.size}</p>
                <p class="product-card__desc">${product.description}</p>
                <span class="product-card__cta">View on Depop ↗</span>
            </div>
        </a>
    `
    return li
}

fetchProducts()