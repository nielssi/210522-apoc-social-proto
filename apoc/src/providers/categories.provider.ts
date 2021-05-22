import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AppSettings } from './app-settings';
import { Observable }     from 'rxjs/Observable';

import { AuthService } from './auth-service';

@Injectable()
export class CategoriesProvider {
  private serverAddress = new AppSettings().API_URL;
  private resourceUrl: string = this.serverAddress+"/api/Categorys/";

  constructor(public http: Http, public authSrv: AuthService) {
    console.log('Hello Problems Provider');
  }

  query() {
    console.log("got to query");
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.authSrv.jwt);
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.get(this.resourceUrl, options)
        .subscribe((data: any) => {
          let res = data.json();
          //console.log('categories: ', res);
          res.forEach((element, index) => {
              element.index = index
          });
          resolve(res);
        }, err => {
          //console.log("got to this error: ", JSON.stringify(err.json()));
          console.log("got to this error1");
          console.log("this error: ", JSON.stringify(err));
          reject(err.json());
        });
    });
  };

}
