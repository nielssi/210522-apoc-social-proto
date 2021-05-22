import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

// Providers
import { AuthService } from '../../../providers/auth-service';

// Resources
import { RatingsResource } from  '../../../resources/rating.resource';
import { Problems } from '../../../providers/problems';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Rate Problem Difficulty {{difficulty}}</ion-list-header>
      <ion-item>
        <ion-range min="0" max="10" step="1" danger [(ngModel)]="difficulty">
          <ion-icon range-left small danger name="ios-speedometer-outline"></ion-icon>
          <ion-icon range-right danger name="ios-speedometer-outline"></ion-icon>
        </ion-range>
      </ion-item>
      <ion-item>
        <button danger full ion-button (click)="tappedSaveDifficulty(difficulty);">Save</button>
      </ion-item>
    </ion-list>
  `
})
export class RateProblemPopover {
  difficulty: any;
  activeProblem: any;
  constructor(private viewCtrl: ViewController, private params: NavParams, private ratingResource: RatingsResource, private authSrv: AuthService, private problemsRes: Problems) {
    this.difficulty = params.data.myRating;
    this.activeProblem = params.data.activeProblem;
  }

  tappedSaveDifficulty(difficulty){
    // this.activeProblem.myRating = difficulty;
    delete this.activeProblem.__v;
    console.log('before', difficulty, this.activeProblem);
    // this.activeProblem.difficulty = (this.activeProblem.difficulty_ratings.length>0) ? (this.activeProblem.difficulty + difficulty)/2 : difficulty;
    if(this.activeProblem.difficulty_ratings.length > 0){
      let sum  = (this.activeProblem.difficulty + difficulty);
      let avg  = Math.round(sum/2);

      console.log("Has more than zero ratings.", this.activeProblem.difficulty_ratings.length, this.activeProblem.difficulty, difficulty, sum, avg);
      this.activeProblem.difficulty = avg;
    }else{
      console.log("Does not have more than zero ratings.");
      this.activeProblem.difficulty = difficulty;
    }

    console.log('after', difficulty, this.activeProblem);
    //Save Problem Rating to DB
    let newRating = {
      value: difficulty
    };

    this.ratingResource.create(newRating, this.authSrv.jwt)
    .then(success => {
      // console.log(success);
      this.activeProblem.difficulty_ratings.push(success);
      this.problemsRes.update(this.activeProblem)
      .then(success => {
        // console.log('Saved to db: ', this.activeProblem, success);
        this.activeProblem = success;
        this.close();
      })
      .catch(err => {
        console.error(err);
      })
    })
    .catch(err => {
      console.error(err);
    });
  }
  close() {
    this.viewCtrl.dismiss();
  }
}
