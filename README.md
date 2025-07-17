# Market Wise App - Plataforma Completa de Análise de Criptomoedas

## 🚀 Visão Geral

Market Wise App é uma aplicação web moderna e completa para análise de criptomoedas, construída com React, TypeScript e Vite. A plataforma oferece análise em tempo real, simulação de investimentos, relatórios AI avançados e uma experiência de usuário excepcional.

### ✨ Principais Funcionalidades

- 📊 **Análise em Tempo Real**: Dados de mercado via CoinCap API
- 🤖 **Relatórios AI**: Análise técnica e preditiva via AGENTFINANCE
- 💰 **Simulação de Investimentos**: Otimização de carteira com algoritmos avançados
- 🔍 **Busca Inteligente**: Autocomplete e filtros avançados
- 📱 **Design Responsivo**: Interface adaptável para todos os dispositivos
- 🌙 **Tema Escuro/Claro**: Modo noturno e claro
- 📈 **Widgets Interativos**: Rankings e métricas em tempo real
- 🔐 **Segurança**: Sanitização de dados, rate limiting e proteção XSS

---

## 🔐 Segurança

Esta aplicação implementa várias medidas de segurança. Consulte [SECURITY.md](SECURITY.md) para detalhes completos sobre:

- Sanitização de entrada de dados
- Proteção contra XSS
- Rate limiting
- Headers de segurança
- Configuração segura de ambiente

**⚠️ IMPORTANTE**: Nunca commite o arquivo `.env` ou exponha chaves de API no código fonte.

---

## 🏗️ Arquitetura do Projeto

```
market-wise-app/
├── src/
│   ├── app/                    # Estado global (Zustand)
│   │   └── store/
│   │       ├── cryptoStore.ts      # Estado de criptomoedas
│   │       ├── uiStore.ts          # Estado da interface
│   │       └── simulationStore.ts  # Estado de simulações
│   ├── components/             # Componentes reutilizáveis
│   │   ├── simulation/         # Módulo de simulação
│   │   │   ├── SimulationWizard.tsx
│   │   │   └── steps/          # Passos do wizard
│   │   ├── Header/             # Cabeçalho da aplicação
│   │   ├── ui/                 # Componentes UI (shadcn/ui)
│   │   └── ...                 # Outros componentes
│   ├── features/               # Funcionalidades específicas
│   │   └── search/             # Sistema de busca
│   ├── hooks/                  # Hooks customizados
│   ├── lib/                    # Utilitários e helpers
│   ├── pages/                  # Páginas e rotas
│   │   ├── HomePage/           # Página inicial
│   │   ├── SimulationPage.tsx  # Página de simulação
│   │   └── ...                 # Outras páginas
│   ├── shared/                 # Recursos compartilhados
│   │   ├── api/                # Serviços e tipos de API
│   │   │   ├── services/       # Serviços de API
│   │   │   ├── hooks/          # Hooks de API
│   │   │   └── types/          # Definições de tipos
│   │   ├── lib/                # Utilitários compartilhados
│   │   └── ui/                 # UI compartilhada
│   ├── widgets/                # Widgets de destaque
│   └── main.tsx                # Bootstrap da aplicação
```

### 🛠️ Stack Tecnológica

- **Frontend**: React 18 + TypeScript + Vite
- **Estilização**: Tailwind CSS + shadcn/ui
- **Estado**: Zustand (com persistência)
- **Cache**: React Query (TanStack Query)
- **Roteamento**: React Router DOM
- **Animações**: Framer Motion
- **Gráficos**: Recharts
- **Formulários**: React Hook Form + Zod
- **Notificações**: Sonner + React Hot Toast

---

## 🎯 Funcionalidades Principais

### 1. 📊 **Análise de Criptomoedas em Tempo Real**

#### Dados de Mercado

- Preços atualizados via CoinCap API
- Volume de negociação
- Variação percentual (24h, 7d, 30d)
- Market cap e supply
- Rankings por diferentes métricas

#### Widgets Interativos

- **Top Prices**: Maiores preços
- **Top Volumes**: Maiores volumes
- **Top Changes**: Maiores variações
- Atualização automática a cada 30 segundos

### 2. 🤖 **Relatórios AI Avançados**

#### Integração AGENTFINANCE

- **Análise Individual**: Relatórios detalhados por criptomoeda
- **Análise Comparativa**: Comparação entre múltiplas criptos
- **Múltiplos LLMs**: Groq (2-5s), OpenAI (10-30s), Anthropic (15-45s)
- **Fallback Automático**: Troca automática entre provedores
- **Monitoramento em Tempo Real**: Status dos LLMs

#### Tipos de Relatório

- **Análise Técnica**: Indicadores e padrões
- **Análise Fundamental**: Fundamentos e métricas
- **Análise Preditiva**: Tendências futuras
- **Relatório de Investimento**: Recomendações

### 3. 💰 **Simulação de Investimentos**

#### Módulo Completo de Simulação

