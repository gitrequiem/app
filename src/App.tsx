import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './components/Pages/Inicio/Inicio';
import Login from './components/Pages/Login/Login';
import MisDatos from './components/Pages/MisDatos/MisDatos';
import Pacientes from './components/Pages/Pacientes/Pacientes';
import Cirugias from './components/Pages/Cirugias/Cirugias';
import ProtectedRoute from './components/Pages/ProtectedRoute';
import Tickets from './components/Pages/Tickets/Tickets';
import NuevaCirugia from './components/Pages/Cirugias/NuevaCirugia';
import CirugiaDiagnostico from './components/Pages/Cirugias/CirugiaDiagnostico';
import CirugiaIntervencion from './components/Pages/Cirugias/CirugiaIntervenciones';
import CirugiaStaff from './components/Pages/Cirugias/CirugiaStaff';

const App: React.FC = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/cirugias" element={<Cirugias />} />
            <Route path="/misdatos" element={<MisDatos />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/nuevacirugia" element={<NuevaCirugia />} />
            <Route path="/cirugiadiagnostico" element={<CirugiaDiagnostico  />} />
            <Route path="/cirugiaintervenciones" element={<CirugiaIntervencion />} />
            <Route path="/cirugiastaff" element={<CirugiaStaff  />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
};

export default App;