// Validation helpers for the onboarding forms

export type ValidationError = { field: string; message: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\+\(\)\.]{7,20}$/;

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.trim());
}

export function validateRequired(value: string | string[] | undefined | null, fieldName: string): ValidationError | null {
  if (!value || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0)) {
    return { field: fieldName, message: `${fieldName} is required` };
  }
  return null;
}

// Entry section validation (shared contact info)
export function validateEntry(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  const required = ['fullName', 'companyName', 'mobilePhone', 'bestEmail', 'cityState', 'industry', 'specialtyNiche', 'yearsInBusiness', 'monthlyBudget'];
  for (const field of required) {
    const val = data[field] as string;
    if (!val || !val.trim()) {
      errors.push({ field, message: `This field is required` });
    }
  }

  // Email format
  if (data.bestEmail && !validateEmail(data.bestEmail as string)) {
    errors.push({ field: 'bestEmail', message: 'Please enter a valid email address' });
  }

  // Phone format
  if (data.mobilePhone && !validatePhone(data.mobilePhone as string)) {
    errors.push({ field: 'mobilePhone', message: 'Please enter a valid phone number' });
  }

  // Industry "Other" requires detail
  if (data.industry === 'Other' && (!data.industryOther || !(data.industryOther as string).trim())) {
    errors.push({ field: 'industryOther', message: 'Please describe your industry' });
  }

  // Revenue model — at least one checked
  const revModel = data.revenueModel as string[] | undefined;
  if (!revModel || revModel.length === 0) {
    errors.push({ field: 'revenueModel', message: 'Select at least one revenue model' });
  }

  return errors;
}

// Stage 1 validation (minimal — most fields are optional/slider)
export function validateStage1(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Frustration question is required (FIDA entry point)
  if (!data.biggestFrustration || !(data.biggestFrustration as string).trim()) {
    errors.push({ field: 'biggestFrustration', message: 'Tell us what frustrates you most — this drives your whole system' });
  }

  // Operator score required
  if (!data.operatorScore) {
    errors.push({ field: 'operatorScore', message: 'Select where you are on the Operator to Engineer scale' });
  }

  return errors;
}

// Stage 2 validation
export function validateStage2(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Lead sources
  const sources = data.leadSources as string[] | undefined;
  if (!sources || sources.length === 0) {
    errors.push({ field: 'leadSources', message: 'Select at least one way customers find you' });
  }

  // Ideal customer
  if (!data.idealCustomer || !(data.idealCustomer as string).trim()) {
    errors.push({ field: 'idealCustomer', message: 'Describe your ideal customer' });
  }

  return errors;
}

// Stage 3 — no hard requirements (all platforms are optional toggles)
export function validateStage3(): ValidationError[] {
  return [];
}

// Server-side validation for API route
export function validateSubmission(body: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!body.stage || typeof body.stage !== 'string') {
    errors.push('Missing or invalid stage identifier');
  }

  // Must have entry contact info
  const entry = body.entry as Record<string, unknown> | undefined;
  if (!entry) {
    errors.push('Missing entry contact data');
  } else {
    if (!entry.fullName || !(entry.fullName as string).trim()) errors.push('Full name is required');
    if (!entry.bestEmail || !validateEmail(entry.bestEmail as string)) errors.push('Valid email is required');
    if (!entry.mobilePhone || !validatePhone(entry.mobilePhone as string)) errors.push('Valid phone is required');
    if (!entry.companyName || !(entry.companyName as string).trim()) errors.push('Company name is required');
  }

  // Honeypot check — if filled, it's a bot
  if (body._hp && (body._hp as string).trim()) {
    errors.push('Bot detected');
  }

  return { valid: errors.length === 0, errors };
}