- **Wizard Multi-Step**: Interface guiada em 5 passos
- **Algoritmos de Otimização**:
  - Sharpe Ratio (baixa complexidade)
  - Algoritmo Genético (alta complexidade)
  - Paridade de Risco (média complexidade)
  - Momentum (média complexidade)
  - IA Customizada (alta complexidade)

#### Funcionalidades Avançadas

- **Seleção de Criptomoedas**: Interface intuitiva
- **Configuração de Parâmetros**: Timeframe, tipo de otimização
- **Gestão de Risco**: Tolerância conservadora/moderada/agressiva
- **Backtesting**: Análise histórica
- **Métricas de Performance**: Retorno, volatilidade, Sharpe ratio
- **Histórico de Simulações**: Persistência e reutilização

#### Métricas Calculadas

- **Performance**: Retorno total, retorno anualizado
- **Risco**: Volatilidade, VaR, CVaR, Beta
- **Eficiência**: Sharpe ratio, drawdown máximo
- **Alocação**: Distribuição por ativo

### 4. 🔍 **Sistema de Busca Inteligente**

#### Busca Avançada

- **Autocomplete**: Sugestões em tempo real
- **Filtros Múltiplos**: Preço, market cap, variação
- **Categorização**: Rising, Falling, Stable
- **Histórico**: Buscas recentes
- **Sugestões Populares**: Acesso rápido

#### Interface Melhorada

- **Design Responsivo**: Adaptável a todos os dispositivos
- **Feedback Visual**: Estados de loading e resultados
- **Ordenação**: Múltiplos critérios
- **Modos de Visualização**: Lista e grid

### 5. 📱 **Interface Responsiva e Moderna**

#### Design System

- **Tema Adaptativo**: Claro/escuro automático
- **Componentes Reutilizáveis**: shadcn/ui
- **Animações Suaves**: Framer Motion
- **Acessibilidade**: ARIA labels e navegação por teclado

#### Experiência do Usuário

- **Loading States**: Feedback visual durante carregamentos
- **Error Handling**: Tratamento elegante de erros
- **Toast Notifications**: Notificações não intrusivas
- **Progressive Enhancement**: Funcionalidade sem JavaScript

---

## 🔧 Configuração e Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd market-wise-app

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev

# Acesse em http://localhost:8080
```

### Variáveis de Ambiente

```env
# API Configuration
VITE_COINCAP_BASE_URL=https://api.coincap.io/v2
VITE_AGENT_FINANCE_BASE_URL=http://localhost:8000
VITE_REQUEST_TIMEOUT=10000
VITE_RETRY_ATTEMPTS=3

# App Configuration
VITE_APP_NAME=Market Wise App
VITE_APP_VERSION=1.0.0
```

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run build:dev    # Build de desenvolvimento
npm run lint         # Verificação de código
npm run preview      # Preview do build
```

---

## 📊 APIs e Integrações

### 1. **CoinCap API**

- **Base URL**: `https://api.coincap.io/v2`
- **Endpoints**:
  - `GET /assets` - Lista de criptomoedas
  - `GET /assets/{id}` - Detalhes específicos
  - `GET /assets/{id}/history` - Histórico de preços

### 2. **AGENTFINANCE API**

- **Base URL**: `http://localhost:8000`
- **Endpoints**:
  - `GET /reports/health` - Status da API e LLMs
  - `POST /reports/crypto` - Geração de relatórios
  - `POST /api/simulation/optimize` - Otimização de carteira
  - `POST /api/simulation/backtest` - Backtesting

### 3. **Simulation API**

- **Endpoints**:
  - `POST /api/simulation/optimize` - Otimização
  - `POST /api/simulation/backtest` - Backtesting
  - `GET /api/simulation/history` - Histórico
  - `GET /api/simulation/health` - Status

---

## 🎨 Componentes Principais

### 1. **SimulationWizard**

```tsx
<SimulationWizard isOpen={isWizardOpen} onClose={handleClose} />
```

- Wizard de 5 passos para simulação
- Validação em tempo real
- Estados de loading e erro
- Animações suaves

### 2. **SearchBar**

```tsx
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  cryptos={cryptos}
  onFilterChange={handleFilterChange}
/>
```

- Autocomplete inteligente
- Filtros avançados
- Histórico de buscas
- Sugestões populares

### 3. **AIAnalysis**

```tsx
<AIAnalysis crypto={crypto} />
```

- Geração de relatórios AI
- Status dos LLMs
- Download de relatórios
- Análise individual/comparativa

### 4. **TopRankings Widgets**

```tsx
<TopPricesWidget cryptos={cryptos} />
<TopVolumesWidget cryptos={cryptos} />
<TopChangesWidget cryptos={cryptos} />
```

- Rankings em tempo real
- Atualização automática
- Design responsivo
- Interação intuitiva

---

## 📈 Estado Global (Zustand)

### 1. **CryptoStore**

