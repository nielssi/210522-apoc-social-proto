import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RecommendationsBookmarksPage } from './recommendations-bookmarks/recommendations-bookmarks';
import { RecommendationsDifficultyPage } from './recommendations-difficulty/recommendations-difficulty';

/*
  Generated class for the Recommendations page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-recommendations',
  templateUrl: 'recommendations.html'
})
export class RecommendationsPage {
  public tab1: any = RecommendationsBookmarksPage;
  public tab2: any = RecommendationsDifficultyPage;

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {

  }

}
