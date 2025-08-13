# Platto 🤖

Seu assistente culinário inteligente que transforma suas compras em receitas deliciosas!!

## 🚀 Funcionalidades

- **📱 Interface Mobile-First**: Design responsivo otimizado para dispositivos móveis
- **🍽️ Receitas Inteligentes**: Catálogo com 20+ receitas com imagens reais e instruções detalhadas
- **📝 Lista de Compras**: Consolidação automática de ingredientes das receitas selecionadas
- **💰 Controle de Gastos**: Acompanhe seus gastos por categoria com gráficos visuais
- **📄 Leitor de Notas**: Upload de notas fiscais via câmera, QR Code ou arquivo
- **🎯 Datas Especiais**: Sugestões de receitas baseadas em datas comemorativas
- **❤️ Favoritos**: Salve suas receitas preferidas
- **🔍 Busca Avançada**: Filtros por categoria, dificuldade e ingredientes

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 13 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Estado Global**: Zustand
- **Validação**: Zod
- **Ícones**: Lucide React
- **Testes**: Vitest
- **Qualidade**: ESLint + Prettier

## 📦 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd meu-menu-app

# Instale as dependências
npm install
# ou
pnpm install

# Execute o servidor de desenvolvimento
npm run dev
# ou
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar build
npm start

# Testes
npm run test

# Testes com interface
npm run test:ui

# Testes com cobertura
npm run test:coverage

# Verificação de tipos
npm run typecheck

# Linting
npm run lint

# Formatação
npm run format
```

## 🧪 Sequência de Testes por Módulo

Para executar todos os testes e garantir qualidade:

```bash
# 1. Verificar tipos TypeScript
npm run typecheck

# 2. Executar linting
npm run lint

# 3. Executar todos os testes
npm run test

# 4. Verificar cobertura
npm run test:coverage
```

### Testes por Módulo:

```bash
# Módulo 1 - QR Scanner e Ingestão
npm run test __tests__/qr-ingest.test.ts

# Módulo 2 - Aplicar Receita no Estoque
npm run test __tests__/apply-recipe-stock.test.ts

# Módulo 3 - Lista Inteligente
npm run test __tests__/list-intel.test.ts

# Módulo 4 - Calendário e Temas
npm run test __tests__/food-theme.test.ts

# Módulo 5 - Controle de Gastos
npm run test __tests__/budget.test.ts

# Módulo 6 - Promoções B2B
npm run test __tests__/promotions.test.ts
```

### Hooks de Qualidade:

O projeto usa **Husky** para garantir qualidade no commit:

- ✅ **Pre-commit**: Executa lint, typecheck e testes automaticamente
- ✅ **Lint-staged**: Formata apenas arquivos modificados
- ✅ **TypeScript**: Verificação rigorosa de tipos
- ✅ **ESLint**: Regras de qualidade de código

```bash
# Instalar hooks (executado automaticamente no npm install)
npm run prepare
```

## 📱 Páginas e Funcionalidades

### 🏠 Página Inicial (`/`)
- Banner de data especial do dia
- Ações rápidas (Receitas, Lista, Gastos, Enviar Nota)
- Carrosséis de receitas por categoria
- Sugestões personalizadas

### 🔍 Buscar (`/buscar`)
- Campo de busca em tempo real
- Filtros por categoria e dificuldade
- Visualização em grade ou lista
- Contagem de resultados

### 📝 Lista de Compras (`/lista`)
- Consolidação automática de ingredientes
- Agrupamento por categoria
- Checkbox para marcar itens comprados
- Barra de progresso
- Estatísticas de conclusão

### 💰 Controle de Gastos (`/gastos`)
- Formulário para adicionar gastos
- Categorização automática
- Gráficos por categoria
- Resumo mensal
- Histórico de transações

### 👤 Perfil (`/perfil`)
- Informações do usuário
- Estatísticas de uso
- Menu de configurações
- Acesso a favoritos e histórico

### 📄 Enviar Nota (`/enviar-nota`)
- Upload via câmera
- Escaneamento de QR Code
- Upload de arquivo (PDF/XML)
- Processamento simulado
- Extração de itens

### 🍽️ Receitas (`/receitas`)
- Lista completa de receitas
- Filtros por categoria
- Modos de visualização
- Busca integrada

### 📖 Detalhes da Receita (`/receitas/[slug]`)
- Imagem em destaque
- Lista de ingredientes com checkbox
- Instruções passo a passo
- Informações nutricionais
- Botão para adicionar à lista

## 🎨 Customização

### Alterando Imagens
As imagens das receitas estão definidas em `lib/mock-data.ts`. Para alterar:

```typescript
// Em lib/mock-data.ts
export const mockRecipes: Recipe[] = [
  {
    id: '1',
    image: 'https://nova-url-da-imagem.jpg', // Altere aqui
    // ... outros campos
  }
]
```

### Modificando Dados Mock
Todos os dados mockados estão centralizados em `lib/mock-data.ts`:

- **Receitas**: Array `mockRecipes`
- **Datas Especiais**: Array `specialDates`  
- **Lista de Compras**: Array `mockShoppingList`
- **Gastos**: Array `mockExpenses`

### Personalizando Cores
As cores estão definidas em `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#ef4444',    // Vermelho principal
      secondary: '#f97316',  // Laranja secundário
    },
  },
}
```

## 🧪 Testes

O projeto inclui testes básicos com Vitest:

```bash
# Executar testes
npm run test

# Testes com interface
npm run test:ui

# Testes em modo watch
npm run test:watch
```

Exemplo de teste (consolidação de ingredientes):

```typescript
// __tests__/consolidate-ingredients.test.ts
import { consolidateIngredients } from '@/lib/mock-data'

test('should consolidate ingredients from multiple recipes', () => {
  const result = consolidateIngredients(['1', '2'])
  expect(result.length).toBeGreaterThan(0)
  expect(result[0]).toHaveProperty('name')
  expect(result[0]).toHaveProperty('amount')
})
```

## 🔧 Configurações de Desenvolvimento

### ESLint
Configurado em `.eslintrc.json` com regras para Next.js e TypeScript.

### Prettier
Formatação automática configurada para manter consistência no código.

### TypeScript
Configuração rigorosa em `tsconfig.json` com paths absolutos (`@/`).

## 📱 PWA e Mobile

O app é otimizado para dispositivos móveis com:
- Design mobile-first
- Safe areas para dispositivos com notch
- Navegação por tabs na parte inferior
- Gestos touch otimizados
- Carregamento rápido de imagens

## 🚀 Deploy

Para fazer deploy:

```bash
# Build do projeto
npm run build

# Os arquivos estáticos estarão em 'out/'
# Configure seu servidor para servir estes arquivos
```

O projeto está configurado para export estático (`output: 'export'` no `next.config.js`).

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Meu Menu 🤖** - Transformando suas compras em experiências culinárias incríveis! 👨‍🍳✨
