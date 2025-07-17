import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSimulationStore } from '../app/store/simulationStore';
import { useSimulationHistory, useSimulationStats } from '../shared/api/hooks/useSimulation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Plus, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  BarChart3, 
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Calendar,
  Zap
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../shared/lib/utils/formatters';
import SimulationWizard from '../components/simulation/SimulationWizard';
import Header from '../components/Header/Header';

const SimulationPage: React.FC = () => {
  const { setWizardOpen } = useSimulationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const { data: historyData, isLoading } = useSimulationHistory(1, 20, {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    optimizationType: typeFilter !== 'all' ? typeFilter : undefined,
  });

  const { stats } = useSimulationStats();

  const handleNewSimulation = () => {
    setIsWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
  };

  const handleViewSimulation = (simulationId: string) => {
    // TODO: Implementar visualização detalhada
    console.log('View simulation:', simulationId);
  };

  const handleDeleteSimulation = (simulationId: string) => {
    // TODO: Implementar exclusão
    console.log('Delete simulation:', simulationId);
  };

  const handleDownloadSimulation = (simulationId: string) => {
    // TODO: Implementar download
    console.log('Download simulation:', simulationId);
  };

  const filteredHistory = historyData?.items?.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <>
      <Header />
      
      {/* Espaçador para compensar o header fixo */}
      <div className="h-14 sm:h-16 lg:h-18" />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Simulação de Investimentos</h1>
            <p className="text-muted-foreground mt-1">
              Otimize sua carteira de criptomoedas com algoritmos avançados
            </p>
          </div>
          
          <Button onClick={handleNewSimulation} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Simulação
          </Button>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Simulações</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Investimento Total</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalInvestment)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Retorno Médio</p>
                    <p className="text-2xl font-bold">{formatPercent(stats.avgReturn)}</p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar simulações..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Concluídas</SelectItem>
                  <SelectItem value="processing">Processando</SelectItem>
                  <SelectItem value="failed">Falharam</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="sharpe">Sharpe Ratio</SelectItem>
                  <SelectItem value="genetic_algorithm">Algoritmo Genético</SelectItem>
                  <SelectItem value="risk_parity">Paridade de Risco</SelectItem>
                  <SelectItem value="momentum">Momentum</SelectItem>
                  <SelectItem value="custom_ai">IA Customizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Simulation History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Histórico de Simulações
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma simulação encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Crie sua primeira simulação para começar'
                  }
                </p>
                {!searchQuery && statusFilter === 'all' && typeFilter === 'all' && (
                  <Button onClick={handleNewSimulation}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Simulação
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((simulation) => (
                  <motion.div
                    key={simulation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium truncate">{simulation.name}</h3>
                        <Badge 
                          variant={simulation.status === 'completed' ? 'default' : 
                                  simulation.status === 'processing' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {simulation.status === 'completed' ? 'Concluída' :
                           simulation.status === 'processing' ? 'Processando' : 'Falhou'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(simulation.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{formatCurrency(simulation.initialInvestment)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{formatPercent(simulation.totalReturn)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewSimulation(simulation.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadSimulation(simulation.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSimulation(simulation.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Simulation Wizard */}
      <SimulationWizard 
        isOpen={isWizardOpen} 
        onClose={handleCloseWizard} 
      />
    </>
  );
};

export default SimulationPage; 