import type { PropsWithChildren } from 'react';

type BadgeTone = 'neutral' | 'success' | 'warning';

type BadgeProps = PropsWithChildren<{
  tone?: BadgeTone;
}>;

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

