import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ModalController, AlertController, ToastController, ActionSheetController, Platform} from 'ionic-angular';
import { Headers, RequestOptions, Http } from '@angular/http';
import { AppSettings } from '../../providers/app-settings';

// Providers
import { AuthService } from '../../providers/auth-service';
import { RateProblemPopover } from './RateProblemPopover/RateProblemPopover.component';
import { AddAnswerModal } from './AddAnswerModal/AddAnswerModal.modal';
import { ProblemReferencesPopoverComponent } from './ProblemReferencesPopover/ProblemReferencesPopover';
import { SocketService } from '../../providers/socket.service';

//Components
import { ProblemImageModal } from './ProblemImageModal/ProblemImageModal.component';
import { ProblemSolutionModal } from './ProblemSolutionModal/ProblemSolutionModal.component';

//Resources
import { RatingResource } from '../../models/rating/rating';
import { CommentResource } from '../../models/comment/comment';
import { CommentReportResource } from '../../models/commentreport/commentreport';
import { Problems } from '../../providers/problems';
import { ActivitiesResource } from  '../../resources/activity.resource';

// Pages
import { GroupProblemSuggestionsPage } from '../../pages/group-problem-suggestions/group-problem-suggestions';
import { Feed } from '../../pages/feed/feed';
import { ProfilePublic } from '../profile-public/profile-public';
import { About } from '../about/about';
// import { CommentResource } from '../../resources/CommentResource/CommentResource';

@Component({
  selector: 'page-problem',
  templateUrl: 'problem.html'
})
export class Problem {
  activeProblem : any;
  activeComment : any;
  activeCommentIndex : number;
	assetUrlPrefix: string;
	assetUrlSuffix: string;
	newComment: CommentResource;
  currentUserId: string = '';
  private owner: any;
  private _id: any;

  constructor(private navCtrl: NavController, private params: NavParams,
              public platform: Platform,
              private popoverCtrl: PopoverController,
              public toastCtrl: ToastController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private authSrv: AuthService,
              private http: Http,
              private problemsRes: Problems,
              private activityRes: ActivitiesResource,
              public actionSheetCtrl: ActionSheetController,
              private socketSrv: SocketService) {

		this.activeProblem = this.params.get('activeProblem');
    console.log(this.activeProblem);
		this.assetUrlPrefix = new AppSettings().SERVER_URL+"/assets/images/problems/";
		this.assetUrlSuffix = "_Q.png";
		// this.addTestCommentstoQuestion();
    this.activeProblem.views = this.activeProblem.views++;
    // Increase problem views
    // this.increaseProblemViews(this.activeProblem);
    this.getQuestionDetail();
		this.initNewComment();
	}

  getQuestionDetail() {
    this.problemsRes.get(this.activeProblem._id)
    .then((success: any) => {
      //success.is_bookmarked = this.activeProblem.is_bookmarked
      this.activeProblem = success;
      this.activeProblem.is_bookmarked = this.authSrv.Profile.bookmarks.includes(this.activeProblem._id)
      this.activeProblem.is_solved = this.authSrv.Profile.solvedProblems.includes(this.activeProblem._id)
      console.log("Problem Detail ", success);
    })
    .catch(err => {
      console.error(err);
    });
  }

  ionViewDidLoad() {
    console.log('Hello Problem Page');
    this.currentUserId = this.authSrv.Profile._id;
  }

  public increaseProblemViews(problem: any) {
    this.problemsRes.update(problem)
    .then(success => {
      console.log(success)
    })
    .catch(err => {
      console.error(err);
    });

  }

	initNewComment(){
		this.newComment = new CommentResource(this.http);
    this.newComment.author = this.authSrv.Profile._id;
    this.newComment.author_name = this.authSrv.Profile.name;
    this.newComment.author_avatar = this.authSrv.Profile.avatar;

	}

