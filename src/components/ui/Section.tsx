import type { PropsWithChildren } from 'react';
import type { ReactNode } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';

type SectionProps = PropsWithChildren<{
  title: string;
  description?: string;
  action?: ReactNode;
}>;

export function Section({ title, description, action, children }: SectionProps) {
  return (
    <section className="section-block">
      <SectionHeader
        title={title}
        description={description}
        action={action}
      />
      {children}
    </section>
  );
}
