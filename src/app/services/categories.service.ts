import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CategoryResponse,
  PageResponse,
  CreateCategoryRequest
} from '../models/stock.models';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  /**
   * Lista todas as categorias com paginação
   * @param page Número da página (0-based)
   * @param size Tamanho da página
   */
  getCategories(page: number = 0, size: number = 100): Observable<PageResponse<CategoryResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<CategoryResponse>>(this.baseUrl, { params });
  }

  /**
   * Busca uma categoria por ID
   * @param id UUID da categoria
   */
  getCategory(id: string): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria uma nova categoria
   * @param request Dados da categoria a ser criada
   */
  createCategory(request: CreateCategoryRequest): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.baseUrl, request);
  }

  /**
   * Deleta uma categoria
   * @param id UUID da categoria
   */
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
