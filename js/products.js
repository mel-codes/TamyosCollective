// js/products.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import { getFirestore, collection, getDocs, orderBy, query, deleteDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

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

const isAdmin = sessionStorage.getItem('isAdmin') === 'true'

// sanitize user-generated content
const sanitize = (str) => {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
}

// custom delete confirm modal
const confirmDelete = (onConfirm) => {
    document.getElementById('delete-modal')?.remove()

    const modal = document.createElement('div')
    modal.id = 'delete-modal'
    modal.className = 'delete-modal'
    modal.innerHTML = `
        <div class="delete-modal__card">
            <h2>Delete Product</h2>
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div class="delete-modal__actions">
                <button id="delete-cancel" class="btn-cancel">Cancel</button>
                <button id="delete-confirm" class="btn-delete">Delete</button>
            </div>
        </div>
    `

    document.body.appendChild(modal)

    document.getElementById('delete-cancel').addEventListener('click', () => modal.remove())
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove() })
    document.getElementById('delete-confirm').addEventListener('click', () => {
        modal.remove()
        onConfirm()
    })
}

// create a product card element
const createProductCard = (docId, product) => {
    const li = document.createElement('li')
    li.className = 'product-card'
    li.dataset.id = docId

    li.innerHTML = `
        <a href="${product.depopLink}" target="_blank" rel="noopener" class="product-card__link">
            <div class="product-card__image-wrap">
                <img src="${product.imageUrl}" alt="${sanitize(product.name)}" loading="lazy" />
            </div>
            <div class="product-card__body">
                <h2 class="product-card__name">${sanitize(product.name)}</h2>
                <p class="product-card__size">Size: ${sanitize(product.size)}</p>
                <p class="product-card__price">${sanitize(product.price || '')}</p>
                <p class="product-card__desc">${sanitize(product.description)}</p>
                <span class="product-card__cta">View on Depop ↗</span>
            </div>
        </a>
        ${isAdmin ? `
            <div class="product-card__admin">
                <button class="btn-edit" data-id="${docId}">Edit</button>
                <button class="btn-delete" data-id="${docId}">Delete</button>
            </div>
        ` : ''}
    `

    if (isAdmin) {
        // DELETE
        li.querySelector('.btn-delete').addEventListener('click', () => {
            confirmDelete(async () => {
                await deleteDoc(doc(db, 'products', docId))
                li.remove()
            })
        })

        // EDIT
        li.querySelector('.btn-edit').addEventListener('click', () => {
            openEditModal(docId, product)
        })
    }

    return li
}

// edit modal
const openEditModal = (docId, product) => {
    // remove existing modal if any
    document.getElementById('edit-modal')?.remove()

    const modal = document.createElement('div')
    modal.id = 'edit-modal'
    modal.className = 'edit-modal'
    modal.innerHTML = `
        <div class="edit-modal__card">
            <h2>Edit Product</h2>
            <div class="form-group">
                <label>Name</label>
                <input id="edit-name" type="text" value="${sanitize(product.name)}" />
            </div>
            <div class="form-group">
                <label>Size</label>
                <input id="edit-size" type="text" value="${sanitize(product.size)}" />
            </div>
            <div class="form-group">
                <label>Price</label>
                <input id="edit-price" type="text" value="${sanitize(product.price || '')}" />
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="edit-desc" rows="3">${sanitize(product.description)}</textarea>
            </div>
            <div class="form-group">
                <label>Depop Link</label>
                <input id="edit-depop" type="url" value="${sanitize(product.depopLink)}" />
            </div>
            <div class="edit-modal__actions">
                <button id="edit-cancel" class="btn-cancel">Cancel</button>
                <button id="edit-save" class="btn-save">Save</button>
            </div>
            <p class="edit-feedback" id="edit-feedback"></p>
        </div>
    `

    document.body.appendChild(modal)

    // close on cancel
    document.getElementById('edit-cancel').addEventListener('click', () => modal.remove())

    // close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove()
    })

    // save
    document.getElementById('edit-save').addEventListener('click', async () => {
        const updated = {
            name:        document.getElementById('edit-name').value.trim(),
            size:        document.getElementById('edit-size').value.trim(),
            price:       document.getElementById('edit-price').value.trim(),
            description: document.getElementById('edit-desc').value.trim(),
            depopLink:   document.getElementById('edit-depop').value.trim(),
        }

        try {
            await updateDoc(doc(db, 'products', docId), updated)
            document.getElementById('edit-feedback').textContent = 'Saved!'
            document.getElementById('edit-feedback').style.color = 'var(--color-success)'

            // update card in DOM
            const card = document.querySelector(`[data-id="${docId}"]`)
            if (card) {
                card.querySelector('.product-card__name').textContent = updated.name
                card.querySelector('.product-card__size').textContent = `Size: ${updated.size}`
                card.querySelector('.product-card__price').textContent = updated.price
                card.querySelector('.product-card__desc').textContent = updated.description
                card.querySelector('.product-card__link').href = updated.depopLink
            }

            setTimeout(() => modal.remove(), 800)
        } catch (err) {
            console.error(err)
            document.getElementById('edit-feedback').textContent = 'Failed to save.'
            document.getElementById('edit-feedback').style.color = 'var(--color-error)'
        }
    })
}

// fetch products from Firestore
const fetchProducts = async () => {
    const productsGrid = document.getElementById('products-grid')

    try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <p>No items available right now.</p>
                    <p>Check back soon for our next drop. 🔥</p>
                </div>
            `
            return
        }

        productsGrid.innerHTML = ''

        snapshot.forEach((doc) => {
            const card = createProductCard(doc.id, doc.data())
            productsGrid.appendChild(card)
        })

    } catch (err) {
        console.error(err)
        productsGrid.innerHTML = '<p class="no-products">Failed to load products.</p>'
    }
}

fetchProducts()