	tappedAddAnAnswer(problem, $event){
		// Show Modal or Popover
		this.initNewComment();
    let modal = this.modalCtrl.create(AddAnswerModal, { activeProblem: problem, comment: this.newComment } );
		modal.onDidDismiss(res => {
      console.log(res.data.comment);
      if(res.data.comment){
        res.data.comment.problem = this.activeProblem._id;
        res.data.comment.create()
        .then(success => {
          console.log('new comment', success);
          //Add the Comment to the activeProblem
          this.activeProblem.comments.unshift(success);
          console.log(this.activeProblem);
          this.updateActiveProblem();
        })
        .catch(err => {
          console.error(err);
        });
      }else{
        console.log('comment was cancelled.');
      }
		});
	  modal.present();
	}

	tappedSendNewComment(comment){
		this.activeProblem.comments.unshift(comment);
		this.initNewComment();
	}

	getAssetUrl(gp_id){
		return this.assetUrlPrefix+gp_id+this.assetUrlSuffix;
	}

  getLocalAssetUrl(gp_id: number, problem?: any){
    if (this.platform.is('core')) {

      return '../../assets/img/problems/' + gp_id + '_Q.png'; //In browser
    }else{
      return './assets/img/problems/' + gp_id + '_Q.png'; //On Device
    }
	}

	presentProblemImageModal(activeProblem) {
	    let problemImageModal = this.modalCtrl.create(ProblemImageModal, {activeProblem: activeProblem });
	    problemImageModal.present();
	}

	addKeywordsToProblem(data){
		var keywords = data.keywords.split(',');
		keywords.forEach((keyword, idx) => {
			var dontAdd = false;
			//Loop throuh keywords
			this.activeProblem.keywords.forEach((item, idx)=>{
				if(keyword.trim().toLowerCase() == item.trim().toLowerCase()){
					//Is already in the list of keywords, should not add to list of keywords
					dontAdd = true;
				}
			});
			if(dontAdd){
				console.log("Not adding keywords: ", keyword);
				let toast = this.toastCtrl.create({
				  message: keyword+' has already been added to this problem.',
				  duration: 1300
				});
				toast.present();
			}else{
				this.activeProblem.keywords.push(keyword);
				let toast = this.toastCtrl.create({
				  message: keyword+' was successfully added to this problem.',
				  duration: 1800
				});
				toast.present();
			};
		});
    // Update problem;
    this.updateActiveProblemKeywords();
	}

	tappedAddRecommendedKeywords(){
		let keywordPrompt = this.alertCtrl.create({
		  title: 'Suggest Tags',
		  message: "Enter suitable keywords. Separate multiple keywords with a comma.",
		  inputs: [
		    {
		      name: 'keywords',
		      placeholder: 'carbonyl, radical, etc...'
		    },
		  ],
		  buttons: [
		    {
		      text: 'Cancel',
		      handler: data => {
		        console.log('Cancel clicked', data);
		      }
		    },
		    {
		      text: 'Add',
		      handler: data => {
		      	this.addKeywordsToProblem(data);
		      }
		    }
		  ]
		});
		keywordPrompt.present();
	}

	tappedRemoveRecommendedKeywords(keyword){
		this.activeProblem.keywords.splice(this.activeProblem.keywords.indexOf(keyword), 1);
    this.updateActiveProblemKeywords();
	}

	tappedMarkProblemComplete(problem: any){
		//Notify user that problem is not listed in his bookmarks.
		if(problem.is_solved){
			//Remove Problem from Users Completed Problems Array
			this.authSrv.Profile.solvedProblems = this.authSrv.Profile.solvedProblems.filter(item => {
				var shouldReturn = true;
				if (item == problem._id || item._id==problem._id) {
					shouldReturn = false;
				}
				return shouldReturn
			});

			//NEED TO: Save changes to user Profile to server
			this.authSrv.saveUpdatestoProfile()
			.then((success)=>{
				let toast = this.toastCtrl.create({
				  message: problem.name+' was marked unsolved.',
				  duration: 1300
				});
				toast.present();
			})
			.catch((err)=>{
				console.error(err)
			});
		}else{
			//Add Problem to Users Completed Problems Array
			this.authSrv.Profile.solvedProblems.push(problem._id);

			//NEED TO: Save changes to user Profile to server
			this.authSrv.saveUpdatestoProfile()
			.then((success)=>{
				console.log(success)
				let toast = this.toastCtrl.create({
				  message: problem.name+' was marked as solved.',
				  duration: 1300
				});
				toast.present();
			})
			.catch((err)=>{
				console.error(err)
			});
		}
		problem.is_solved = problem.is_solved ? false : true;
	}

