import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Fetch customers from the backend API using Axios
    axios.get('http://localhost:5000/customers')
      .then(response => setCustomers(response.data))
      .catch(error => console.error("Error fetching customers:", error));
  }, []);

  const handleDelete = (id) => {
    // Delete customer from the backend API using Axios
    axios.delete(`http://localhost:5000/customers/${id}`)
      .then(() => {
        // Update the state to remove the deleted customer
        setCustomers(customers.filter(customer => customer.id !== id));
      })
      .catch(error => console.error("Error deleting customer:", error));
  };

  return (
    <Container>
      <h2>Customers</h2>
      <Link to="/add-customer">
        <Button variant="success" className="mb-3">Add New Customer</Button>
      </Link>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                <Link to={`/edit-customer/${customer.id}`}>
                  <Button variant="warning" className="me-2">Edit</Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(customer.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Customers;
