
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  linkTo?: string;
  className?: string;
  children?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  linkTo,
  className,
  children,
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md card-transition",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-semibold mt-2">{value}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive
                      ? "text-success-foreground"
                      : "text-destructive"
                  )}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              </div>
            )}
          </div>
          <div className="rounded-full bg-primary/10 p-2">
            {React.cloneElement(icon, {
              className: "h-5 w-5 text-primary",
            })}
          </div>
        </div>
        {children}
      </CardContent>
      {linkTo && (
        <CardFooter className="px-6 py-3 bg-muted/30 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="px-0 hover:bg-transparent hover:text-primary"
            asChild
          >
            <Link to={linkTo} className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              View details
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
