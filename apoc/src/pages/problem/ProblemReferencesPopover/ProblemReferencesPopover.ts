import { Component } from '@angular/core';
import { ActionSheetController, NavParams, ViewController } from 'ionic-angular';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Problem References</ion-list-header>
      <ion-item text-wrap (click)="close(); tappedViewReference();">
      	{{activeProblem.reference}}
      </ion-item>      
      <ion-item>
        <button danger full (click)="close()">Close</button>
      </ion-item>
    </ion-list>
  `
})
export class ProblemReferencesPopoverComponent {
  activeProblem:any;
  constructor(private viewCtrl: ViewController, private params: NavParams, public actionSheetCtrl: ActionSheetController) {
    	this.activeProblem = params.data.activeProblem;
  }
  close() {
    this.viewCtrl.dismiss();
  }
  openReferenceUrl(){
  	this.close();
  	window.open(this.activeProblem.link, '_system');
  }
  tappedViewReference(){

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Albums',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Open External Browser',
          icon: 'globe',
          handler: () => {
            console.log('Open Browser ');
            this.openReferenceUrl()
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', 
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
            this.close();
          }
        }
      ]
    });
    actionSheet.present();
  }
}