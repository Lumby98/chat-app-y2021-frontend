import {ChatClient} from './chat-client.model';

export interface SendMessageDto {
  message: string;
  client: ChatClient;
}
