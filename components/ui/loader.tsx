'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  className?: string;
  loadingText?: string;
}

export function Loader({ className, loadingText }: LoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        {loadingText && <p className="mt-2 text-sm font-medium text-gray-600">{loadingText}</p>}
      </div>
    </div>
  );
}
