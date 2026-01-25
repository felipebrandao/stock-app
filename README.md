# 📦 Stock App - Sistema de Gerenciamento de Estoque

Aplicação Angular para gerenciamento de estoque integrada com backend Java Spring Boot.

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 16+ e npm
- Backend rodando em `http://localhost:8080`

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm start
```
Acesse: `http://localhost:4200`

### Build para Produção
```bash
npm run build
```

---

## ✨ Funcionalidades

### ✅ Implementadas
- 📋 Gerenciamento de Produtos
- 🏷️ Gerenciamento de Categorias
- 📍 Gerenciamento de Localizações
- 📦 Controle de Itens de Estoque
- 🔄 Movimentações de Estoque
- 🧾 Importação de NFC-e via QR Code
- 📊 Dashboard com resumo do estoque

### 🔌 Integração com Backend
- ✅ **24 endpoints** da API implementados
- ✅ Modelos TypeScript completos
- ✅ HttpClient configurado
- ✅ Tratamento de erros
- ✅ Paginação

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes reutilizáveis
│   ├── pages/               # Páginas da aplicação
│   ├── services/
│   │   ├── api.service.ts   # ⭐ Serviço principal da API
│   │   ├── stock.service.ts # Serviço de estoque (mock)
│   │   └── nfce.service.ts  # Serviço de NFC-e (mock)
│   ├── models/
│   │   ├── stock.models.ts  # Modelos de estoque
│   │   └── nfce.models.ts   # Modelos de NFC-e
│   └── interceptors/
│       └── auth.interceptor.ts # Interceptor HTTP (opcional)
├── environments/
│   ├── environment.ts       # Configuração de desenvolvimento
│   └── environment.prod.ts  # Configuração de produção
└── assets/
```

---

## 🔌 Serviços da API

A aplicação possui **serviços separados por contexto** para melhor organização e manutenção.

### Exemplo de Uso

```typescript
import { ProductsService } from './services/products.service';
import { CategoriesService } from './services/categories.service';

constructor(
  private productsService: ProductsService,
  private categoriesService: CategoriesService
) {}

// Listar produtos
this.productsService.getProducts(0, 20).subscribe(response => {
  this.products = response.content;
});

// Criar categoria
this.categoriesService.createCategory({ name: 'Grãos' }).subscribe(category => {
  console.log('Categoria criada:', category);
});
```

### Serviços Disponíveis

#### Stock Items (Itens de Estoque) - `stock-items.service.ts`
- `getStockItems()` - Listar itens
- `getStockItem(id)` - Buscar por ID
- `transferStockItem()` - Transferir item
- `openStockItem()` - Abrir item lacrado
- `convertStockItem()` - Converter em múltiplos itens
- `consumeStockItem()` - Consumir item

#### Products (Produtos) - `products.service.ts`
- `getProducts()` - Listar
- `getProduct(id)` - Buscar
- `createProduct()` - Criar
- `deleteProduct(id)` - Deletar

#### Categories (Categorias) - `categories.service.ts`
- `getCategories()` - Listar
- `getCategory(id)` - Buscar
- `createCategory()` - Criar
- `deleteCategory(id)` - Deletar

#### Locations (Localizações) - `locations.service.ts`
- `getLocations()` - Listar
- `getLocation(id)` - Buscar
- `createLocation()` - Criar
- `deleteLocation(id)` - Deletar

#### Stock Movements (Movimentações) - `stock-movements.service.ts`
- `getStockMovements()` - Listar
- `createStockMovement()` - Criar

#### NFC-e - `nfce.service.ts`
- `importNfce()` - Importar
- `getImportReview(id)` - Revisar
- `updateImportReview()` - Atualizar
- `approveImport(id)` - Aprovar

---

## ⚙️ Configuração

### URL da API

Configure em `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // ← Altere aqui
};
```

### CORS

O backend deve permitir requisições de:
```
http://localhost:4200
```

---

## 📚 Documentação Completa

### Documentos Disponíveis

1. **`API_SERVICE_DOCUMENTATION.md`**
   - Referência completa de todos os endpoints
   - Exemplos detalhados
   - Estrutura de dados completa

2. **`MIGRATION_GUIDE.md`**
   - Como migrar componentes existentes
   - Exemplos práticos de migração
   - Problemas comuns e soluções

3. **`BACKEND_INTEGRATION_README.md`**
   - Visão geral da integração
   - Configuração
   - Troubleshooting

4. **`INTEGRATION_SUMMARY.md`**
   - Resumo completo da implementação
   - Checklist de migração
   - Próximos passos

5. **`PRACTICAL_EXAMPLE.ts`**
   - Exemplo completo de componente
   - Template HTML incluído
   - Boas práticas

---

## 🛠️ Tecnologias

- **Angular 16.2** - Framework frontend
- **TypeScript 5.1** - Linguagem
- **TailwindCSS 3.4** - Estilização
- **RxJS 7.8** - Programação reativa
- **ZXing** - Leitura de QR Code
- **HttpClient** - Comunicação HTTP

---

## 📝 Scripts Disponíveis

```bash
npm start           # Servidor de desenvolvimento
npm run build       # Build de produção
npm run watch       # Build com watch mode
npm test            # Executar testes
```

---

## 🔐 Autenticação (Opcional)

Para adicionar autenticação:

1. Configure o `AuthInterceptor` em `src/app/interceptors/auth.interceptor.ts`
2. Adicione ao `app.module.ts`:

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
]
```

---

## 🐛 Troubleshooting

### Backend não conecta
- ✅ Verifique se o backend está rodando em `http://localhost:8080`
- ✅ Verifique a configuração CORS no backend
- ✅ Verifique a URL em `environment.ts`

### Erros de CORS
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solução**: Configure CORS no backend para aceitar `http://localhost:4200`

### Dados não carregam
- ✅ Certifique-se de fazer `.subscribe()` nos Observables
- ✅ Verifique o console do navegador para erros
- ✅ Verifique se o backend está respondendo (Network tab)

---

## 🚦 Status da Integração

| Componente | Status |
|------------|--------|
| ApiService | ✅ Completo (24 endpoints) |
| Modelos TypeScript | ✅ Completo |
| HttpClientModule | ✅ Configurado |
| Environments | ✅ Configurado |
| Documentação | ✅ Completa |
| Exemplos | ✅ Disponíveis |
| Testes | ✅ Básicos implementados |

---

## 📖 Próximos Passos

1. ✅ **Integração Backend Completa** - CONCLUÍDO!
2. ✅ **Serviços Separados por Contexto** - CONCLUÍDO!
3. 🔄 **Migrar StockStoreService** - Veja `MIGRATION_TO_API.md`
4. 🎨 **Melhorar UX** - Loading states e feedback
5. 🔒 **Adicionar Autenticação** - Se necessário
6. 🧪 **Testes E2E** - Implementar testes completos
7. 🚀 **Deploy** - Configurar CI/CD

---

## 👥 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é parte do curso FIAP.

---

## 🆘 Suporte

Para dúvidas sobre:
- **API**: Veja `API_SERVICE_DOCUMENTATION.md`
- **Migração**: Veja `MIGRATION_GUIDE.md`
- **Configuração**: Veja `BACKEND_INTEGRATION_README.md`

---

## 📊 Estatísticas do Projeto

- **24** endpoints da API implementados
- **22** modelos TypeScript criados
- **5** documentos de referência
- **100%** compatível com Swagger OpenAPI 3.1.0

---

**Desenvolvido com ❤️ para o projeto FIAP**

_Última atualização: 2026-01-24_
