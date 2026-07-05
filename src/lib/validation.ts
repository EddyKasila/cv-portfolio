export interface ValidationRule {
  field: string;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
  type?: 'string' | 'number' | 'email' | 'url';
  custom?: (value: unknown) => string | null;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateField(value: string, rules: ValidationRule[]): ValidationResult {
  const errors: Record<string, string> = {};
  for (const rule of rules) {
    if (rule.required && (!value || value.trim() === '')) {
      errors[rule.field] = `${rule.label} is required`;
      continue;
    }
    if (!value || value.trim() === '') continue;
    if (rule.minLength && value.length < rule.minLength) {
      errors[rule.field] = `${rule.label} must be at least ${rule.minLength} characters`;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[rule.field] = `${rule.label} must be no more than ${rule.maxLength} characters`;
    }
    if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[rule.field] = `${rule.label} must be a valid email address`;
    }
    if (rule.type === 'url' && value && !/^https?:\/\/.+/.test(value)) {
      errors[rule.field] = `${rule.label} must be a valid URL (https://...)`;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[rule.field] = rule.patternMessage || `${rule.label} format is invalid`;
    }
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) errors[rule.field] = customError;
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateAll(data: Record<string, string>, rules: ValidationRule[]): ValidationResult {
  const errors: Record<string, string> = {};
  for (const rule of rules) {
    const value = data[rule.field] || '';
    const result = validateField(value, [rule]);
    if (!result.valid) {
      errors[rule.field] = result.errors[rule.field];
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
