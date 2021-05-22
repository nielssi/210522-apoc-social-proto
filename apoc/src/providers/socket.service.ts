import * as io from 'socket.io-client';
import { Injectable, Component } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/distinct';
import { AppSettings } from './app-settings';
import { AuthService } from './auth-service';

@Injectable()
export class SocketService {
  public socket: any;
  public $observer: any;

  constructor(private authService: AuthService, private appSettings: AppSettings) {
    this.initSocket();
  }
  public initSocket() {
    this.socket = io.connect(this.appSettings.SOCKET_URL, { path: '/socket.io-client' });
    console.log(this.socket);
    this.socket.on('connection', (data) => {
      console.log('socket connected', data);
    });
    this.$observer = Observable.create($ => this.socket.on('message', $.next.bind(this)));
  };

  public getUsersGroups(user_id: string){
    console.log('getUsersGroups');
    let message$ = Observable.create(observable => {
      this.socket.emit('get:groups', { user: user_id}, function(err, data){
        observable.complete();
        console.log('completed get:groups', data);
      });

      this.socket.on('get:groups:result', (data, cb) => {
        observable.next(data);
        cb('success');
      });
    });
    return message$;
  };

  public updateProblemKeywords(problem) {
    console.log('updateProblemKeywords', problem);
    let message$ = Observable.create(observable => {
      this.socket.emit('update:problem:keywords', { problem: problem}, function(err, data){
        observable.complete();
        console.log('completed update:problem:keywords', data);
      });

      this.socket.on('update:problem:keywords', (data, cb) => {
        observable.next(data);
        cb('success');
      });
    });
    return message$;
  }

  // Generics

  public emitWithAck(eventName: string, data: any, cb: any) {
    return this.socket.emit(eventName, data, cb);
  };

  public emit(eventName: string, data: any, cb?: any) {
    if(cb){
      this.socket.emit(eventName, data, cb);
    }else{
      this.socket.emit(eventName, data);
    }
  };


}
