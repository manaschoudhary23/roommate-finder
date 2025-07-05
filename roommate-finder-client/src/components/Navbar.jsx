import { Offcanvas, Navbar, Nav, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

export default function BootstrapNavbar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar bg="primary" variant="dark" className="px-3">
        <Button variant="light" onClick={handleShow} className="me-2">
          ☰
        </Button>
        <Navbar.Brand>Room Finder</Navbar.Brand>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Link to="/" className="nav-link" onClick={handleClose}>Home</Link>
            <Link to="/login" className="nav-link" onClick={handleClose}>Login</Link>
            <Link to="/register" className="nav-link" onClick={handleClose}>Register</Link>
            <Link to="/profile" className="nav-link" onClick={handleClose}>Profile</Link>
            <Link to="/compatibility" className="nav-link" onClick={handleClose}>CompatibilityForm </Link>
            <Link to="/messages/inbox" className="nav-link" onClick={handleClose}>Inbox</Link>
            <Link to="/agreement" className='nav-link' onClick={handleClose}>Agreement Form</Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
