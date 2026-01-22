import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { StockPageComponent } from './pages/stock-page/stock-page.component';
import { StockDashboardComponent } from './components/stock-dashboard/stock-dashboard.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { StockSummaryCardsComponent } from './components/stock-summary-cards/stock-summary-cards.component';
import { StockTableComponent } from './components/stock-table/stock-table.component';
import { StockRowComponent } from './components/stock-row/stock-row.component';
import { StockBatchDetailComponent } from './components/stock-batch-detail/stock-batch-detail.component';
import { PaginatorComponent } from './components/paginator/paginator.component';

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
    PaginatorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
