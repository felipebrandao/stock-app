import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StockPageComponent } from './pages/stock-page/stock-page.component';
import { StockDashboardComponent } from './components/stock-dashboard/stock-dashboard.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { StockSummaryCardsComponent } from './components/stock-summary-cards/stock-summary-cards.component';
import { StockTableComponent } from './components/stock-table/stock-table.component';
import { StockRowComponent } from './components/stock-row/stock-row.component';
import { StockBatchDetailComponent } from './components/stock-batch-detail/stock-batch-detail.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { NfceQrReaderComponent } from './pages/nfce-qr-reader/nfce-qr-reader.component';
import { StockDetailComponent } from './pages/stock-detail/stock-detail.component';
import { AddStockItemComponent } from './pages/add-stock-item/add-stock-item.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { StorageLocationsComponent } from './pages/storage-locations/storage-locations.component';
import { NfceHistoryComponent } from './pages/nfce-history/nfce-history.component';
import { NfceDetailComponent } from './pages/nfce-detail/nfce-detail.component';
import { EditStockItemComponent } from './pages/edit-stock-item/edit-stock-item.component';
import { AddItemModalComponent } from './components/add-item-modal/add-item-modal.component';
import { ManageNfceItemModalComponent } from './components/manage-nfce-item-modal/manage-nfce-item-modal.component';
import { ConfirmRemovalModalComponent } from './components/confirm-removal-modal/confirm-removal-modal.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { ItemRegistrationResultModalComponent } from './components/item-registration-result-modal/item-registration-result-modal.component';
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    StockPageComponent,
    StockDashboardComponent,
    SearchBarComponent,
    StockSummaryCardsComponent,
    StockTableComponent,
    StockRowComponent,
    StockBatchDetailComponent,
    PaginatorComponent,
    NfceQrReaderComponent,
    StockDetailComponent,
    AddStockItemComponent,
    CategoriesComponent,
    StorageLocationsComponent,
    NfceHistoryComponent,
    NfceDetailComponent,
    EditStockItemComponent,
    AddItemModalComponent,
    ManageNfceItemModalComponent,
    ConfirmRemovalModalComponent,
    AppHeaderComponent,
    ItemRegistrationResultModalComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ZXingScannerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
