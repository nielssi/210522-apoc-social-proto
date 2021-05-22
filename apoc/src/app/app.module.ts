import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { Device } from 'ionic-native';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { File } from '@ionic-native/file';


import { MyApp } from './app.component';
//Pages
import { Walkthrough } from '../pages/walkthrough/walkthrough';
import { Login } from '../pages/login/login';
import { PasswordResetModal } from '../pages/login/password-reset-modal/PasswordResetModal.component';
import { Signup } from '../pages/signup/signup';
import { SelectLoginTypePage } from '../pages/select-login-type/select-login-type';

import { Launch } from '../pages/launch/launch';
import { LoadingLaunch } from '../pages/loading-launch/loading-launch';
import { Feed } from '../pages/feed/feed';
import { History } from '../pages/history/history';
import { RandomQuestion } from '../pages/random-question/random-question';
import { Explore } from '../pages/explore/explore';
import { Settings } from '../pages/settings/settings';
import { Profile } from '../pages/profile/profile';
import { EditProfile } from '../pages/edit-profile/edit-profile';
import { ProfilePublic } from '../pages/profile-public/profile-public';
import { GroupsPage } from '../pages/groups/groups';
import { GroupsIsMemberPage } from '../pages/groups/groups-is-member/groups-is-member';
import { GroupsRecommendedPage } from '../pages/groups/groups-recommended/groups-recommended';

import { RecommendationsPage } from '../pages/recommendations/recommendations';
import { RecommendationsBookmarksPage } from '../pages/recommendations/recommendations-bookmarks/recommendations-bookmarks';
import { RecommendationsDifficultyPage } from '../pages/recommendations/recommendations-difficulty/recommendations-difficulty';
import { GroupHomePage } from '../pages/group-home/group-home';

import { GroupSettings } from '../pages/group-settings/group-settings';
import { GroupProblems } from '../pages/group-problems/group-problems';
import { GroupMembers } from '../pages/group-members/group-members';
import { GroupDiscussions } from '../pages/group-discussions/group-discussions';

import { Bookmarks } from '../pages/bookmarks/bookmarks';
import { About } from '../pages/about/about';
import { GroupProblemSuggestionsPage } from '../pages/group-problem-suggestions/group-problem-suggestions';
import { Problem } from '../pages/problem/problem';      // Not sure what is causing the related error, commenting out for now.
import { BrowseCategoriesPage } from '../pages/browse-categories/browse-categories'
import { BrowseModifiersPage } from '../pages/browse-modifiers/browse-modifiers'
import { BrowseInterPage } from '../pages/browse-inter/browse-inter'
import { BrowseProblemsPage } from '../pages/browse-problems/browse-problems'

// Popovers

import { RateProblemPopover } from '../pages/problem/RateProblemPopover/RateProblemPopover.component';
import { AddAnswerModal } from '../pages/problem/AddAnswerModal/AddAnswerModal.modal';
import { ProblemImageModal } from '../pages/problem/ProblemImageModal/ProblemImageModal.component';
import { ProblemSolutionModal } from '../pages/problem/ProblemSolutionModal/ProblemSolutionModal.component';

import { ProblemReferencesPopoverComponent } from '../pages/problem/ProblemReferencesPopover/ProblemReferencesPopover';

// Resources
import { ResourceModule } from 'ng2-resource-rest';
import { Problems } from '../providers/problems';
import { CategoriesProvider } from '../providers/categories.provider';
import { ActivitiesResource } from '../resources/activity.resource';
import { RatingsResource } from '../resources/rating.resource';
import { GroupsResource } from '../resources/group.resource';
// import { ProblemResource } from '../resources/problem.resource';
// import { Activity } from '../providers/resources/Activity/Activity';

// Services

import { AccountService } from '../providers/account-service';
import { AuthService } from '../providers/auth-service';
import { AppSettings } from '../providers/app-settings';
import { AwsS3 } from '../providers/aws-s3';
import { SocketService } from '../providers/socket.service';
import { ImageService } from '../providers/image.service';

// Pipes
import { SanitizeHtml } from '../pipes/sanitize-html-pipe/sanitize-html.pipe';
import { TimeAgoPipe } from '../pipes/time-ago-pipe/time-ago.pipe';
import { BrowseSearchPipe } from '../pipes/BrowseSearchPipe/browse-search.pipe';

