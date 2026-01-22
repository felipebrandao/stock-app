import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSummaryCardsComponent } from './stock-summary-cards.component';

describe('StockSummaryCardsComponent', () => {
  let component: StockSummaryCardsComponent;
  let fixture: ComponentFixture<StockSummaryCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockSummaryCardsComponent]
    });
    fixture = TestBed.createComponent(StockSummaryCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
