import { Model } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  status?: "in-progress" | "block";
  passwordChangedAt?: Date;
  phone?: string;
  address?: string;
  city?: string;
};


export interface UserModel extends Model<TUser>{
  isPasswordMatched(plainTextPassword: string,hashedPassword: string): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
  
}
