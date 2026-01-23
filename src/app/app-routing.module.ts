import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockPageComponent } from './pages/stock-page/stock-page.component';
import { NfceQrReaderComponent } from './pages/nfce-qr-reader/nfce-qr-reader.component';

const routes: Routes = [
  { path: '', redirectTo: '/stock', pathMatch: 'full' },
  { path: 'stock', component: StockPageComponent },
  { path: 'nfce-reader', component: NfceQrReaderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
