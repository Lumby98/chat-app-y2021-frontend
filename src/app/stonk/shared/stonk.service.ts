import { Injectable } from '@angular/core';
import {SocketStonk} from '../../app.module';
import {Observable} from 'rxjs';
import {Stonk} from './stonk.model';

@Injectable({
  providedIn: 'root'
})
export class StonkService {

  constructor(private socket: SocketStonk) { }

  listenForStonkUpdate(): Observable<Stonk> {
    return this.socket
      .fromEvent<Stonk>('updateStonk');
  }

  listenForStonks(): Observable<Stonk[]>{
    return this.socket
      .fromEvent<Stonk[]>('allStonks');
  }

  listenForErrors(): Observable<string>{
    return this.socket
      .fromEvent<string>('error');
  }

  sendUpdate(stonk: Stonk): void {
    this.socket.emit('update', stonk);
  }
}
