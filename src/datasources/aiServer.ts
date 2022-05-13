import axios, { AxiosResponse } from 'axios';
import { BoardType } from '../components/board/Board';
import { EmailErrors } from '../screens/signup/Signup.utils';

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

export const authenticateUser = async (email: string): Promise<EmailErrors | undefined> => {
  /*  We could aviod hitting AI Server if session token already exists
      Will remove for now without knowing more details of AI server
      like if tokens are only valid for a certain period of time
      or if new tokens are required for each email user
  */
  // if (sessionStorage.getItem('tictactoe')) { return undefined };

  try {
    const response: AxiosResponse<AIServerAuthResp> = await axios.post(`${AIServer}/auth`, { email });
    if (response?.data?.success && response?.data?.token) {
      // If successful AI call and response we store the received token in session storage for later page validation
      sessionStorage.setItem('tictactoe', response.data.token);
      return undefined;
    } else {
      throw new Error();
    }
  } catch (error: any) {
    // In theory our email validation should avoid hitting AI Server before any of these error could occur
    const errorMessage = (error?.response?.data as AIServerAuthResp | undefined)?.error;
    if (errorMessage === AIServerAuthErrors.EmailPropRequired || errorMessage === AIServerAuthErrors.EmailRequired) { return EmailErrors.EmailRequired };
    if (errorMessage === AIServerAuthErrors.EmailInvalid) { return EmailErrors.EmailInvalid };

    // Return default error message
    return EmailErrors.EmailAuthFailed;
  }
};

export const getAIPlayResponse = async (board: BoardType): Promise<BoardType> => {
  try {
    const token = sessionStorage.getItem('tictactoe');
    if (!token) { throw new Error('missing token'); }

    const headers = { Authorization: `bearer ${token}` };
    const response: AxiosResponse<AIServerPlayResp> = await axios.post(`${AIServer}/engine`, { board }, { headers });
    if (response?.data?.success && response?.data?.board) {
      return response?.data?.board;
    } else {
      throw new Error();
    }
  } catch (e) {
    // Return original board back to user. Will check if original board matches and will provide user generic error
    return board;
  }
};