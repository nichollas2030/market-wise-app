# CryptoDetail Component

Um componente moderno e responsivo para exibir detalhes completos de criptomoedas com KPIs principais.

## Características

- ✨ **Design Glass**: Interface moderna com efeito glass morphism
- 🎨 **Animações**: Animações suaves com Framer Motion
- 📱 **Responsivo**: Adaptável a diferentes tamanhos de tela
- 📊 **KPIs Completos**: Exibe todos os dados importantes da criptomoeda
- 🎯 **Loading States**: Estados de carregamento elegantes
- 🔗 **Links Externos**: Integração com exploradores de blockchain

## KPIs Exibidos

- **Preço Atual**: Com formatação dinâmica de decimais
- **Mudança 24h**: Com ícones e cores contextuais
- **Market Cap**: Capitalização de mercado formatada
- **Volume 24h**: Volume de negociação
- **Supply Information**: 
  - Supply em circulação
  - Supply máximo (quando disponível)
  - Percentual de supply em circulação
  - Barra de progresso visual
- **VWAP 24h**: Volume Weighted Average Price
- **Ranking**: Posição no ranking global
- **Explorer Link**: Link para o explorador da blockchain

## Uso Básico

```tsx
import { CryptoDetail } from '@/components/CryptoDetail';
import type { CryptoAsset } from '@/shared/api/types';

const MyComponent = () => {
  const crypto: CryptoAsset = {
    // ... dados da criptomoeda
  };

  return (
    <CryptoDetail 
      crypto={crypto} 
      className="w-full max-w-md"
    />
  );
};
```

## Uso com Loading State

```tsx
<CryptoDetail 
  crypto={crypto} 
  loading={isLoading}
  className="w-full"
/>
```

## Exemplo Completo

```tsx
import { CryptoDetailExample } from '@/components/CryptoDetail';

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      <CryptoDetailExample />
    </div>
  );
};
```

## Lista de Criptomoedas

```tsx
import { CryptoDetailList } from '@/components/CryptoDetail';

const App = () => {
  return (
    <div className="container mx-auto p-8">
      <CryptoDetailList limit={6} />
    </div>
  );
};
```

## Props

### CryptoDetail

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `crypto` | `CryptoAsset` | - | Dados da criptomoeda |
| `loading` | `boolean` | `false` | Estado de carregamento |
| `className` | `string` | - | Classes CSS adicionais |

### CryptoDetailList

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `limit` | `number` | `6` | Número de criptomoedas a exibir |
| `className` | `string` | - | Classes CSS adicionais |

## Estilização

O componente segue as diretrizes de design do projeto:

- **Variante Glass**: Efeito de vidro com backdrop blur
- **Gradientes**: Uso de gradientes primários para destaque
- **Cores Contextuais**: Verde para positivo, vermelho para negativo
- **Animações**: Transições suaves e animações escalonadas
- **Responsividade**: Grid adaptativo para diferentes telas

## Dependências

- `framer-motion`: Animações
- `lucide-react`: Ícones
- `@/shared/ui`: Componentes base (Card, Badge)
- `@/shared/lib/utils/formatters`: Funções de formatação
- `@/shared/api/types`: Tipos TypeScript 