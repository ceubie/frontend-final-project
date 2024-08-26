
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="text-center mt-5">
      <h1>404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">
        <Button variant="primary">Go to Home</Button>
      </Link>
    </Container>
  );
};

export default NotFound;
