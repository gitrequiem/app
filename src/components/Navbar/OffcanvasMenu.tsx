import React from 'react';
import { Nav, Button, Offcanvas, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Clock from './Clock';
import logo from './background.png';
import requiem from './logo.png';
import './OffcanvasMenu.css';
import axiosInstance from '../Pages/axiosConfig';

interface OffcanvasMenuProps {
    show: boolean;
    handleClose: () => void;
    handleShow: () => void;
    pageTitle: string;
    children?: React.ReactNode; // Esto permite que actúe como layout
}

export const OffcanvasMenu: React.FC<OffcanvasMenuProps> = ({ show, handleClose, handleShow, pageTitle, children }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axiosInstance.post('/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                localStorage.removeItem('token'); // Eliminar el token
                navigate('/login'); // Redirige a la página de inicio de sesión
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="navbar-container">
            <img src={logo} alt="Background" className="bg-image" />
            <Navbar bg="dark" variant="dark" fixed="top">
                <div className="container-fluid">
                    <Navbar.Brand href="#" className="d-flex align-items-center">
                        <img src={requiem} alt="Logo" className="logo-image me-2" />
                        <h1 className="display-4">{pageTitle}</h1>
                    </Navbar.Brand>
                    <div className="ms-auto d-flex align-items-center">
                        <Clock />
                        <Button className="btn btn-dark btn-outline-secondary ms-3" onClick={handleShow} aria-controls="offcanvasDarkNavbar">
                            <span className="navbar-toggler-icon"></span>
                        </Button>
                    </div>
                </div>
            </Navbar>

            <Offcanvas show={show} onHide={handleClose} placement="end" className="bg-dark text-white">
                <Offcanvas.Header closeButton className="btn btn-secondary">
                    <Offcanvas.Title id="offcanvasDarkNavbarLabel"><h1 className="display-2">Menú</h1></Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Nav.Link as={Link} to="/inicio" className="nav-link-large">Inicio</Nav.Link>
                        <br />
                        <Nav.Link as={Link} to="/misdatos" className="nav-link-large">Cambiar contraseña</Nav.Link>
                        <br />
                        <Nav.Link as={Link} to="/cirugias" className="nav-link-large">Cirugías</Nav.Link>
                        <br />
                        <Nav.Link as={Link} to="/pacientes" className="nav-link-large">Pacientes</Nav.Link>
                        <br />
                        <Nav.Link as={Link} to="/tickets" className="nav-link-large">Tickets</Nav.Link>
                    </Nav>
                    <br /><br /><br /><br /><br /><br /><br /><br />
                    <div className="d-grid gap-2 col-6">
                        <Button variant="secondary" size="lg" onClick={handleLogout}>
                            Cerrar sesión
                        </Button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
            {children}
        </div>
    );
};

export default OffcanvasMenu;