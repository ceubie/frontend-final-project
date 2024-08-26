import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/customers')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the customers!", error);
      });
  }, []);

  return (
    <div>
      <h1>Customer List</h1>
      <ul>
        {customers.map(customer => (
          <li key={customer.id}>
            <Link to={`/customers/${customer.id}`}>{customer.name}</Link>
          </li>
        ))}
      </ul>
      <Link to="/add-customer">
        <button>Add Customer</button>
      </Link>
    </div>
  );
}

export default CustomerList;