// Directives - validators
import { EmailValidatorDirective } from '../validators/email-validator.directive';

// Pouches
import { ProblemPouch } from  '../pouches/problem.pouch';
import { UserPouch } from  '../pouches/user.pouch';

@NgModule({
  declarations: [
    MyApp,
    Login,
    Signup,
    SelectLoginTypePage,
    Launch,
    LoadingLaunch,
    Feed,
    BrowseCategoriesPage,
    BrowseModifiersPage,
    BrowseInterPage,
    BrowseProblemsPage,
    History,
    RandomQuestion,
    Explore,
    Settings,
    Problem,
    Profile,
    EditProfile,
    ProfilePublic,
    GroupHomePage,
    GroupsPage,
    GroupsRecommendedPage,
    GroupsIsMemberPage,
    RecommendationsPage,
    RecommendationsBookmarksPage,
    RecommendationsDifficultyPage,
    GroupSettings,
    GroupDiscussions,
    GroupMembers,
    GroupProblems,
    GroupProblemSuggestionsPage,
    Bookmarks,
    About,
    Walkthrough,
    // Validators
    EmailValidatorDirective,
    // Modals
    PasswordResetModal,
    ProblemReferencesPopoverComponent,
    ProblemImageModal,
    ProblemSolutionModal,
    AddAnswerModal,
    PasswordResetModal,
    // Popovers
    RateProblemPopover,

    // Pipes
    SanitizeHtml,
    TimeAgoPipe,
    BrowseSearchPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ResourceModule.forRoot(),
    IonicModule.forRoot(MyApp, {}, {
       links: [
        { component: Feed, name: 'Feed', segment: 'feed' },
        { component: History, name: 'History', segment: 'history' },
        { component: Bookmarks, name: 'Bookmarks', segment: 'bookmarks' },
        { component: RandomQuestion, name: 'RandomQuestion', segment: 'randomquestion' },
        { component: GroupsPage, name: 'Groups', segment: 'groups' },
        { component: GroupHomePage, name: 'GroupHomePage', segment: 'grouphomepage' },
        { component: GroupDiscussions, name: 'GroupDiscussions', segment: 'groupdiscussions' },
        { component: GroupMembers, name: 'GroupMembers', segment: 'groupmembers' },
        { component: GroupProblems, name: 'GroupProblems', segment: 'groupproblems' },
        { component: GroupSettings, name: 'GroupSettings', segment: 'groupsettings' },
        { component: About, name: 'About', segment: 'about' },
        { component: Settings, name: 'Settings', segment: 'settings' },
      ]
    }),
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['sqlite', 'websql', 'indexeddb']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Walkthrough,
    Login,
    Signup,
    SelectLoginTypePage,
    Launch,
    LoadingLaunch,
    Feed,
    BrowseCategoriesPage,
    BrowseModifiersPage,
    BrowseInterPage,
    BrowseProblemsPage,
    History,
    RandomQuestion,
    Explore,
    Settings,
    Problem,
    Profile,
    EditProfile,
    ProfilePublic,
    GroupHomePage,
    GroupsPage,
    GroupsRecommendedPage,
    GroupsIsMemberPage,
    RecommendationsPage,
    RecommendationsBookmarksPage,
    RecommendationsDifficultyPage,
    GroupSettings,
    GroupDiscussions,
    GroupMembers,
    GroupProblems,
    Bookmarks,
    About,
    GroupProblemSuggestionsPage,
    // Popovers
    RateProblemPopover,
    // Modals
    AddAnswerModal,
    ProblemImageModal,
    ProblemSolutionModal,
    PasswordResetModal,
  ],
  providers: [
    AuthService,
    AccountService,
    AppSettings,
    Problems,
    CategoriesProvider,
    ActivitiesResource,
    RatingsResource,
    GroupsResource,
    Device,
    FileTransfer, FileTransferObject,
    File,
    AwsS3,
    SocketService,
    ProblemPouch,
    UserPouch,
    ImageService

    // Resources
    // ProblemResource,
  ]
})
export class AppModule {}
