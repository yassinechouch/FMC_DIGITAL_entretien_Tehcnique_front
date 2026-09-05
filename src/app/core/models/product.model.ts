export interface Product {
  id: number;
  reference: string;
  nomProduit: string;
  description: string;
  prixUnitaireHT: number;
  quantiteStock: number;
  dateCreation: string;
}

export interface ProductCreate {
  reference: string;
  nomProduit: string;
  description: string;
  prixUnitaireHT: number;
  quantiteStock: number;
}

export type ProductUpdate = ProductCreate;