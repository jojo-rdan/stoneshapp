type SwitchFieldProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function SwitchField({ label, description, checked, onChange }: SwitchFieldProps) {
  return (
    <label className="switch-field">
      <div>
        <span className="form-field__label">{label}</span>
        {description && <small>{description}</small>}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

