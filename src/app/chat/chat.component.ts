import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {Observable, pipe, Subject, Subscription} from 'rxjs';
import {debounceTime, take, takeUntil} from 'rxjs/operators';
import {ChatClient} from './shared/chat-client.model';
import {ChatMessage} from './shared/chat-message.model';
import {JoinChatDto} from './shared/join-chat.dto';
import {StorageService} from '../shared/storage.service';
import {SendMessageDto} from './shared/send-message.dto';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  messageFc = new FormControl('');
  nicknameFc = new FormControl('');
  messages: ChatMessage[] = [];
  clientsTyping: ChatClient[] = [];
  unsubscribe$ = new Subject();
  clients: string[] = [];
  clients$: Observable<ChatClient[]> | undefined;
  chatClient: ChatClient | undefined;
  error$: Observable<string> | undefined;
  socketId: string | undefined;

  constructor(private chatService: ChatService,
              private storageService: StorageService) { }

  ngOnInit(): void {
    this.clients$ = this.chatService.listenForClients();
    this.error$ = this.chatService.listenForError();

    this.messageFc.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500)
      )
      .subscribe((value) => {
        this.chatService.sendTyping(value.length > 0);
      });

    this.chatService.listenForMessages()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(message => {
        console.log('hello', message);
        this.messages.push(message);
      });

    this.chatService.listenForClientTyping()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe( (chatClient) => {
        if (chatClient.typing && !this.clientsTyping.find((c) => c.id === chatClient.id)) {
          this.clientsTyping.push(chatClient);
        } else {
          this.clientsTyping = this.clientsTyping.filter((c) => c.id !== chatClient.id);
        }
      });

    this.chatService.listenForWelcome()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(welcome => {
        this.messages = welcome.messages;
        this.chatClient = welcome.client;
        this.storageService.saveChatClient(this.chatClient);
      });
    const oldClient = this.storageService.loadChatClient();
    if (oldClient) {
      this.chatService.joinChat({
        id: oldClient.id,
        nickname: oldClient.nickname
      });
    }

    this.chatService.listenForConnect()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(id => {
        this.socketId = id;
      });

    this.chatService.listenForDisconnect()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(id => {
        this.socketId = id;
      });
  }

  ngOnDestroy(): void {
    console.log('Destroyed chat');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
   }

  sendMessage(): void {
    console.log((this.messageFc.value));
    if (this.chatClient)
    {
      const messagedto: SendMessageDto = {message: this.messageFc.value, client: this.chatClient};
      this.chatService.sendMessage(messagedto);
      this.messageFc.patchValue('');
    }
  }

  sendNickname(): void {
    if (this.nicknameFc.value){
      const dto: JoinChatDto = {nickname: this.nicknameFc.value};
      this.chatService.joinChat(dto);
    }
  }
}
