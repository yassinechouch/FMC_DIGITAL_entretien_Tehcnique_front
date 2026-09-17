import { Routes } from '@angular/router';

import { Layout } from './layout/layout';

import { ClientList } from './features/clients/client-list/client-list';
import { ClientForm } from './features/clients/client-form/client-form';

import { ProductList } from './features/products/product-list/product-list';
import { ProductForm } from './features/products/product-form/product-form';

import { OrderList } from './features/orders/order-list/order-list';
import { OrderForm } from './features/orders/order-form/order-form';
import { OrderDetail } from './features/orders/order-detail/order-detail';
import { TaxeList } from './features/taxes/taxe-list/taxe-list';
import { TaxeForm } from './features/taxes/taxe-form/taxe-form';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: 'clients',
        pathMatch: 'full'
      },

      {
        path: 'clients',
        component: ClientList
      },
      {
        path: 'clients/new',
        component: ClientForm
      },
      {
        path: 'clients/:id/edit',
        component: ClientForm
      },

      {
        path: 'products',
        component: ProductList
      },
      {
        path: 'products/new',
        component: ProductForm
      },
      {
        path: 'products/:id/edit',
        component: ProductForm
      },
       {
        path: 'taxes',
        component: TaxeList
      },
      {
        path: 'taxes/new',
        component: TaxeForm
      },
      {
        path: 'taxes/:id/edit',
        component: TaxeForm
      },


      {
        path: 'orders',
        component: OrderList
      },
      {
        path: 'orders/new',
        component: OrderForm
      },
      {
        path: 'orders/:id/edit',
        component: OrderForm
      },
      {
        path: 'orders/:id',
        component: OrderDetail
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'clients'
  }
];