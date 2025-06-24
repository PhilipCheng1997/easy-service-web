import { requestClient } from '#/api/request';

export namespace MessageApi {
  export interface SendMessageRequest {
    title: string;
    content: string;
  }
  export interface MessageLog {
    [key: string]: any;
    title: string;
    content: string;
    sendTime: string;
    sendStatus: number;
    error?: string;
    sendRes?: string;
    msgId: string;
  }
}

const sendMessage = async (data: MessageApi.SendMessageRequest) => {
  return requestClient.post<string>('/message', data);
};

const getMessageLog = async (msgId: string) => {
  return requestClient.get<MessageApi.MessageLog>(`/message/log/${msgId}`);
};

export { getMessageLog, sendMessage };
