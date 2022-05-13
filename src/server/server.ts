import { BoardType } from '../components/board/Board';

export const AIServer = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_AI_URL_PROD // assumes REACT_APP_AI_URL_PROD url would be stored in hosting application's environment variables
  : process.env.REACT_APP_AI_URL_DEV // REACT_APP_AI_URL_DEV url stored in .env file

export enum AIServerAuthErrors {
  EmailPropRequired = 'Validation error: "email" is required',
  EmailRequired = 'Validation error: "email" is not allowed to be empty, "email" must be a valid email',
  EmailInvalid = 'Validation error: "email" must be a valid email'
}

export interface AIServerAuthResp {
  success?: boolean;
  token?: string;
  error?: AIServerAuthErrors | string;
}

export interface AIServerPlayResp {
  success?: boolean;
  board?: BoardType;
  // not type defining each possible string error as it's only for internal use and not exposed to users
  error?: string | {}; // error is known to be either string or empty {}
}