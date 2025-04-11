
import React from 'react';
import { cn } from '@/lib/utils';

interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function PageTitle({ 
  title, 
  description, 
  className, 
  actions 
}: PageTitleProps) {
  return (
    <div className={cn(
      "flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 pb-6",
      className
    )}>
      <div>
        <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  );
}
