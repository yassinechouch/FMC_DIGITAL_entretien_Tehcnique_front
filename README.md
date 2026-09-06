`markdown
# Mini Projet de Gestion Commerciale — Frontend

Application web de gestion commerciale réalisée avec Angular dans le cadre d'un test technique.

## Technologies

- Angular
- TypeScript
- SCSS
- Angular Router
- Angular HttpClient
- Reactive Forms

## Fonctionnalités

### Clients

- Liste des clients
- Ajout
- Modification
- Suppression
- Consultation des informations

### Produits

- Liste des produits
- Ajout
- Modification
- Suppression
- Consultation des informations

### Commandes

- Liste des commandes
- Création d'une commande
- Modification d'une commande
- Consultation du détail
- Ajout de plusieurs produits
- Gestion des quantités
- Calcul automatique du total HT
- Calcul automatique de la TVA à 19%
- Calcul automatique du total TTC
- Validation de la commande
- Mise à jour du stock après validation

## Structure

Le projet est organisé par fonctionnalités :

- `core/` : modèles et services
- `features/clients/` : gestion des clients
- `features/products/` : gestion des produits
- `features/orders/` : gestion des commandes
- `shared/` : composants partagés
- `layout/` : structure principale de l'application

## Prérequis

- Node.js
- npm
- Angular CLI

## Installation

Cloner le repository puis installer les dépendances :

```bash
npm install