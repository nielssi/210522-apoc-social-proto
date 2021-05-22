import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
// Resources
import { Problems } from '../../../providers/problems';

@Component({
  selector: 'page-recommendations-difficulty',
  templateUrl: 'recommendations-difficulty.html'
})
export class RecommendationsDifficultyPage {
  public recommendedProblems: any[] = [];
  constructor(public navCtrl: NavController,
              private problemsRes: Problems,
              private loadingCtrl: LoadingController) {}

  ionViewDidLoad() {
    console.log('Hello RecommendationsDifficultyPage Page');
    this.loadProblemRecommendations()
  }

  loadProblemRecommendations() {
    let loader = this.showLoadingMessage("Loading Recommendations", 10000);
    this.problemsRes.recommendations('difficulty')
    .subscribe(problems => {
      console.log('problems: ',problems);
      loader.dismiss();
    }, err => {
      console.error(err);
      loader.dismiss();
    })
  }

  showLoadingMessage(message :string, duration?:number, callback?): Loading{
		let loader = this.loadingCtrl.create({
			content: message,
			dismissOnPageChange: false
		});
		loader.present();

		setTimeout(() => {
			if(callback){
				callback()
			}
		}, duration);

		return loader;
	}


}
