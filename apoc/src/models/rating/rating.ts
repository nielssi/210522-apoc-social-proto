import { Inject, Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { AppSettings } from '../../providers/app-settings';
import { AuthService } from '../../providers/auth-service';

@Injectable()
export class RatingResource {
  public author: string;
  public value: number;
  private _id: string;
  private serverAddress = new AppSettings().API_URL;
  private resourceUrl: string = this.serverAddress+"/api/ratings/";

  constructor(@Inject(Http) private http?:Http, @Inject(AuthService) private authSrv?: AuthService) {
  }
  public update() {

  }
  public create(jwt?: string) {
    console.log("jwt from rating service: ", jwt);
    let body = this;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + jwt);
    let options = new RequestOptions({ headers: headers });
    console.log(body);
    console.log("called Create");
    return new Promise((resolve, reject) => {
      return this.http.post(this.resourceUrl, body, options)
        .subscribe(data => {
          let res = data.json();
          this._id = res._id;
          resolve(res);
        }, err => {
          reject(err.json());
        }, () => {

        });
    });
  }
}
