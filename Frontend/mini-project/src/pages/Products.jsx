import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <h2>Products</h2>
      <Link to="/add-product">
        <Button variant="success" className="mb-3">Add New Product</Button>
      </Link>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.product_name}</td>
                <td>{product.price}</td>
                <td>
                  <Link to={`/edit-product/${product.id}`}>
                    <Button variant="warning" className="me-2">Edit</Button>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No products found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Products;
