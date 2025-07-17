# Funcionalidades de Busca de Criptomoedas

## Visão Geral

Este documento descreve as funcionalidades de busca implementadas no projeto CryptoApp, que permitem aos usuários filtrar e encontrar criptomoedas de forma eficiente.

## Funcionalidades Implementadas

### 1. Barra de Busca Inteligente

**Localização**: Header da aplicação
**Componente**: `SearchBar` (`src/features/search/SearchBar.tsx`)

#### Características:

- **Busca em tempo real**: Filtra resultados conforme o usuário digita
- **Busca por múltiplos critérios**: Nome, símbolo e ID da criptomoeda
- **Histórico de busca**: Mantém as últimas 10 buscas realizadas
- **Sugestões populares**: Lista de criptomoedas populares para busca rápida
- **Interface responsiva**: Adapta-se a diferentes tamanhos de tela

#### Funcionalidades da Interface:

- **Ícone de busca**: Indica visualmente que é um campo de busca
- **Botão de limpar**: Remove o texto digitado e foca no campo
- **Indicador visual**: Ponto vermelho animado quando há busca ativa
- **Sugestões dropdown**: Aparece ao focar no campo
- **Navegação por teclado**: Enter para confirmar busca

### 2. Hook de Filtro Personalizado

**Localização**: `src/shared/api/hooks/useCrypto.ts`
**Hook**: `useFilteredCryptos`

#### Funcionalidades:

- **Filtro case-insensitive**: Não diferencia maiúsculas/minúsculas
- **Busca parcial**: Encontra correspondências parciais
- **Performance otimizada**: Filtro eficiente em arrays grandes
- **Retorno imediato**: Sem delay na aplicação do filtro

### 3. Componente de Resultados de Busca

**Localização**: `src/components/SearchResults/SearchResults.tsx`

#### Características:

- **Exibição dedicada**: Interface específica para resultados de busca
- **Contador de resultados**: Mostra quantos itens foram encontrados
- **Estado de carregamento**: Skeleton loading durante busca
- **Estado vazio**: Mensagem amigável quando não há resultados
- **Animações suaves**: Transições elegantes entre estados

### 4. Integração com o Store

**Localização**: `src/app/store/cryptoStore.ts`

#### Funcionalidades do Store:

- **Persistência**: Histórico de busca salvo localmente
- **Estado de busca**: `searchQuery` para controle da busca atual
- **Histórico**: `searchHistory` com as últimas buscas
- **Ações**: `setSearchQuery`, `addToSearchHistory`, `clearSearchHistory`

## Como Usar

### Busca Básica

1. Digite o nome, símbolo ou ID da criptomoeda na barra de busca
2. Os resultados aparecem automaticamente
3. Use Enter para confirmar a busca

### Histórico de Busca

1. Clique na barra de busca para ver o histórico
2. Clique em qualquer item do histórico para repetir a busca
3. O histórico é automaticamente atualizado

### Sugestões Populares

1. Clique na barra de busca
2. Veja a lista de criptomoedas populares
3. Clique em qualquer sugestão para buscar

### Limpar Busca

- Clique no botão X na barra de busca, ou
- Clique no botão "Clear Search" nos resultados

## Criptomoedas Populares Disponíveis

- Bitcoin
- Ethereum
- Cardano
- Solana
- Polkadot
- Dogecoin
- Chainlink
- Polygon
- Avalanche
- Cosmos

## Estados da Interface

### Estado Normal

- Mostra os rankings de mercado padrão
- Barra de busca vazia
- Indicador visual inativo

### Estado de Busca

- Mostra resultados filtrados
- Título atualizado com termo de busca
- Contador de resultados
- Botão para limpar busca
- Indicador visual ativo

### Estado de Carregamento

- Skeleton loading nos resultados
- Texto "Searching..." no título
- Animações de carregamento

### Estado Vazio

- Mensagem "No results found"
- Sugestões de busca
- Ícone de alerta

## Tecnologias Utilizadas

- **React**: Framework principal
- **TypeScript**: Tipagem estática
- **Framer Motion**: Animações
- **Zustand**: Gerenciamento de estado
- **Lucide React**: Ícones
- **Tailwind CSS**: Estilização

## Estrutura de Arquivos

```
src/
├── features/
│   └── search/
│       └── SearchBar.tsx          # Componente principal de busca
├── components/
│   └── SearchResults/
│       ├── SearchResults.tsx      # Exibição de resultados
│       └── index.ts
├── shared/
│   └── api/
│       └── hooks/
│           └── useCrypto.ts       # Hook de filtro
└── app/
    └── store/
        └── cryptoStore.ts         # Estado de busca
```

## Próximas Melhorias

1. **Busca avançada**: Filtros por preço, market cap, etc.
2. **Autocomplete**: Sugestões baseadas em digitação
3. **Busca por voz**: Integração com reconhecimento de voz
4. **Favoritos**: Marcar criptomoedas como favoritas
5. **Exportar resultados**: Salvar resultados em CSV/PDF
6. **Comparação**: Comparar múltiplas criptomoedas
7. **Alertas**: Configurar alertas de preço
8. **Histórico de preços**: Gráficos nos resultados
