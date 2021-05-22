import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import PouchDB from 'pouchdb';

import { AppSettings } from "../providers/app-settings";

@Injectable()
export class ProblemPouch {
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
        name: 'apocproblems', location:'default'
      };
      this.db = new PouchDB('apocproblems', dbOpts);
      console.log('initSqlDB', this.db.adapter);
      if(this.db){
        resolve();
      }else{
        reject();
      }
    })
  };

  initDefaultDB(){
    console.log('initDefaultDB:');
    return new Promise((resolve, reject) => {
      let dbOpts = {
        name: 'apocproblems', location:'default'
      };
      this.db = new PouchDB('apocproblems', dbOpts);
      console.log('initDefaultDB', this.db.adapter);
      if(this.db){
        resolve();
      }else{
        reject();
      }
    })

  };

  addProblems(problems: any){
    return this.db.bulkDocs(problems);
  }

  $destroy(){
    return this.db.destroy();
  };
};
