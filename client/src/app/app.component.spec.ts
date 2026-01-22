import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { StockBatchDetailComponent } from './components/stock-batch-detail/stock-batch-detail.component';
import { StockDashboardComponent } from './components/stock-dashboard/stock-dashboard.component';
import { StockRowComponent } from './components/stock-row/stock-row.component';
import { StockSummaryCardsComponent } from './components/stock-summary-cards/stock-summary-cards.component';
import { StockTableComponent } from './components/stock-table/stock-table.component';
import { StockPageComponent } from './pages/stock-page/stock-page.component';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [FormsModule],
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
      ]
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'client'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('client');
  });

  it('should render stock page', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-stock-page')).toBeTruthy();
  });
});
