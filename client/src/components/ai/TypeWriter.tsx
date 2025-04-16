import React from 'react';
import { cn } from '@/lib/utils';

interface TypeWriterProps {
  className?: string;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ className }) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" />
      <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce delay-75" />
      <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce delay-150" />
    </div>
  );
};

export default TypeWriter;
