import { Inject, Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { AppSettings } from '../../providers/app-settings';

@Injectable()
export class CommentReportResource {
  public reporter: any;
  public problem: any;
  public comment: any;

  private _id: string;
  private created_at: string;

  private serverAddress = new AppSettings().API_URL;
  private resourceUrl: string = this.serverAddress+"/api/commentreports/";

  constructor(@Inject(Http) private http?:Http) {
    this.created_at = new Date().toISOString();
  }

  public update() {
    let body = this;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      return this.http.put(this.resourceUrl+this._id, body, options)
        .subscribe(data => {
          resolve(data.json());
        }, err => {
          reject(err.json());
        }, () => {

        });
    });
  }

  public create(jwt?: string) {
    let body = this;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + jwt);
    let options = new RequestOptions({ headers: headers });
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
  public get(_id: string){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.get(this.resourceUrl+_id, options)
      .subscribe(data => {
        resolve(data.json());
      }, err => {
        reject(err.json());
      }, () => {

      });
    })
  }
  public init(param){
    for (var prop in param){
      // console.log(prop, ' : ', param[prop], this[prop]);
      this[prop] = param[prop];
    }
  }
}
