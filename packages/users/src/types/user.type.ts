/**
 * A user type
 * @typedef {object} User
 * @property {number} id - User ID
 * @property {string} firstName.required - firstName
 * @property {string} lastName.required - firstName
 * @property {string} email.required - firstName
 * @property {string} dob.required - Date of birth (format: date)
 * @property {boolean} acceptTermsOfService.required - accept terms of service
 */
export interface IUser {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  dob: Date;
  acceptTermsOfService: boolean;
}

export interface IUserRepo {
  create(user: IUser): Promise<IUser>;
  update(id: number, data: Partial<IUser>): Promise<IUser>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<IUser[]>;
  findById(id: number): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
}
