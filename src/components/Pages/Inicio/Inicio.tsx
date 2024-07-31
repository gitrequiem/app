import React, { useState } from 'react';
import { OffcanvasMenu } from '../../Navbar/OffcanvasMenu';
import './Inicio.css';


const Inicio: React.FC = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="navbar-container">
      
      <div className="title-container1">
          
          <h1 className="display-1">ReQuiEM</h1>
          <h1 className="display-6">2024</h1>
          </div>
          <OffcanvasMenu show={show} handleClose={handleClose} handleShow={handleShow} pageTitle="Inicio"/>
          
    </div> 
  );
};
export default Inicio;



