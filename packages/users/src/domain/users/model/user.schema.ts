import { z } from 'zod';

const isValidDate = (date: string) => {
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (!regex.test(date)) {
    return false;
  }
  const [month, day, year] = date.split('/').map(Number);
  const parsedDate = new Date(year, month - 1, day);
  return parsedDate.getFullYear() === year && parsedDate.getMonth() === month - 1 && parsedDate.getDate() === day;
};

/**
 * Create user type
 * @typedef {object} CreateUserBody
 * @property {string} firstName.required - firstName
 * @property {string} lastName.required - firstName
 * @property {string} email.required - firstName
 * @property {string} dob.required - Date of birth (format: date)
 * @property {boolean} acceptTermsOfService.required - accept terms of service
 */
export const CreateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  dob: z.string().refine(isValidDate, 'Invalid date format, expected MM/dd/YYYY'),
  acceptTermsOfService: z.boolean().refine((val) => val === true, 'Terms of service must be accepted')
});
