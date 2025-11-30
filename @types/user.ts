/**
 * Coordinates interface for geographic locations
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Address interface
 */
export interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
}

/**
 * Hair information interface
 */
export interface Hair {
  color: string;
  type: string;
}

/**
 * Bank information interface
 */
export interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

/**
 * Company information interface
 */
export interface Company {
  department: string;
  name: string;
  title: string;
  address: Address;
}

/**
 * Crypto wallet information interface
 */
export interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

/**
 * User interface based on the API schema
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
  role: string;
}

/**
 * Login response interface
 * Returned by the /auth/login endpoint
 */
export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string; // JWT accessToken (for backward compatibility) in response and cookies
  refreshToken: string; // refreshToken in response and cookies
}

/**
 * Refresh token response interface
 * Returned by the /auth/refresh endpoint
 */
export interface RefreshTokenResponse {
  accessToken: string; // New accessToken (returned in both response and cookies)
  refreshToken: string; // New refreshToken (returned in both response and cookies)
}
