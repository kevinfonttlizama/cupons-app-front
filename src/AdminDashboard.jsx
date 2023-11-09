import React from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí deberías implementar la lógica para cerrar la sesión del usuario.
    // Por ejemplo, eliminar el token de autenticación del almacenamiento local y actualizar el estado.
    navigate('/');
  };

  return (
    <Container fluid>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Admin Dashboard</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/admin/coupons">Manage Coupons</Nav.Link>
          <Nav.Link href="/admin/reports">Reports</Nav.Link>
          {/* Agrega más enlaces según sea necesario */}
        </Nav>
        <Button onClick={handleLogout}>Logout</Button>
      </Navbar>

      <Container>
        <h1>Welcome, Admin!</h1>
        {/* Aquí puedes renderizar componentes adicionales basados en la ruta */}
        <Outlet />
      </Container>
    </Container>
  );
};

export default AdminDashboard;
