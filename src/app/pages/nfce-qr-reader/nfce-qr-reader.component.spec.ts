import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NfceQrReaderComponent } from './nfce-qr-reader.component';

describe('NfceQrReaderComponent', () => {
  let component: NfceQrReaderComponent;
  let fixture: ComponentFixture<NfceQrReaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NfceQrReaderComponent]
    });
    fixture = TestBed.createComponent(NfceQrReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
