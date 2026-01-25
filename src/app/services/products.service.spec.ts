import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { environment } from '../../environments/environment';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService]
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products with pagination', () => {
    const mockResponse = {
      content: [
        { id: '1', name: 'Product 1', categoryId: 'cat1', createdAt: '2024-01-01T00:00:00Z' }
      ],
      totalElements: 1,
      totalPages: 1,
      size: 20,
      number: 0,
      first: true,
      last: true,
      numberOfElements: 1,
      empty: false
    };

    service.getProducts(0, 20).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.content.length).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products?page=0&size=20`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch a single product by id', () => {
    const mockProduct = {
      id: '123',
      name: 'Test Product',
      categoryId: 'cat-123',
      createdAt: '2024-01-01T00:00:00Z'
    };

    service.getProduct('123').subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should create a product', () => {
    const request = { name: 'New Product', categoryId: 'cat-123' };
    const mockResponse = {
      id: '456',
      name: 'New Product',
      categoryId: 'cat-123',
      createdAt: '2024-01-01T00:00:00Z'
    };

    service.createProduct(request).subscribe(product => {
      expect(product).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockResponse);
  });

  it('should delete a product', () => {
    service.deleteProduct('123').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/123`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
