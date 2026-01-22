import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockRowComponent } from './stock-row.component';

describe('StockRowComponent', () => {
  let component: StockRowComponent;
  let fixture: ComponentFixture<StockRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockRowComponent]
    });
    fixture = TestBed.createComponent(StockRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
