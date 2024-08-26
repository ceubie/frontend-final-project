import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('There was an error fetching orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <h2>Orders</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  <Link to={`/orders/${order.id}`}>
                    <Button variant="info">View Details</Button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No orders found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Orders;
