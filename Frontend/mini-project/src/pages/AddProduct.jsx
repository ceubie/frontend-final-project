import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/products', { product_name: productName, price })
      .then(response => {
        console.log("Product added:", response.data);
        // Redirect to Products page or reset form
      })
      .catch(error => {
        console.error("There was an error adding the product!", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Product</h2>
      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Product Name"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        required
      />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;
