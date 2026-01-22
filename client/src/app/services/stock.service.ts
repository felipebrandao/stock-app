import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { PagedResult, StockBatch, StockFilter, StockItem, StockSummary } from '../models/stock.models';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private readonly items: StockItem[] = [
    {
      id: 'milk-1',
      name: 'Leite Integral 1L',
      category: 'Laticínios',
      totalQuantity: 3.0,
      unit: 'Litros',
      status: 'BAIXO'
    },
    {
      id: 'flour-1',
      name: 'Farinha de Trigo Especial',
      category: 'Grãos',
      totalQuantity: 5.0,
      unit: 'Quilos',
      status: 'OK'
    },
    {
      id: 'pepper-1',
      name: 'Pimenta do Reino Grão',
      category: 'Temperos',
      totalQuantity: 0,
      unit: 'Gramas',
      status: 'ESGOTADO'
    }
  ];

  private readonly batchesByItemId: Record<string, StockBatch[]> = {
    'milk-1': [
      {
        batchId: 'milk-1-use',
        itemId: 'milk-1',
        label: 'Em Uso',
        qtyLabel: '1 Unidade',
        locationLabel: 'Geladeira (desde 15/12)',
        expiresAtLabel: '24/12',
        expiresAtTone: 'danger'
      },
      {
        batchId: 'milk-1-sealed',
        itemId: 'milk-1',
        label: 'Lacrado',
        qtyLabel: '2 Unidades',
        locationLabel: 'Armário (adicionado em 14/12)',
        expiresAtLabel: '10/01',
        expiresAtTone: 'ok'
      }
    ]
  };

  getSummary(): Observable<StockSummary> {
    return of(this.items).pipe(
      map(items => ({
        total: items.length,
        low: items.filter(i => i.status === 'BAIXO').length,
        out: items.filter(i => i.status === 'ESGOTADO').length,
        expSoon: items.filter(i => i.status === 'VALIDADE_PROXIMA').length
      })),
      delay(50)
    );
  }

  getItems(filter: StockFilter): Observable<PagedResult<StockItem>> {
    const q = filter.query?.trim().toLowerCase() ?? '';
    const categories = (filter.categories ?? []).map(c => c.toLowerCase());
    const statuses = filter.status ?? [];

    return of(this.items).pipe(
      map(items =>
        items.filter(i => {
          const matchesQuery = !q || i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q);
          const matchesCategory = !categories.length || categories.includes(i.category.toLowerCase());
          const matchesStatus = !statuses.length || statuses.includes(i.status);
          return matchesQuery && matchesCategory && matchesStatus;
        })
      ),
      map(filtered => {
        const page = Math.max(1, filter.page || 1);
        const pageSize = Math.max(1, filter.pageSize || 10);
        const start = (page - 1) * pageSize;
        const slice = filtered.slice(start, start + pageSize);
        return {
          items: slice,
          total: filtered.length,
          page,
          pageSize
        };
      }),
      delay(120)
    );
  }

  getBatches(itemId: string): Observable<StockBatch[]> {
    return of(this.batchesByItemId[itemId] ?? []).pipe(delay(120));
  }
}
