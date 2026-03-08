// src/Dashboard.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, storage } from './firebase'
import { collection, addDoc } from 'firebase/firestore'
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
    const navigate = useNavigate()

    // redirect to login if not authenticated
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) navigate('/')
        })
        return () => unsubscribe()
    }, [])

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
            // 1. upload image to Firebase Storage
            const imageRef = ref(storage, `products/${Date.now()}-${image.name}`)
            await uploadBytes(imageRef, image)
            const imageUrl = await getDownloadURL(imageRef)

            // 2. save product data to Firestore
            await addDoc(collection(db, 'products'), {
                name,
                size,
                price,
                description,
                depopLink,
                imageUrl,
                createdAt: new Date()
            })

            setSuccess('Product added successfully!')

            // reset form
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

    return (
        <div className="dashboard">
            <main className="dashboard-main">

                <div className="dashboard-header">
                    <h1>Add Product</h1>
                    <p>Fill in the details below to add a new product</p>
                </div>

                <form className="dashboard-form" onSubmit={handleSubmit}>

                    {/* IMAGE UPLOAD */}
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

                    {/* PRODUCT NAME */}
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

                    {/* SIZE */}
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

                    {/* PRICE */}
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

                    {/* DESCRIPTION */}
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

                    {/* DEPOP LINK */}
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
            </main>
        </div>
    )
}

export default Dashboard