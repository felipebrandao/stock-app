import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  StockMovementResponse,
  PageResponse,
  CreateStockMovementRequest
} from '../models/stock.models';

@Injectable({
  providedIn: 'root'
})
export class StockMovementsService {
  private readonly baseUrl = `${environment.apiUrl}/stock-movements`;

  constructor(private http: HttpClient) {}

  /**
   * Lista movimentações de estoque com filtros e paginação
   * @param productId UUID do produto (opcional)
   * @param locationId UUID da localização (opcional)
   * @param page Número da página (0-based)
   * @param size Tamanho da página
   */
  getStockMovements(
    productId?: string,
    locationId?: string,
    page: number = 0,
    size: number = 20
  ): Observable<PageResponse<StockMovementResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (productId) params = params.set('productId', productId);
    if (locationId) params = params.set('locationId', locationId);

    return this.http.get<PageResponse<StockMovementResponse>>(this.baseUrl, { params });
  }

  /**
   * Cria uma nova movimentação de estoque
   * @param request Dados da movimentação
   */
  createStockMovement(request: CreateStockMovementRequest): Observable<StockMovementResponse> {
    return this.http.post<StockMovementResponse>(this.baseUrl, request);
  }
}
