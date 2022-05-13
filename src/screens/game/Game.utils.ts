import axios, { AxiosResponse } from 'axios';
import { AIServer, AIServerPlayResp } from '../../server/server';
import { BoardType } from '../../components/board/Board';

export const getAIPlayResponse = async (board: BoardType): Promise<BoardType> => {
  try {
    const token = sessionStorage.getItem('tictactoe');
    if (!token) { throw new Error('missing token') }

    const headers = { Authorization: `bearer ${token}`}
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