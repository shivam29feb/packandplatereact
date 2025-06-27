export enum UserType {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  username: string;
  email: string;
  type: UserType;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
}
