import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../shared/ui';
import { useAgentFinanceHealth } from '../../shared/api';
import { Button } from '../../components/ui/button';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Zap,
  Brain,
  Server
} from 'lucide-react';

interface APIStatusProps {
  className?: string;
  showDetails?: boolean;
}

const APIStatus: React.FC<APIStatusProps> = ({ className, showDetails = false }) => {
  const { data: healthData, isLoading, error, refetch } = useAgentFinanceHealth();

  const getStatusColor = () => {
    if (isLoading) return 'text-muted-foreground';
    return healthData?.status === 'healthy' ? 'text-success' : 'text-danger';
  };

  const getStatusIcon = () => {
    if (isLoading) return <Clock className="w-4 h-4" />;
    return healthData?.status === 'healthy' ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <XCircle className="w-4 h-4" />
    );
  };

  const getStatusText = () => {
    if (isLoading) return 'Checking...';
    if (error) return 'Error';
    return healthData?.status === 'healthy' ? 'Healthy' : 'Unhealthy';
  };

  const getLLMProvidersCount = () => {
    if (!healthData?.llm_providers) return 0;
    return Object.values(healthData.llm_providers).filter(Boolean).length;
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`flex items-center gap-1 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">AGENTFINANCE</span>
        </div>
        <Badge 
          variant={healthData?.status === 'healthy' ? 'success' : 'danger'} 
          size="sm"
        >
          {getStatusText()}
        </Badge>
        <Button
          onClick={() => refetch()}
          variant="ghost"
          size="sm"
          disabled={isLoading}
          className="p-1 h-6 w-6"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gradient-primary">
          <Activity className="w-5 h-5" />
          API Status
          <Badge variant="info" size="sm" className="ml-auto">
            AGENTFINANCE
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* LLM Providers Status */}
        {healthData?.llm_providers && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="w-4 h-4" />
              LLM Providers ({getLLMProvidersCount()}/3)
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(healthData.llm_providers).map(([provider, isAvailable]) => (
                <div
                  key={provider}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${
                    isAvailable
                      ? 'bg-success/10 border-success/20 text-success'
                      : 'bg-muted/50 border-border text-muted-foreground'
                  }`}
                >
                  {isAvailable ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  <span className="capitalize font-medium">{provider}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            Performance
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Response Time</div>
                <div className="text-sm font-semibold text-primary">~200ms</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
              <Server className="w-4 h-4 text-success" />
              <div>
                <div className="text-xs text-muted-foreground">Uptime</div>
                <div className="text-sm font-semibold text-success">99.9%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/20">
            <XCircle className="w-4 h-4 text-danger" />
            <span className="text-sm text-danger">
              Failed to check API status
            </span>
          </div>
        )}

        {/* Last Updated */}
        {healthData?.timestamp && (
          <div className="text-xs text-muted-foreground text-center">
            Last updated: {new Date(healthData.timestamp).toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default APIStatus; 