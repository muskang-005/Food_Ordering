import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import './ManageProduct.css';

const ManageProduct = () => {
    const [products, setProducts] = useState([]);
    const [productData, setProductData] = useState({
        dish: '',
        imgdata: '',
        address: '',
        somedata: '',
        price: '',
        rating: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleAddOrEditProduct = async () => {
        if (editMode) {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${editProductId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                });
                if (response.ok) {
                    toast.success('Product updated successfully');
                    fetchProducts();
                }
            } catch (error) {
                console.error('Error updating product:', error);
                toast.error('Failed to update product');
            }
            setEditMode(false);
            setEditProductId(null);
        } else {
            try {
                const response = await fetch('http://localhost:5000/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                });
                if (response.ok) {
                    const newProduct = await response.json();
                    setProducts([...products, newProduct]);
                    toast.success('Product added successfully');
                }
            } catch (error) {
                console.error('Error adding product:', error);
                toast.error('Failed to add product');
            }
        }
        setProductData({
            dish: '',
            imgdata: '',
            address: '',
            somedata: '',
            price: '',
            rating: ''
        });
    };

    const handleEditClick = (product) => {
        setProductData(product);
        setEditProductId(product.id);
        setEditMode(true);
    };

    const handleDeleteClick = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setProducts(products.filter((product) => product.id !== productId));
                toast.success('Product deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    return (
        <div className="manage-product-container">
            <h2>Manage Products</h2>
            <div className="form-container">
                <input
                    type="text"
                    name="dish"
                    placeholder="Dish Name"
                    value={productData.dish}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="imgdata"
                    placeholder="Image URL"
                    value={productData.imgdata}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={productData.address}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="somedata"
                    placeholder="Additional Info"
                    value={productData.somedata}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={productData.price}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="rating"
                    placeholder="Rating"
                    value={productData.rating}
                    onChange={handleInputChange}
                />
                <button onClick={handleAddOrEditProduct}>
                    {editMode ? 'Update Product' : 'Add Product'}
                </button>
            </div>
            <div className="product-list">
                {products.map((product) => (
                    <div key={product.id} className="product-item">
                        <h3>{product.dish}</h3>
                        <p>Price: {product.price}</p>
                        <p>Rating: {product.rating}</p>
                        <button onClick={() => handleEditClick(product)}>Edit</button>
                        <button onClick={() => handleDeleteClick(product.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageProduct;
