import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { IUser } from '@/types/user.type';

@Entity()
export class UserModel implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dob: Date;

  @Column({ name: 'accept_terms_of_service', type: 'boolean' })
  acceptTermsOfService: boolean;
}
