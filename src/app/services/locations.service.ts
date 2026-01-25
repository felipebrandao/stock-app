import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  LocationResponse,
  PageResponse,
  CreateLocationRequest
} from '../models/stock.models';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private readonly baseUrl = `${environment.apiUrl}/locations`;

  constructor(private http: HttpClient) {}

  /**
   * Lista todas as localizações com paginação
   * @param page Número da página (0-based)
   * @param size Tamanho da página
   */
  getLocations(page: number = 0, size: number = 100): Observable<PageResponse<LocationResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<LocationResponse>>(this.baseUrl, { params });
  }

  /**
   * Busca uma localização por ID
   * @param id UUID da localização
   */
  getLocation(id: string): Observable<LocationResponse> {
    return this.http.get<LocationResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria uma nova localização
   * @param request Dados da localização a ser criada
   */
  createLocation(request: CreateLocationRequest): Observable<LocationResponse> {
    return this.http.post<LocationResponse>(this.baseUrl, request);
  }

  /**
   * Deleta uma localização
   * @param id UUID da localização
   */
  deleteLocation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
