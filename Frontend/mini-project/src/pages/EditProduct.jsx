import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/products/${id}`)
      .then(response => {
        setName(response.data.product_name);
        setPrice(response.data.price);
      })
      .catch(error => {
        console.error("There was an error fetching the product details!", error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/products/${id}`, { product_name: name, price })
      .then(response => {
        console.log("Product updated:", response.data);
        navigate('/products'); // Redirect to products page after successful update
      })
      .catch(error => {
        console.error("There was an error updating the product!", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Product</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
      <button type="submit">Update Product</button>
    </form>
  );
};

export default EditProduct;
