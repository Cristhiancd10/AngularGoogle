import { City } from "./city_model";

export interface User {
  idUser: number;
  id_Card: string;
  username: string;
  password: string;
  role: string;
  names: string;
  phone: string;
  email: string;
  city: City;
  registration_date: string;


}
