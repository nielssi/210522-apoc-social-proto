import { Component } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';

// pages
import { Launch } from '../launch/launch';

//Services
import { AccountService } from '../../providers/account-service';

/*
  Generated class for the Walkthrough page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html'
})
export class Walkthrough {
  slides: any[] = [
    {
      title: "100s of exercises!",
      description: "Explore hundreds of advanced problems in organic chemistry, curated by leading scientists in the field.",
      image: "https://s3-eu-west-1.amazonaws.com/apoc.cindt.com/sliderImage1.png"
    },
    {
      title: "Track your progress!",
      description: "Track your progress by bookmarking, grouping, and discussing advanced problems in organic chemistry.",
      image: "https://s3-eu-west-1.amazonaws.com/apoc.cindt.com/sliderImage2.png"
    },
    {
      title: "Collaborative learning!",
      description: "With apoc, you can connect with peers all around the world to solve organic chemistry's toughest transformations, together.",
      image: "https://s3-eu-west-1.amazonaws.com/apoc.cindt.com/sliderImage3.png"
    },
    {
      title: "Help apoc get smart!",
      description: "apoc tracks your progress to help you customize your personal curriculum and learn more efficiently.",
      image: "https://s3-eu-west-1.amazonaws.com/apoc.cindt.com/sliderImage4.png"
    }
  ];
  @ViewChild(Slides) slider: Slides;
	public slidr : any;
  showSignupWithApoc: boolean = true;
  walkthroughSlideOptions: any;
  constructor(private nav: NavController, private accountService: AccountService) {

  }

  ionViewDidLoad() {
    console.log('Hello Walkthrough Page');
  }

  nextSlide() {
    this.slider.slideNext();
    console.log("nextSlide");
  }
  finishWalkthrough() {
    console.log("finishWalkthrough");
    this.saveWalkthrough();
    this.nav.setRoot(Launch, {animate: true});
  }

  saveWalkthrough(){
		return this.accountService.completeWalkthrough();
	}

  tappedContinueToLaunch() {
    this.saveWalkthrough()
    .then(()=>{
      console.log("User has completed the walkthrough.")
      this.nav.setRoot(Launch, {animate: true});
    })
    .catch((err)=>{
      console.error(err);
    });
  }
}
