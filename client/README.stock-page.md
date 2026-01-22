# Tela de Estoque (RecipeManager) – Angular + Tailwind

Esta pasta (`client/`) contém um projeto Angular com Tailwind configurado e a tela baseada no `code.html`.

## Onde está a tela
- Componente: `src/app/pages/stock-page/stock-page.component.*`
- Inserido no app: `src/app/app.component.html`

## Funcionalidades incluídas (MVP)
- Layout idêntico ao designer (Tailwind classes portadas)
- Busca por item/categoria (campo "Pesquisar")
- Filtro rápido por categoria (chips)
- Linha de item expansível (exibe unidades/lotes do item mock)

## Rodar local
```powershell
cd C:\fiap\stock-app\client
npm install
npx ng serve
```

## Build e testes
```powershell
cd C:\fiap\stock-app\client
npx ng build
npx ng test --watch=false
```

## Próximos passos sugeridos
- Quebrar em componentes menores (SummaryCards, SearchBar, StockTable).
- Trocar mocks por um `StockService` com `HttpClient`.
- Implementar paginação real e persistência de filtros.
