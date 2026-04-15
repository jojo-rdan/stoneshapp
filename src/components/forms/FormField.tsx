import type { PropsWithChildren } from 'react';

type FormFieldProps = PropsWithChildren<{
  label: string;
  helperText?: string;
  error?: string;
}>;

export function FormField({ label, helperText, error, children }: FormFieldProps) {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      {children}
      {error ? <small className="form-field__error">{error}</small> : helperText && <small>{helperText}</small>}
    </label>
  );
}

