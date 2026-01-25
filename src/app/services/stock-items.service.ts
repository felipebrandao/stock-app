import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  StockItemResponse,
  PageResponse,
  TransferStockItemRequest,
  OpenStockItemRequest,
  ConvertStockItemRequest,
  ConsumeStockItemRequest,
  StockItemState
} from '../models/stock.models';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private readonly baseUrl = `${environment.apiUrl}/stock-items`;

  constructor(private http: HttpClient) {}

  /**
   * Lista itens de estoque com filtros e paginação
   * @param productId UUID do produto (opcional)
   * @param locationId UUID da localização (opcional)
   * @param state Estado do item (opcional)
   * @param page Número da página (0-based)
   * @param size Tamanho da página
   */
  getStockItems(
    productId?: string,
    locationId?: string,
    state?: StockItemState,
    page: number = 0,
    size: number = 20
  ): Observable<PageResponse<StockItemResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (productId) params = params.set('productId', productId);
    if (locationId) params = params.set('locationId', locationId);
    if (state) params = params.set('state', state);

    return this.http.get<PageResponse<StockItemResponse>>(this.baseUrl, { params });
  }

  /**
   * Busca um item de estoque por ID
   * @param id UUID do item
   */
  getStockItem(id: string): Observable<StockItemResponse> {
    return this.http.get<StockItemResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Transfere um item de estoque para outra localização
   * @param id UUID do item
   * @param request Dados da transferência
   */
  transferStockItem(id: string, request: TransferStockItemRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/transfer`, request);
  }

  /**
   * Abre um item de estoque lacrado
   * @param id UUID do item
   * @param request Dados da abertura
   */
  openStockItem(id: string, request: OpenStockItemRequest): Observable<StockItemResponse> {
    return this.http.post<StockItemResponse>(`${this.baseUrl}/${id}/open`, request);
  }

  /**
   * Converte um item de estoque em múltiplos itens
   * @param id UUID do item
   * @param request Quantidades de destino
   */
  convertStockItem(id: string, request: ConvertStockItemRequest): Observable<string[]> {
    return this.http.post<string[]>(`${this.baseUrl}/${id}/convert`, request);
  }

  /**
   * Consome um item de estoque
   * @param id UUID do item
   * @param request Quantidade a consumir
   */
  consumeStockItem(id: string, request: ConsumeStockItemRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/consume`, request);
  }
}
