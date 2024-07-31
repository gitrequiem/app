import { Modal, Button, Table } from 'react-bootstrap';


interface MostrarDatosTicketProps {
    show: boolean;
    handleClose: () => void;
    ticket: any | null;
}

const MostrarDatosTicket: React.FC<MostrarDatosTicketProps> = ({ show, handleClose, ticket }) => {
    if (!ticket) return null;


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Detalles del Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table bordered>
                    <tbody>
                        <tr>
                            <th>N° Identificación</th>
                            <td>{ticket.id_fk}</td>
                        </tr>
                        <tr>
                            <th>Descripción del Problema</th>
                            <td>{ticket.memo_generated}</td>
                        </tr>
                        <tr>
                            <th>Resolvió</th>
                            <td>{ticket.username_solver ? ticket.username_solver : ''}</td>
                        </tr>
                        <tr>
                            <th>Resolución</th>
                            <td>{ticket.memo_solver}</td>
                        </tr>
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MostrarDatosTicket;