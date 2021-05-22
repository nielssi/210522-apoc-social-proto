import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AppSettings } from './app-settings';
import { Observable }     from 'rxjs/Observable';

import { AuthService } from './auth-service';

@Injectable()
export class Problems {
  public useCachedProblems: boolean = false;
  public cachedProblems: any[] = [];

  private serverAddress = new AppSettings().API_URL;
  private resourceUrl: string = this.serverAddress+"/api/problems/";
  private nextPageUrl = this.serverAddress+"/api/problems/page/";
  private allProblemsUrl = this.serverAddress+"/api/problems/all";
	private searchProblemsUrl = this.serverAddress+"/api/problems/search/";
	private randomProblemUrl = this.serverAddress+"/api/problems/randProblem";

  private problemRecommendationsUrl = this.serverAddress+"/api/problems/recommendations";


  constructor(public http: Http, public authSrv: AuthService) {
    console.log('Hello Problems Provider');
  }

  query() {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      if(this.cachedProblems.length==0){
        this.http.get(this.resourceUrl, options)
    						.subscribe((data: any) => {
                  let res = data.json();
                  this.cachedProblems = res;
                  this.useCachedProblems = true;
                  console.log('problems: ', res);
    							resolve(res);
    						}, err => {
    							reject(err.json());
    						});
      }else{
        console.log("using cachedProblems", this.cachedProblems);
        resolve(this.cachedProblems);
      }
    });
  };

  searchProblems(params: any) {
    console.log("Called searchProblems with params", params);
	    let body = params;
	    let headers = new Headers({ 'Content-Type': 'application/json' });
	    let options = new RequestOptions({ headers: headers });

		return new Promise((resolve, reject) => {
			return this.http.post(this.searchProblemsUrl, body, options)
				.subscribe(data => {
					resolve(data.json());
				}, err => {
					reject(err.json());
				}, () => {

				});
		});
  };

  nextPage(params: any) {
    console.log("Called Next Page with params", params);
	    let headers = new Headers({ 'Content-Type': 'application/json' });
	    let options = new RequestOptions({ headers: headers });

		return new Promise((resolve, reject) => {
			this.http.get(this.nextPageUrl+params.page+"/", options)
				.subscribe(data => {
					resolve(data.json());
				}, err => {
					reject(err.json());
				}, () => {

				});
		})
  }

  allProblems() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.authSrv.jwt);
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.get(this.allProblemsUrl+"/", options)
          .subscribe(data => {
            resolve(data.json());
          }, err => {
            reject(err.json());
          });
    })
  }

  random(params:any){
    console.log("Called random with params", params);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return new Promise((resolve, reject) => {
      this.http.get(this.randomProblemUrl, options)
              .subscribe(data => {
                resolve(data.json());
              }, err => {
                reject(err.json());
              }, () => {

              });
    })
  }
  get(_id: string){
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
  update(problem: any) {

    let body = problem;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return new Promise((resolve, reject) => {
      return this.http.put(this.resourceUrl+problem._id, body, options)
        .subscribe(data => {
          resolve(data.json());
        }, err => {
          reject(err.json());
        }, () => {

        });
    });
  }

  increaseProblemViews(problem: any) {

    let body = problem;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return new Promise((resolve, reject) => {
      return this.http.put(this.resourceUrl+problem._id+'/increaseProblemViews', body, options)
        .subscribe(data => {
          resolve(data.json());
        }, err => {
          reject(err.json());
        }, () => {

        });
    });
  }

  public recommendations(type: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.authSrv.jwt);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.problemRecommendationsUrl+'/'+type, options);
  }
}
