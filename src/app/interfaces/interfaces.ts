export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role?: string;
  image?: string;
  estado?: number;
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
  idPublicacion: string;
  idUsuario: string;
  idPlanta: string;
  idZona: string;
  descripcion: string;
  latLng: string;
  estado: number;
  planta: Plant;
  usuario: User;
  zona: Zone;
}

export interface GoogleLogin {
  accessToken: string;
  displayName: string;
  email: string;
  expires: number;
  expires_in: number;
  familyName: string;
  givenName: string;
  imageUrl: string;
  userId: string;
}

export interface FacebookProfileResponse {
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  name: string;
  picture: FacebookPicture;
}

export interface FacebookPicture {
  data: PictureData;
}

export interface PictureData {
  height: number;
  is_silhouette: boolean;
  url: string;
  width: number;
}