	tappedBookmarkProblem(problem: any){
		//Add problem to list of bookmarks for this user.
		if(problem.is_bookmarked){
			this.authSrv.Profile.bookmarks = this.authSrv.Profile.bookmarks.filter(item => {
				var shouldReturn = true;
				if(item == problem._id || item._id==problem._id){
					shouldReturn = false;
				}
				return shouldReturn
			});

			//NEED TO: Save changes to user Profile to server
			this.authSrv.saveUpdatestoProfile()
			.then((success)=>{
				//Notify user that problem is not listed in his bookmarks.
				let toast = this.toastCtrl.create({
				  message: problem.name+' was successfully removed from your bookmarks.',
				  duration: 1300
				});
				toast.present();

			})
			.catch((err)=>{
				console.error(err)
			});
		}else{
			//Add Problem to Users Completed Problems Array
			this.authSrv.Profile.bookmarks.push(problem._id);

			//NEED TO: Save changes to user Profile to server
			this.authSrv.saveUpdatestoProfile()
			.then((success)=>{
				let toast = this.toastCtrl.create({
				  message: problem.name+' was successfully added to your bookmarks.',
				  duration: 1300
				});
				toast.present();

        let newActivity = {
          title: this.authSrv.Profile.name + ' bookmarked ',
          private_description: 'You bookmarked ',
          problem: problem._id
        };

        this.activityRes.create(newActivity, this.authSrv.jwt)
        .then(success => {
          console.log(success);
        })
        .catch(err => {
          console.error(err);
        });
			})
			.catch((err)=>{
				console.error(err)
			});
		}
		problem.is_bookmarked = problem.is_bookmarked ? false : true;
	}

	tappedRateProblemDifficulty(problem: any, $event: any) {
		// console.log("tappedRateProblemDifficulty", problem, $event);
    this.presentProblemDifficultyPopover($event, problem).then((success) => {
      console.log('success', JSON.stringify(success));
      this.updateActiveProblem();
    }, (err) =>  {
      console.log('error', err);
    });
    //this.updateActiveProblem();
	}

  presentProblemDifficultyPopover(myEvent: any, problem: any) {
    return new Promise((resolve, reject) => {
      //resolve(function difficulty() {
      console.log("does it get here? 1");
      let popover = this.popoverCtrl.create(RateProblemPopover, {
        activeProblem: problem,
        myRating: problem.myRating ? problem.myRating : 0
      }, {enableBackdropDismiss: true});
      popover.present({
        ev: myEvent
      });
      popover.onDidDismiss(() => {
        this.getQuestionDetail();
      });
      resolve('was happened!');
    //}());
      reject("error");
    });
    //popover.then((success) => {
      //this.activeProblem = this.params.get('activeProblem');
    //});
  }

	tappedProblemReferences(problem: any, $event: any) {
		// console.log("tappedProblemReferences", problem);
		//Add action menu
		let popover = this.popoverCtrl.create(ProblemReferencesPopoverComponent, { activeProblem: problem });
		popover.present({
		  ev: $event
		});
	}

	tappedNextProblem(current_problem: any){
		console.log("tappedNextProblem", current_problem);
	}
	tappedPreviousProblem(current_problem: any){
		console.log("tappedPreviousProblem", current_problem);
	}

