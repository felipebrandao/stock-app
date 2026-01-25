import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * HTTP Interceptor para adicionar headers de autenticação e tratar erros globalmente
 *
 * COMO USAR:
 * 1. Descomente o código abaixo
 * 2. Adicione ao app.module.ts:
 *
 * providers: [
 *   {
 *     provide: HTTP_INTERCEPTORS,
 *     useClass: AuthInterceptor,
 *     multi: true
 *   }
 * ]
 */

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Adicionar token de autenticação (se existir)
    const token = this.getAuthToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Adicionar headers padrão
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Tratar erros globalmente
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocorreu um erro desconhecido';

        if (error.error instanceof ErrorEvent) {
          // Erro do lado do cliente
          errorMessage = `Erro: ${error.error.message}`;
        } else {
          // Erro do lado do servidor
          switch (error.status) {
            case 400:
              errorMessage = 'Requisição inválida. Verifique os dados enviados.';
              break;
            case 401:
              errorMessage = 'Não autorizado. Faça login novamente.';
              // Redirecionar para login se necessário
              // this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = 'Acesso negado.';
              break;
            case 404:
              errorMessage = 'Recurso não encontrado.';
              break;
            case 500:
              errorMessage = 'Erro interno do servidor.';
              break;
            case 503:
              errorMessage = 'Serviço temporariamente indisponível.';
              break;
            default:
              errorMessage = `Erro ${error.status}: ${error.message}`;
          }

          // Log para debugging
          console.error('HTTP Error:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            error: error.error
          });
        }

        // Retornar erro com mensagem amigável
        return throwError(() => ({
          message: errorMessage,
          status: error.status,
          originalError: error
        }));
      })
    );
  }

  /**
   * Buscar token de autenticação
   * Você pode buscar do localStorage, sessionStorage, ou de um serviço de autenticação
   */
  private getAuthToken(): string | null {
    // Exemplo: return localStorage.getItem('auth_token');
    return null; // Implementar quando tiver autenticação
  }
}

/**
 * EXEMPLO DE USO NO APP.MODULE.TS:
 *
 * import { HTTP_INTERCEPTORS } from '@angular/common/http';
 * import { AuthInterceptor } from './interceptors/auth.interceptor';
 *
 * @NgModule({
 *   // ...
 *   providers: [
 *     {
 *       provide: HTTP_INTERCEPTORS,
 *       useClass: AuthInterceptor,
 *       multi: true
 *     }
 *   ]
 * })
 * export class AppModule { }
 */

/**
 * EXEMPLO DE TRATAMENTO DE ERRO NO COMPONENTE:
 *
 * this.apiService.getProducts().subscribe({
 *   next: (response) => {
 *     this.products = response.content;
 *   },
 *   error: (err) => {
 *     // err.message já vem com a mensagem amigável do interceptor
 *     this.errorMessage = err.message;
 *
 *     // Se precisar do erro original:
 *     console.error('Erro original:', err.originalError);
 *   }
 * });
 */
