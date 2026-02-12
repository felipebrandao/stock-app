import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  UnitResponse,
  PageResponse,
  CreateUnitRequest
} from '../models/stock.models';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {
  private readonly baseUrl = `${environment.apiUrl}/units`;

  constructor(private http: HttpClient) {}

  getUnits(page: number = 0, size: number = 100): Observable<PageResponse<UnitResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<UnitResponse>>(this.baseUrl, { params });
  }

  getUnit(id: string): Observable<UnitResponse> {
    return this.http.get<UnitResponse>(`${this.baseUrl}/${id}`);
  }

  createUnit(request: CreateUnitRequest): Observable<UnitResponse> {
    return this.http.post<UnitResponse>(this.baseUrl, request);
  }

  deleteUnit(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

