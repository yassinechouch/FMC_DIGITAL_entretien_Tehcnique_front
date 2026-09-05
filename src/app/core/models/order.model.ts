export enum OrderStatus {
  Brouillon = 0,
  Validee = 1,
  Annulee = 2
}

export interface OrderLineCreate {
  productId: number;
  quantite: number;
}

export interface OrderLine {
  id: number;
  productId: number;
  nomProduit: string;
  quantite: number;
  prixUnitaire: number;
  totalLigne: number;
}

export interface Order {
  id: number;
  numeroCommande: string;
  clientId: number;
  nomClient: string;
  dateCommande: string;

  // ASP.NET peut retourner 0/1/2.
  statut: OrderStatus | string;

  totalHT: number;
  totalTTC: number;
  lignes: OrderLine[];
}

export interface OrderCreate {
  numeroCommande: string;
  clientId: number;
  lignes: OrderLineCreate[];
}

export type OrderUpdate = OrderCreate;