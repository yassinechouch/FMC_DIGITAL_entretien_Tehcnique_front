export interface Client {
  id: number;
  nom: string;
  prenomOuRaisonSociale: string;
  email: string;
  telephone: string;
  adresses: string[];
  dateCreation: string;
}

export interface ClientCreate {
  nom: string;
  prenomOuRaisonSociale: string;
  email: string;
  telephone: string;
  adresses: string[];
}

export type ClientUpdate = ClientCreate;