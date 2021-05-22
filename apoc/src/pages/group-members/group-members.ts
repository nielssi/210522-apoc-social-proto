import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// Services
import { AuthService } from '../../providers/auth-service';
import { SecurePage } from '../../providers/secure-page';

// Resources
import { GroupsResource } from '../../resources/group.resource';
// Pages
import { ProfilePublic } from '../../pages/profile-public/profile-public';

@Component({
  selector: 'page-group-members',
  templateUrl: 'group-members.html'
})
export class GroupMembers extends SecurePage {
  filterQuery: string = '';
	activeGroup: any = { members: [{name: 'test', bio: 'Testing 123'}] };
  constructor(public navCtrl: NavController, public authSrv: AuthService, private navParams: NavParams, public groupRes: GroupsResource) {
    super(authSrv, navCtrl);
    this.activeGroup = navParams.get('activeGroup');
    console.log(this.activeGroup);
    this.loadGroupDetail(this.activeGroup);
  }

  loadGroupDetail(group: any) {
    this.groupRes.get(group._id, this.authSrv.jwt)
    .then(success => {
      console.log('loadGroupDetail: ', success);
      // Load user detail for group


    })
    .catch(err => {
      console.error(err);
    })
  }

  ionViewDidLoad() {
    console.log('Hello GroupMembers Page');
  }

	filterGroupMembers(e) {
		console.log("filterGroupMembers")
	}

	clearSearchQuery() {
		this.filterQuery = '';
	}

  tappedGroupMember(member: any) {
    console.log('tappedGroupMember', member);
    this.nav.push(ProfilePublic, { activeMember: member });
  }
}
