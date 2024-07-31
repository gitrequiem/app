import React, { useState, useEffect } from 'react';
import OffcanvasMenu from '../../Navbar/OffcanvasMenu';
import { Button, Col, Container, Form, Table } from 'react-bootstrap';
import NuevoTicket from './NuevoTicket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faBackwardFast, faBackwardStep, faForwardFast, faForwardStep } from '@fortawesome/free-solid-svg-icons';
import MostrarDatosTicket from './MostrarDatosTicket';
import { format } from 'date-fns';
import axiosInstance from '../axiosConfig';

interface Ticket {
    id_ticket: number;
    time_generated: string;
    id_table_fk: number;
    time_solver: string; // Cuidado con el signo ?
    username_solver: string; 
}

const ITEMS_PER_PAGE = 5;

const Tickets: React.FC = () => {
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const handleCloseOffcanvas = () => setShowOffcanvas(false);
    const handleShowOffcanvas = () => setShowOffcanvas(true);
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const [, setTickets] = useState<Ticket[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [entidades, setEntidades] = useState<{ [key: number]: string }>({});
    const [sortConfig, setSortConfig] = useState<{ key: keyof Ticket; direction: 'asc' | 'desc' } | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);

    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('userId'));

    useEffect(() => {
        if (token) {
            fetchTickets();
        }
    }, [token]);

    const fetchTickets = () => {
        if (token) {
            axiosInstance.get('/tickets/get/mistickets', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                if (response.data.status === 'success' || response.data.status === 'info') {
                    setTickets(response.data.data);
                    setFilteredTickets(response.data.data);
                } else {
                    console.error('Error fetching tickets:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching tickets:', error);
            });

            axiosInstance.get('/ticketsentidades/get/all', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                if (response.data.status === 'success' && Array.isArray(response.data.data)) {
                    const entidadesMap: { [key: number]: string } = {};
                    response.data.data.forEach((entidad: any) => {
                        entidadesMap[entidad.id_ticket_entidad] = entidad.table_fk;
                    });
                    setEntidades(entidadesMap);
                } else {
                    console.error('Error fetching entidades:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching entidades:', error);
            });
        }
    };

    const handleShowDetails = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setShowDetailsModal(true);
    };

    const handleCloseDetailsModal = () => setShowDetailsModal(false);

    const handleSort = (key: keyof Ticket) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const sortedData = [...filteredTickets].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setSortConfig({ key, direction });
        setFilteredTickets(sortedData);
    };

    const getSortIndicator = (key: keyof Ticket) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
    const currentData = filteredTickets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="navbar-container" >
            
            <Container className="d-flex align-items-center justify-content-center vh-100">
                <Col>
                    <Form className="p-3 border rounded bg-light shadow-sm" >
                        <h1 className="display-6 text-center mb-4">Consulta Tickets</h1>
                        <Button className="mb-3 text-light" variant="info" onClick={handleShowModal}>
                            Consulta
                        </Button>
                        <Table striped bordered hover >
                            <thead>
                                <tr>
                                    
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id_table_fk')}>Entidad {getSortIndicator('id_table_fk')}</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('time_generated')}>Fecha de consulta {getSortIndicator('time_generated')}</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('time_solver')}>Fecha de Resolución {getSortIndicator('time_solver')}</th>
                                    <th>Detalles</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((ticket: Ticket) => (
                                    <tr key={ticket.id_ticket}>
                                        
                                        <td>{entidades[ticket.id_table_fk]}</td>
                                        <td>{format(new Date(ticket.time_generated), 'yyyy/MM/dd HH:mm')}</td>
                                        <td>{ticket.time_solver ? format(new Date(ticket.time_solver), 'yyyy/MM/dd HH:mm') : 'N/A'}</td>
                                        <td>
                                            <Button variant="primary" onClick={() => handleShowDetails(ticket)}> <FontAwesomeIcon icon={faList} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                </Table>
            <div className="d-flex justify-content-center">
            <Button
                variant="outline-secondary"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}><FontAwesomeIcon icon={faBackwardFast} />
            </Button>
            <Button
                variant="outline-secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}><FontAwesomeIcon icon={faBackwardStep} />
            </Button>
            <span className="px-3">Página {currentPage} de {totalPages}</span>
            <Button
                variant="outline-secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}><FontAwesomeIcon icon={faForwardStep} />
            </Button>
            <Button
                variant="outline-secondary"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}><FontAwesomeIcon icon={faForwardFast} />
            </Button>
            </div>
        </Form>
        </Col>
    </Container>
            <OffcanvasMenu show={showOffcanvas} handleClose={handleCloseOffcanvas} handleShow={handleShowOffcanvas} pageTitle="Mis Tickets"/>
            <NuevoTicket show={showModal} handleClose={handleCloseModal} userId={userId} onTicketSubmit={fetchTickets} />
            <MostrarDatosTicket show={showDetailsModal} handleClose={handleCloseDetailsModal} ticket={selectedTicket} />
        </div>
    );
};

export default Tickets;