import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: {
    value: string;
    isPositive: boolean;
  };
  bgColorClass?: string;
  textColorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  bgColorClass = 'bg-primary-50',
  textColorClass = 'text-primary-600'
}) => {
  return (
    <Card className="p-6 border border-neutral-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neutral-500 text-sm">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        </div>
        <div className={cn('p-2 rounded-lg', bgColorClass, textColorClass)}>
          {icon}
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center">
          <span className={change.isPositive ? 'text-green-500' : 'text-red-500'} >
            <i className={`ri-arrow-${change.isPositive ? 'up' : 'down'}-line mr-1`}></i> {change.value}
          </span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
