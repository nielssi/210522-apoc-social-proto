import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, Loading } from 'ionic-angular';
// Resources
import { Problems } from '../../../providers/problems';

// Pages
import { Problem } from '../../../pages/problem/problem';

@Component({
  selector: 'page-recommendations-bookmarks',
  templateUrl: 'recommendations-bookmarks.html'
})
export class RecommendationsBookmarksPage {
  public recommendedProblems: any[] = [];
  constructor(public navCtrl: NavController,
              private problemsRes: Problems,
              public platform: Platform,
              private loadingCtrl: LoadingController) {}

  ionViewDidLoad() {
    console.log('Hello RecommendationsBookmarksPage Page');
    this.loadProblemRecommendations()
  }

  loadProblemRecommendations() {
    let loader = this.showLoadingMessage("Loading Recommendations", 10000);
    this.problemsRes.recommendations('bookmarks')
    .subscribe(response => {
      console.log('recommendations: ', response.json());
      this.recommendedProblems = response.json();
      loader.dismiss();
    }, err => {
      console.error(err);
      loader.dismiss();
    })
  }

  getLocalAssetUrl(gp_id: number, problem?: any){
    if (this.platform.is('core')) {
      return '../../assets/img/problems/' + gp_id + '_Q.png'; //In browser
    }else{
      return './assets/img/problems/' + gp_id + '_Q.png'; //On Device
    }
	}

  tappedProblem(problem){
    problem.views = problem.views + 1;
		this.navCtrl.push(Problem, {activeProblem: problem});
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
