export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    image: string;
    estado: number;
}

export interface Role {
    idRole: string;
    nombre: string;
    flag: string;
    estado: number;
}

export interface Plant {
    idPlanta: string;
    nombre: string;
    descripcion: string;
    imagen: string;
    estado: number;
}

export interface Zone {
    idZona: string;
    nombre: string;
    estado: number;
}

export interface Publications {
    idPlublicacion: string;
    idUsuario: string;
    idPlanta: string;
    idZona: string;
    descripcion: string;
    latLng: string;
    estado: number;
}