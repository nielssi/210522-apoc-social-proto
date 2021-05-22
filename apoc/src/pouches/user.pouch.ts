import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import PouchDB from 'pouchdb';

import { AppSettings } from "../providers/app-settings";

@Injectable()
export class UserPouch {
  private serverAddress: any = new AppSettings().COUCH_URL;
  public data: any;
  public db: any;
  public remote: any;
  public local: any;

  constructor(public platform: Platform) {
  }

  public init(){
      if (this.platform.is('core')) {
        // Browser
        return this.initDefaultDB();
      } else {
        // Device
        return this.initSqlDB();
      }
  }

  initSqlDB(){
    return new Promise((resolve, reject) => {
      let dbOpts = {
        name: 'apocuser', location:'default'
      };
      this.db = new PouchDB('apocuser', dbOpts);
      console.log('initUserSqlDB: ', this.db.adapter);
      if(this.db){
        resolve();
      }else{
        reject();
      }
    })
  };

  initDefaultDB(){
    return new Promise((resolve, reject) => {
      let dbOpts = {
        name: 'apocuser', location:'default'
      };
      this.db = new PouchDB('apocuser', dbOpts);
      console.log('initDefaulUserDB: ', this.db.adapter);
      if(this.db){
        resolve();
      }else{
        reject();
      }
    });
  };

  addProblems(problems: any){
    return this.db.bulkDocs(problems);
  }

  $destroy(){
    return this.db.destroy();
  };
};
