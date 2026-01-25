import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ProductResponse,
  PageResponse,
  CreateProductRequest
} from '../models/stock.models';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  /**
   * Lista todos os produtos com paginação
   * @param page Número da página (0-based)
   * @param size Tamanho da página
   */
  getProducts(page: number = 0, size: number = 20): Observable<PageResponse<ProductResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<ProductResponse>>(this.baseUrl, { params });
  }

  /**
   * Busca um produto por ID
   * @param id UUID do produto
   */
  getProduct(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria um novo produto
   * @param request Dados do produto a ser criado
   */
  createProduct(request: CreateProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.baseUrl, request);
  }

  /**
   * Deleta um produto
   * @param id UUID do produto
   */
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
