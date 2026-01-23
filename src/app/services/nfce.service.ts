import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { NFCeQRCodeData, NFCeData, NFCeItem } from '../models/nfce.models';

@Injectable({
  providedIn: 'root'
})
export class NfceService {

  constructor() { }

  parseQRCode(qrCodeData: string): NFCeQRCodeData | null {
    try {
      const url = new URL(qrCodeData);
      const chaveAcesso = url.searchParams.get('chNFe') || this.extractChaveFromURL(qrCodeData);

      if (!chaveAcesso || chaveAcesso.length !== 44) {
        return null;
      }

      return {
        chaveAcesso: chaveAcesso,
        url: qrCodeData
      };
    } catch (error) {
      const chaveMatch = qrCodeData.match(/\d{44}/);
      if (chaveMatch) {
        return {
          chaveAcesso: chaveMatch[0],
          url: qrCodeData
        };
      }
      return null;
    }
  }

  private extractChaveFromURL(url: string): string {
    const match = url.match(/\d{44}/);
    return match ? match[0] : '';
  }

  fetchNFCeData(chaveAcesso: string): Observable<NFCeData> {
    return of(this.getMockNFCeData(chaveAcesso)).pipe(delay(2000));
  }

  importToStock(nfceData: NFCeData): Observable<boolean> {
    console.log('Importing NFC-e to stock:', nfceData);
    return of(true).pipe(delay(1500));
  }

  private getMockNFCeData(chaveAcesso: string): NFCeData {
    return {
      chaveAcesso: chaveAcesso,
      numeroNota: '000123',
      serie: '001',
      dataEmissao: new Date(),
      cnpjEmissor: '12.345.678/0001-90',
      nomeEmissor: 'Fornecedor Exemplo LTDA',
      valorTotal: 1234.56,
      itens: [
        {
          codigo: 'PROD001',
          descricao: 'Farinha de Trigo 1kg',
          quantidade: 10,
          unidade: 'KG',
          valorUnitario: 5.50,
          valorTotal: 55.00
        },
        {
          codigo: 'PROD002',
          descricao: 'Açúcar Cristal 1kg',
          quantidade: 15,
          unidade: 'KG',
          valorUnitario: 3.20,
          valorTotal: 48.00
        },
        {
          codigo: 'PROD003',
          descricao: 'Óleo de Soja 900ml',
          quantidade: 20,
          unidade: 'UN',
          valorUnitario: 8.90,
          valorTotal: 178.00
        },
        {
          codigo: 'PROD004',
          descricao: 'Arroz Tipo 1 5kg',
          quantidade: 8,
          unidade: 'PCT',
          valorUnitario: 28.50,
          valorTotal: 228.00
        },
        {
          codigo: 'PROD005',
          descricao: 'Feijão Carioca 1kg',
          quantidade: 12,
          unidade: 'KG',
          valorUnitario: 7.80,
          valorTotal: 93.60
        }
      ]
    };
  }

  validateChaveAcesso(chave: string): boolean {
    return /^\d{44}$/.test(chave);
  }
}
