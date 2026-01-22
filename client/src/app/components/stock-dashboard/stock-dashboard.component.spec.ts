import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { PaginatorComponent } from '../paginator/paginator.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { StockBatchDetailComponent } from '../stock-batch-detail/stock-batch-detail.component';
import { StockRowComponent } from '../stock-row/stock-row.component';
import { StockSummaryCardsComponent } from '../stock-summary-cards/stock-summary-cards.component';
import { StockTableComponent } from '../stock-table/stock-table.component';
import { StockDashboardComponent } from './stock-dashboard.component';

describe('StockDashboardComponent', () => {
  let component: StockDashboardComponent;
  let fixture: ComponentFixture<StockDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        StockDashboardComponent,
        SearchBarComponent,
        StockSummaryCardsComponent,
        StockTableComponent,
        StockRowComponent,
        StockBatchDetailComponent,
        PaginatorComponent
      ]
    });
    fixture = TestBed.createComponent(StockDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