	tappedDownVote(current_comment: any){
    // Check if already voted
    //
    let alreadyVoted = false;

    // Check if is own comment
    if(current_comment.author == this.authSrv.Profile._id){
      alreadyVoted = true;
    }

    // Remove opposite type of vote if needed
    current_comment.up_votes.forEach((itm, idx) => {
      if(itm.author == this.authSrv.Profile._id){
        current_comment.up_votes.splice(idx, 1);
      }
    });

    //
    current_comment.down_votes.forEach((itm, idx) => {
      if(itm.author == this.authSrv.Profile._id){
        alreadyVoted = true;
        current_comment.down_votes.splice(idx, 1);
      }
    });

    if(alreadyVoted){
      return
    }
    console.log("authSrv", this.authSrv.jwt)
    var comment = new CommentResource(this.http, this.authSrv.jwt);
    comment.init(current_comment);
    comment.downRating()
    .then(success => {
      console.log("downRating Comment ", success);
      this.activeProblem = success;
    })
    .catch(err => {
      console.error(err);
    });
    //
    // let rating = new RatingResource(this.http);
    // // console.log("tappedDownVote", current_comment, rating);
    // rating.value = -1;
    // rating.author = this.authSrv.Profile._id;
    // console.log('web token', this.authSrv.jwt)
    // rating.create(this.authSrv.jwt)
    // .then(success => {
    //   // console.log(success);
    //   // Add rating to comment;
    //   var comment = new CommentResource(this.http);
    //   comment.init(current_comment);
    //   // console.log(comment);
    //
    //   comment.down_votes.push(success);
    //   console.log("Before Update ", comment);
    //   comment.update()
    //   .then(success => {
    //     console.log("Updated Comment ", success);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
    //   console.log("current Comment ", current_comment);
    // })
    // .catch(err => {
    //   console.error(err);
    // });
	}

	tappedUpVote(current_comment: any){
		console.log("tappedUpVote", current_comment);
    // Check if already voted

    let alreadyVoted = false;

    // Check if is own comment
    if(current_comment.author == this.authSrv.Profile._id){
      alreadyVoted = true;
    }

    // Remove opposite type of vote if needed
    current_comment.down_votes.forEach((itm, idx) => {
      if(itm.author == this.authSrv.Profile._id){
        current_comment.down_votes.splice(idx, 1);
      }
    });

    current_comment.up_votes.forEach((itm, idx) => {
      if(itm.author == this.authSrv.Profile._id){
        alreadyVoted = true;
        current_comment.up_votes.splice(idx, 1);
      }
    });

    if(alreadyVoted){
      return
    }

    var comment = new CommentResource(this.http, this.authSrv.jwt);
    comment.init(current_comment);
    comment.upRating()
    .then(success => {
      console.log("upRating Comment ", success);
      this.activeProblem = success;
    })
    .catch(err => {
      console.error(err);
    });

    // let rating = new RatingResource(this.http);
    // rating.value = 1;
    // rating.author = this.authSrv.Profile._id;
    // rating.create(this.authSrv.jwt)
    // .then(success => {
    //   var comment = new CommentResource(this.http);
    //   comment.init(current_comment);
    //   comment.up_votes.push(success);
    //   comment.update()
    //   .then(success => {
    //     console.log("Updated Comment ", success);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
    // })
    // .catch(err => {
    //   console.error(err);
    // });
	}

	tappedCommentorProfilePhoto(current_comment: any){
		console.log("tappedCommentorProfilePhoto", current_comment);
	}

  isBookmarked() {
    this.authSrv.Profile.bookmarks.forEach((itm, idx) => {
      if(itm==this.activeProblem._id){
        this.activeProblem.is_bookmarked = true;
        console.log(this.activeProblem);
      }
    });
  }
  isComplete() {
    this.authSrv.Profile.solvedProblems.forEach((itm, idx) => {
      if(itm==this.activeProblem._id){
        this.activeProblem.is_solved = true;
        console.log(this.activeProblem);
      }
    });
  }

  navigateToReferences() {

  }

  openedReferences() {
    // Opened a browser window to this.activeProblem.link
    console.log('References for ', this.activeProblem);
    window.open(this.activeProblem.link, '_blank', 'location=yes');

  }

  presentSuggestedSolution() {
    //Display modal with fullscreen preview of problem solution.
    console.log('Suggested solution: ', this.activeProblem);
    let problemSolutionImageModal = this.modalCtrl.create(ProblemSolutionModal, {activeProblem: this.activeProblem });
    problemSolutionImageModal.present();
  }

  openedListofGroupsForSuggesting() {
    //Display list of groups
    console.log('displaying list of groups');
    this.navCtrl.push(GroupProblemSuggestionsPage, {activeProblem: this.activeProblem});

  }

