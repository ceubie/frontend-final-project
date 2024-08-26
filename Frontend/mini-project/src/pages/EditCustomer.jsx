import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    // Fetch customer data from the API
    axios.get(`http://localhost:5000/customers/${id}`)
      .then(response => {
        setName(response.data.customer_name);
        setEmail(response.data.email);
        setPhone(response.data.phone);
      })
      .catch(error => {
        console.error("There was an error fetching the customer data!", error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update customer data through the API
    axios.put(`http://localhost:5000/customers/${id}`, { customer_name: name, email, phone })
      .then(response => {
        console.log("Customer updated:", response.data);
        // Navigate back to the customers page after update
        navigate('/customers');
      })
      .catch(error => {
        console.error("There was an error updating the customer!", error);
      });
  };

  return (
    <Container>
      <h2>Edit Customer</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </Form.Group>
        <Form.Group controlId="formPhone">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update Customer
        </Button>
      </Form>
    </Container>
  );
};

export default EditCustomer;
