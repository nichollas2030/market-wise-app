import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '../../shared/ui';
import { formatCryptoPrice, getChangeColorClass } from '../../shared/lib/utils/formatters';
import type { CryptoAsset } from '../../shared/api/types';

interface CryptoItemProps {
  crypto: CryptoAsset;
  rank?: number;
  showRank?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
}

const CryptoItem: React.FC<CryptoItemProps> = ({ 
  crypto, 
  rank, 
  showRank = true,
  className = '',
  variant = 'default'
}) => {
  const navigate = useNavigate();
  const change = parseFloat(crypto.changePercent24Hr);
  const isPositiveChange = change >= 0;

  const handleClick = () => {
    navigate(`/crypto/${crypto.id}`);
  };

  const baseClasses = "flex items-center justify-between p-2 sm:p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-smooth cursor-pointer hover:shadow-lg hover:scale-[1.02] min-w-0";

  if (variant === 'compact') {
    return (
      <motion.div
        className={`${baseClasses} ${className}`}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
              <div className="flex items-center gap-2 min-w-0 flex-1">
        {showRank && rank && (
          <Badge 
            variant={rank === 1 ? 'warning' : rank === 2 ? 'info' : 'default'}
            className="min-w-5 h-5 justify-center text-xs flex-shrink-0"
          >
            {rank}
          </Badge>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-xs sm:text-sm truncate">{crypto.symbol}</p>
          <p className="text-xs text-muted-foreground truncate">{crypto.name}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-2">
        <p className="font-bold text-xs sm:text-sm">{formatCryptoPrice(crypto.priceUsd)}</p>
        <Badge 
          variant={isPositiveChange ? 'success' : 'danger'}
          size="sm"
          className="text-xs"
        >
          {isPositiveChange ? '+' : ''}{change.toFixed(2)}%
        </Badge>
      </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {showRank && rank && (
          <Badge 
            variant={rank === 1 ? 'warning' : rank === 2 ? 'info' : 'default'}
            className="min-w-5 h-5 sm:min-w-6 sm:h-6 justify-center text-xs flex-shrink-0"
          >
            {rank}
          </Badge>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-xs sm:text-sm lg:text-base truncate">{crypto.name}</p>
          <p className="text-xs text-muted-foreground truncate">{crypto.symbol}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-2">
        <p className="font-bold text-xs sm:text-sm lg:text-base">{formatCryptoPrice(crypto.priceUsd)}</p>
        <Badge 
          variant={isPositiveChange ? 'success' : 'danger'}
          size="sm"
          className="text-xs"
        >
          {isPositiveChange ? '+' : ''}{change.toFixed(2)}%
        </Badge>
      </div>
    </motion.div>
  );
};

export default CryptoItem; 