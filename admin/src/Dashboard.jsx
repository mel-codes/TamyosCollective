// src/Dashboard.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, storage } from './firebase'
import { collection, addDoc, getDocs, orderBy, query, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import './Dashboard.css'

function Dashboard() {
    const [name, setName]           = useState('')
    const [size, setSize]           = useState('')
    const [description, setDesc]    = useState('')
    const [depopLink, setDepopLink] = useState('')
    const [price, setPrice]         = useState('')
    const [image, setImage]         = useState(null)
    const [preview, setPreview]     = useState(null)
    const [loading, setLoading]     = useState(false)
    const [success, setSuccess]     = useState('')
    const [error, setError]         = useState('')
    const [products, setProducts]   = useState([])
    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData]   = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) navigate('/')
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
            const snapshot = await getDocs(q)
            const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
            setProducts(items)
        } catch (err) {
            console.error(err)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!image) {
            setError('Please select an image.')
            return
        }

        setLoading(true)

        try {
            const imageRef = ref(storage, `products/${Date.now()}-${image.name}`)
            await uploadBytes(imageRef, image)
            const imageUrl = await getDownloadURL(imageRef)

            const docRef = await addDoc(collection(db, 'products'), {
                name,
                size,
                price,
                description,
                depopLink,
                imageUrl,
                createdAt: new Date()
            })

            setSuccess('Product added successfully!')
            setProducts(prev => [{
                id: docRef.id, name, size, price, description, depopLink, imageUrl
            }, ...prev])

            setName('')
            setSize('')
            setPrice('')
            setDesc('')
            setDepopLink('')
            setImage(null)
            setPreview(null)

        } catch (err) {
            console.error(err)
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return
        try {
            await deleteDoc(doc(db, 'products', id))
            setProducts(prev => prev.filter(p => p.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    const handleEditSave = async (id) => {
        try {
            await updateDoc(doc(db, 'products', id), editData)
            setProducts(prev => prev.map(p => p.id === id ? { ...p, ...editData } : p))
            setEditingId(null)
            setEditData({})
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="dashboard">
            <main className="dashboard-main">

                <div className="dashboard-header">
                    <h1>Add Product</h1>
                    <p>Fill in the details below to add a new product</p>
                </div>

                <form className="dashboard-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="product-image">Product Image</label>
                        <div className="image-upload">
                            {preview ? (
                                <img src={preview} alt="Product preview" className="image-preview" />
                            ) : (
                                <div className="image-placeholder">
                                    <i className="fa-regular fa-image"></i>
                                    <p>Click to upload image</p>
                                </div>
                            )}
                            <input
                                type="file"
                                id="product-image"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="product-name">Product Name</label>
                        <input
                            type="text"
                            id="product-name"
                            placeholder="e.g. Vintage Levi's Jacket"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="product-size">Size</label>
                        <input
                            type="text"
                            id="product-size"
                            placeholder="e.g. M, L, 32x30"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="product-price">Price</label>
                        <input
                            type="text"
                            id="product-price"
                            placeholder="e.g. $45"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="product-desc">Description</label>
                        <textarea
                            id="product-desc"
                            placeholder="Describe the product..."
                            rows="4"
                            value={description}
                            onChange={(e) => setDesc(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="depop-link">Depop Link</label>
                        <input
                            type="url"
                            id="depop-link"
                            placeholder="https://depop.com/..."
                            value={depopLink}
                            onChange={(e) => setDepopLink(e.target.value)}
                            required
                        />
                    </div>

                    {success && <p className="dashboard-success">{success}</p>}
                    {error && <p className="dashboard-error">{error}</p>}

                    <button type="submit" className="dashboard-btn" disabled={loading}>
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </button>

                </form>

                {/* PRODUCT LIST */}
                {products.length > 0 && (
                    <div className="product-list">
                        <h2 className="product-list__heading">Products ({products.length})</h2>
                        {products.map(p => (
                            <div className="product-list__item" key={p.id}>
                                <img src={p.imageUrl} alt={p.name} className="product-list__img" />
                                {editingId === p.id ? (
                                    <div className="product-list__edit">
                                        <input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} placeholder="Name" />
                                        <input value={editData.size} onChange={e => setEditData({...editData, size: e.target.value})} placeholder="Size" />
                                        <input value={editData.price} onChange={e => setEditData({...editData, price: e.target.value})} placeholder="Price" />
                                        <textarea value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} placeholder="Description" rows="2" />
                                        <input value={editData.depopLink} onChange={e => setEditData({...editData, depopLink: e.target.value})} placeholder="Depop Link" />
                                        <div className="product-list__actions">
                                            <button className="btn-save" onClick={() => handleEditSave(p.id)}>Save</button>
                                            <button className="btn-cancel" onClick={() => { setEditingId(null); setEditData({}) }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="product-list__info">
                                        <p className="product-list__name">{p.name}</p>
                                        <p className="product-list__meta">{p.size} · {p.price}</p>
                                        <div className="product-list__actions">
                                            <button className="btn-edit" onClick={() => { setEditingId(p.id); setEditData({ name: p.name, size: p.size, price: p.price, description: p.description, depopLink: p.depopLink }) }}>Edit</button>
                                            <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

            </main>
        </div>
    )
}

export default Dashboard