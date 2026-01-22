import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBatchDetailComponent } from './stock-batch-detail.component';

describe('StockBatchDetailComponent', () => {
  let component: StockBatchDetailComponent;
  let fixture: ComponentFixture<StockBatchDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockBatchDetailComponent]
    });
    fixture = TestBed.createComponent(StockBatchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
