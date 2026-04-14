import type { PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  aside?: string;
}>;

export function Card({ title, subtitle, aside, children }: CardProps) {
  return (
    <article className="card">
      {(title || subtitle || aside) && (
        <header className="card__header">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {aside && <span className="card__aside">{aside}</span>}
        </header>
      )}
      <div className="card__content">{children}</div>
    </article>
  );
}

