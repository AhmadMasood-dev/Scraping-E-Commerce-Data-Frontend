'use client';

import { cn } from '@/lib/utils';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export default function Heading({ className, children, ...props }: HeadingProps) {
  return (
    <h3 className={cn(className)} {...props}>
      {children}
    </h3>
  );
}
