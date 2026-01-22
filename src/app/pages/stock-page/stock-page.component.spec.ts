import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { StockBatchDetailComponent } from '../../components/stock-batch-detail/stock-batch-detail.component';
import { StockDashboardComponent } from '../../components/stock-dashboard/stock-dashboard.component';
import { StockRowComponent } from '../../components/stock-row/stock-row.component';
import { StockSummaryCardsComponent } from '../../components/stock-summary-cards/stock-summary-cards.component';
import { StockTableComponent } from '../../components/stock-table/stock-table.component';
import { StockPageComponent } from './stock-page.component';

describe('StockPageComponent', () => {
  let component: StockPageComponent;
  let fixture: ComponentFixture<StockPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        StockPageComponent,
        StockDashboardComponent,
        SearchBarComponent,
        StockSummaryCardsComponent,
        StockTableComponent,
        StockRowComponent,
        StockBatchDetailComponent,
        PaginatorComponent
      ]
    });
    fixture = TestBed.createComponent(StockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