  tappedMore(activeProblem: any) {
    let buttonArr = [];
    if(this.authSrv.Profile.groups.length > 0){
      buttonArr  = [
        {
          text: 'Look Up Reference',
          handler: () => {
            console.log('Look Up Reference clicked');
            this.openedReferences();
          }
        }, {
          text: 'View Suggested Solution',
          handler: () => {
            console.log('Opt 1: View Suggested Solution clicked');
            this.presentSuggestedSolution();
          }
        }, {
          text: 'Suggest this Problem to Group',
          handler: () => {
            console.log('Suggest Problem to Group clicked');

            let navTransition = actionSheet.dismiss();
            navTransition.then(() => {
              this.openedListofGroupsForSuggesting();
            });
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ];
    }else{
      buttonArr  = [
        {
          text: 'Look Up Reference',
          handler: () => {
            console.log('Look Up References clicked');
            this.openedReferences();
          }
        },
        {
          text: 'View Suggested Solution',
          handler: () => {
            console.log('View Suggested Solution clicked');
            this.presentSuggestedSolution();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ];
    }


    let actionSheet = this.actionSheetCtrl.create({
      title: 'More Options',
      buttons: buttonArr
    });
    actionSheet.present();


  }

  deleteActiveComment() {
    console.log("delete commend was pressed.", this.activeCommentIndex, this.activeProblem, this.activeComment);
    this.activeProblem.comments.splice(this.activeCommentIndex, 1);
    this.updateActiveProblem();
    let toast = this.toastCtrl.create({
      message: 'Problem was deleted successfully.',
      duration: 1000
    });
    toast.present();
  }

  reportActiveComment() {
    let report = new CommentReportResource(this.http);

    report.reporter = this.authSrv.Profile._id;
    report.problem = this.activeProblem._id;
    report.comment = this.activeComment._id;

    report.create(this.authSrv.jwt)
    .then(success => {
      console.log('comment was reported successfully', success);
      let toast = this.toastCtrl.create({
        message: 'Comment was reported successfully.',
        duration: 1000
      });
      toast.present();
    })
    .catch(err => {
      console.error(err);
    });
  }

  updateActiveProblem() {
    this.problemsRes.update(this.activeProblem)
    .then(success => {
      console.log('updateActiveProblem', success);
      this.activeProblem = success;
    })
    .catch(err => {
      console.error(err);
    });
  }

  public updateActiveProblemKeywords() {

    this.socketSrv.updateProblemKeywords(this.activeProblem)
    .subscribe(res => {
      console.log('received result in browse component: ', res);
    }, err => {
      console.error(err);
    }, () => {
      console.log('updateProblemKeywords done');
    });
  }

  didPressComment(comment: any, index: number) {
      console.log('show action sheet.', comment, index);
      this.activeComment = comment;
      this.activeCommentIndex = index;
      // Check if comment belongs to current user
      let buttonArr = [];
      if(comment.author == this.authSrv.Profile._id){
        buttonArr  = [
          {
            text: 'Report Comment',
            handler: () => {
              console.log('Report clicked');
              this.reportActiveComment();
            }
          },
          {
            text: 'Delete Comment',
            role: 'destructive',
            handler: () => {
              console.log('Delete clicked');
              this.deleteActiveComment();
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ];
      }else{
        buttonArr  = [
          {
            text: 'Report Comment',
            handler: () => {
              console.log('Report clicked');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ];
      }

      let actionSheet = this.actionSheetCtrl.create({
        title: 'Comment Options',
        buttons: buttonArr
      });
      actionSheet.present();
  }

  tappedComment(comment){
    console.log('tappedComment: ', comment);
    console.log('tappedComment stringify: ', JSON.stringify(comment));
    console.log('tappedComment stringify: ', comment.author);
  }


  tappedItemInHistory(comment: any) {
    console.log(comment);
    //this.navCtrl.push(ProfilePublic, { activeItem: item });
    let manufacturedItem = {
      'owner': {
        "_id": comment.author
      }
    };
    this.navCtrl.push(ProfilePublic, { activeItem: manufacturedItem });
  }

}
