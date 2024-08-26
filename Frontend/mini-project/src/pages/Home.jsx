import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

const Home = () => {
  return (
    <Container>
      <h1>Welcome to the E-Commerce Web App</h1>
      <div className="mt-4">
        <Link to="/customers">
          <Button variant="primary" className="me-2">View Customers</Button>
        </Link>
        <Link to="/products">
          <Button variant="primary" className="me-2">View Products</Button>
        </Link>
        <Link to="/orders">
          <Button variant="primary">View Orders</Button>
        </Link>
      </div>
    </Container>
  );
};

export default Home;
