
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error("There was an error fetching the order details!", error);
        setError('There was an error fetching the order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>No order found</div>;

  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {order.id}</p>
      <p>Customer ID: {order.customer_id}</p>
      <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
    </div>
  );
}

export default OrderDetails;
