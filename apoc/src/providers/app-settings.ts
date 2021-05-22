import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the AppSettings provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class AppSettings {
  public environment = "production";
  // public SERVER_URL = "http://localhost:49160";
  // public SERVER_URL = "http://localhost:9035";
  //
  public COUCH_URL = "http://couch.apoc.social";
  // public SERVER_URL = "http://54.149.88.179";      //AWS Production
  public SERVER_URL = "http://api.apoc.social";      //AWS Development
  public SOCKET_URL = this.SERVER_URL;
  public API_URL = this.SERVER_URL;
  public API_PATH = this.SERVER_URL+"/api/";
  public MY_AWS_CONF = { bucket:'tbfit' };
  public user_token = "";

  constructor() {}

  public setUserToken(token) {
  	this.user_token = token;
  }

  public aws: any = {
    apoc_app: {
        acces_key_id: 'AKIAIH672CWRR3Q32ECA',
        secret_access_key: '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',
        bucket: 'apoc.cindt.com',
        region: 'eu-west-1'
    }
  }
}
