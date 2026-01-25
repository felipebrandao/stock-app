import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockPageComponent } from './pages/stock-page/stock-page.component';
import { NfceQrReaderComponent } from './pages/nfce-qr-reader/nfce-qr-reader.component';
import { StockDetailComponent } from './pages/stock-detail/stock-detail.component';
import { AddStockItemComponent } from './pages/add-stock-item/add-stock-item.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { StorageLocationsComponent } from './pages/storage-locations/storage-locations.component';
import { NfceHistoryComponent } from './pages/nfce-history/nfce-history.component';
import { NfceDetailComponent } from './pages/nfce-detail/nfce-detail.component';
import { EditStockItemComponent } from './pages/edit-stock-item/edit-stock-item.component';

const routes: Routes = [
  { path: '', redirectTo: '/stock', pathMatch: 'full' },
  { path: 'stock', component: StockPageComponent },
  { path: 'stock/:id', component: StockDetailComponent },
  { path: 'stock/:id/add', component: AddStockItemComponent },
  { path: 'stock/:id/edit', component: EditStockItemComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'storage-locations', component: StorageLocationsComponent },
  { path: 'nfce-reader', component: NfceQrReaderComponent },
  { path: 'nfce-history', component: NfceHistoryComponent },
  { path: 'nfce/:id', component: NfceDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
