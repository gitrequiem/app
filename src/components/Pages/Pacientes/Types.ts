export interface Paciente {
    apellidos: string;
    doc_numero: number;
    id_paciente: number; // id_paciente es obligatorio para los pacientes ya existentes
    nombre: string;
    id_doc_tipo: number;
    doc_tipo: string;
    id_localidad: number;
    localidad: string;
    id_nacionalidad: number;
    nacionalidad: string;
    id_provincia: number;

  }
  
  export interface NuevoPaciente {
    apellidos: string;
    doc_numero: number;
    nombre: string;
    id_doc_tipo: number;
    doc_tipo:string;
    id_localidad: number;
    localidad: string;
    id_nacionalidad: number;
    nacionalidad: string;
    id_provincia: number;
  }
  
  export interface Provincia {
    id_provincia: number;
    provincia: string;
  }
  
  export interface Localidad {
    id_localidad: number;
    localidad: string;
    id_provincia: number;
  }
  
  export interface DocTipo {
    id_doc_tipo: number;
    doc_tipo: string;
  }
  
  export interface Nacionalidad {
    id_nacionalidad: number;
    nacionalidad: string;
  }
  
  