```typescript
interface CryptoStore {
  cryptos: CryptoAsset[];
  searchQuery: string;
  selectedCrypto: CryptoAsset | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCryptos: (cryptos: CryptoAsset[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCrypto: (crypto: CryptoAsset | null) => void;
}
```

### 2. **SimulationStore**

```typescript
interface SimulationStore {
  selectedCoins: CryptoAsset[];
  simulationParams: Partial<SimulationRequest>;
  currentSimulation: SimulationResponse | null;
  simulationHistory: SimulationHistoryItem[];
  isWizardOpen: boolean;
  currentStep: number;

  // Actions
  setSelectedCoins: (coins: CryptoAsset[]) => void;
  updateParams: (params: Partial<SimulationRequest>) => void;
  saveSimulation: (simulation: SimulationResponse) => void;
  resetWizard: () => void;
}
```

### 3. **UIStore**

```typescript
interface UIStore {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  notifications: Notification[];

  // Actions
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Notification) => void;
}
```

---

## 🔄 Hooks Customizados

### 1. **useCrypto**

```typescript
const { data: cryptos, isLoading, error } = useCrypto();
const { mutate: generateReport } = useCryptoAnalysis();
const { data: health } = useAgentFinanceHealth();
```

### 2. **useSimulation**

```typescript
const { mutate: optimizePortfolio } = usePortfolioSimulation();
const { data: history } = useSimulationHistory();
const { mutate: deleteSimulation } = useDeleteSimulation();
```

### 3. **useFilteredCryptos**

```typescript
const filteredCryptos = useFilteredCryptos(cryptos, searchQuery, {
  priceRange: [0, 100000],
  category: "rising",
  marketCapRange: [0, 1000000000],
});
```

---

## 🛣️ Rotas e Navegação

```typescript
// App.tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/crypto/:id" element={<CryptoDetailPage />} />
  <Route path="/reports" element={<ReportGeneratorPage />} />
  <Route path="/simulation" element={<SimulationPage />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Páginas Principais

1. **HomePage** (`/`)

   - Rankings de criptomoedas
   - Barra de busca
   - Status das APIs
   - Widgets interativos

2. **CryptoDetailPage** (`/crypto/:id`)

   - Detalhes da criptomoeda
   - Análise AI
   - Gráficos de performance
   - Métricas avançadas

3. **SimulationPage** (`/simulation`)

   - Dashboard de simulações
   - Histórico de simulações
   - Wizard de nova simulação
   - Estatísticas e filtros

4. **ReportGeneratorPage** (`/reports`)
   - Geração de relatórios
   - Seleção múltipla de criptos
   - Comparação de ativos
   - Download de relatórios

---

## 🎯 Funcionalidades Avançadas

### 1. **Sistema de Cache Inteligente**

- React Query para cache de dados
- Invalidação automática
- Background refetching
- Otimistic updates

### 2. **Gestão de Estado Persistente**

- Zustand com middleware de persistência
- LocalStorage para dados importantes
- Sincronização entre abas
- Backup automático

### 3. **Tratamento de Erros Robusto**

- Error boundaries
- Fallbacks elegantes
- Retry automático
- Logging estruturado

### 4. **Performance Otimizada**

- Lazy loading de componentes
- Code splitting automático
- Memoização de componentes
- Bundle optimization

---

## 🧪 Testes e Qualidade

### Estrutura de Testes

```bash
src/
├── __tests__/           # Testes unitários
├── __mocks__/           # Mocks para testes
└── test-utils/          # Utilitários de teste
```

### Scripts de Teste

```bash
npm run test             # Executar testes
npm run test:watch       # Testes em modo watch
npm run test:coverage    # Cobertura de testes
npm run test:e2e         # Testes end-to-end
```

---

## 🚀 Deploy e Produção

### Build de Produção

```bash
npm run build
```

### Configuração de Servidor

- **Nginx**: Configuração para SPA
- **CDN**: Distribuição de assets
- **HTTPS**: Certificados SSL
- **Compression**: Gzip/Brotli

### Monitoramento

- **Error Tracking**: Sentry
- **Analytics**: Google Analytics
- **Performance**: Lighthouse
- **Uptime**: Pingdom

---

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Desenvolva** sua funcionalidade
4. **Teste** adequadamente
5. **Commit** suas mudanças
6. **Push** para a branch
7. **Abra** um Pull Request

### Padrões de Código

- **TypeScript**: Tipagem forte
- **ESLint**: Linting de código
- **Prettier**: Formatação
- **Conventional Commits**: Padrão de commits

---

## 🎉 Agradecimentos

- **CoinCap**: Dados de mercado em tempo real
- **AGENTFINANCE**: Análise AI avançada
- **shadcn/ui**: Componentes UI modernos
- **Tailwind CSS**: Framework de estilização
- **React Query**: Gerenciamento de estado de servidor
- **Zustand**: Estado global simples e eficiente

---

_Market Wise App - Transformando dados em insights inteligentes_ 🚀
