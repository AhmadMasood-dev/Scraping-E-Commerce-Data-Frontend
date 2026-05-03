'use client';

import React from 'react';
import { Skeleton } from './skeleton';

interface SkeletonRow {
  columns: number;
  height?: string;
  spacing?: string;
  className?: string;
}

interface GenericSkeletonProps {
  rows: number;
  rowConfig?: SkeletonRow;
  showAddButton?: boolean;
  addButtonWidth?: string;
  className?: string;
}

export const GenericSkeleton: React.FC<GenericSkeletonProps> = ({
  rows,
  rowConfig = { columns: 2, height: 'h-10', spacing: 'space-x-3' },
  showAddButton = false,
  addButtonWidth = 'w-full',
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Skeleton rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className={`flex items-center ${rowConfig.spacing} rounded-lg border p-3`}
          >
            {Array.from({ length: rowConfig.columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1">
                <Skeleton className={`${rowConfig.height} w-full ${rowConfig.className || ''}`} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Optional Add Button skeleton */}
      {showAddButton && <Skeleton className={`h-10 ${addButtonWidth} rounded-md`} />}
    </div>
  );
};

// Pre-configured skeleton components for common use cases
export const TableSkeleton: React.FC<{ rows: number; columns?: number }> = ({
  rows,
  columns = 3,
}) => <GenericSkeleton rows={rows} rowConfig={{ columns, height: 'h-12', spacing: 'space-x-4' }} />;

export const CardSkeleton: React.FC<{ rows: number; columns?: number }> = ({
  rows,
  columns = 2,
}) => <GenericSkeleton rows={rows} rowConfig={{ columns, height: 'h-10', spacing: 'space-x-3' }} />;

export const ListSkeleton: React.FC<{ items: number; height?: string }> = ({
  items,
  height = 'h-16',
}) => <GenericSkeleton rows={items} rowConfig={{ columns: 1, height, spacing: 'space-x-0' }} />;
