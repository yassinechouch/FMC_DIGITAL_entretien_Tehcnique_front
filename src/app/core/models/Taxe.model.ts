export enum etatTaxe {
  active = 0,
  inactive = 1,
 
}
export interface Taxe{
id:number;
libelle:string;
type:string;
valeur:number
etat : etatTaxe |string;
}
export interface TaxeCreate {
  libelle: string;
  type: string;
  valeur: number;
  
 
}
export type TaxeUpdate = TaxeCreate;