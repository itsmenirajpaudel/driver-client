import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { environment } from 'src/environments/environment';

interface IDriver {
  id: number, 
  name: string,
  latlng: Array<number>
};

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
 
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

  constructor() {   }

  setupSocketConnection(data: Array<IDriver>, callback: (message:string) => void ) {
    this.socket = io(environment.socketUrl);

    for(let eachData of data) {
      this.socket.on('driver_'+eachData.id, (message: string) => {
        callback(message);
      });
    }
  }

  isConnected() {
    return this.socket?.connected;
  }

  disconnect() {
    if (this.socket) {
        this.socket.emit('end');
    }
  }
}