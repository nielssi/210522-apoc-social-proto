import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//Resources

//Pages
// import { Problem } from '../Problem/Problem';
// import { Feed } from '../Feed/Feed';

/*
  Generated class for the RandomQuestion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-random-question',
  templateUrl: 'random-question.html'
})
export class RandomQuestion {
  featuredProblem:any;
	randomProblem: any[];
	didLoadRandomQuestion: boolean = false;
  constructor(private nav: NavController) {


  }

  ionViewDidLoad() {
    console.log('Hello RandomQuestion Page');
  }

	getRandomProblem(refresher?){

		// this.problemRes.random({})
		// .then((problem:any) => {
		// 	this.didLoadRandomQuestion = true;
		// 	this.randomProblem = problem;
		// 	if(refresher){
		// 		refresher.complete();
		// 	}
		// 	this.nav.push(Problem, {activeProblem: this.randomProblem });
		// })
		// .catch((err) => {
		// 	console.error(err);
		// });
	}
}
