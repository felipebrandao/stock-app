import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  NFCeQRCodeData,
  NfceResponse,
  NfceImportReviewResponse,
  ImportNfceRequest,
  UpdateNfceImportReviewRequest
} from '../models/nfce.models';

@Injectable({
  providedIn: 'root'
})
export class NfceService {
  private readonly baseUrl = `${environment.apiUrl}/nfce`;

  constructor(private http: HttpClient) { }

  // ==================== MÉTODOS DA API BACKEND ====================

  /**
   * Importa uma NFCe pela API do backend
   * @param request Dados da NFCe (QR Code URL ou chave de acesso)
   */
  importNfce(request: ImportNfceRequest): Observable<NfceResponse> {
    return this.http.post<NfceResponse>(`${this.baseUrl}/import`, request);
  }

  /**
   * Busca a revisão de uma importação de NFCe
   * @param id UUID da importação
   */
  getImportReview(id: string): Observable<NfceImportReviewResponse> {
    return this.http.get<NfceImportReviewResponse>(`${this.baseUrl}/imports/${id}/review`);
  }

  /**
   * Atualiza a revisão de uma importação de NFCe
   * @param id UUID da importação
   * @param request Dados atualizados da revisão
   */
  updateImportReview(id: string, request: UpdateNfceImportReviewRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/imports/${id}/review`, request);
  }

  /**
   * Aprova a importação de NFCe e adiciona itens ao estoque
   * @param id UUID da importação
   */
  approveImport(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/imports/${id}/approve`, {});
  }

  // ==================== MÉTODOS UTILITÁRIOS (mantidos) ====================

  /**
   * Parse do QR Code da NFCe para extrair dados
   * @param qrCodeData String do QR Code
   */
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

  /**
   * Valida se uma chave de acesso tem o formato correto (44 dígitos)
   */

  validateChaveAcesso(chave: string): boolean {
    return /^\d{44}$/.test(chave);
  }
}
