import { TestBed } from '@angular/core/testing';
import { NfceService } from './nfce.service';

describe('NfceService', () => {
  let service: NfceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NfceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse valid QR Code with URL', () => {
    const qrCode = 'http://www.fazenda.sp.gov.br/nfce/qrcode?chNFe=12345678901234567890123456789012345678901234';
    const result = service.parseQRCode(qrCode);
    expect(result).toBeTruthy();
    expect(result?.chaveAcesso.length).toBe(44);
  });

  it('should validate correct access key', () => {
    const chave = '12345678901234567890123456789012345678901234';
    expect(service.validateChaveAcesso(chave)).toBe(true);
  });

  it('should reject invalid access key', () => {
    const chave = '123456';
    expect(service.validateChaveAcesso(chave)).toBe(false);
  });
});
