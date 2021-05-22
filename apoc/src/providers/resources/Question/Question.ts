import {Resource, ResourceParams} from "ng2-resource-rest";
import {Injectable} from "@angular/core";
import { AppSettings } from "../../app-settings";

@Injectable()
@ResourceParams({
    url: new AppSettings().API_URL+'/api/',		// Url to api
    path: '/questions/{id}'			// Api path
})

export class Question extends Resource {}

/**
Documentation for using ng2-resource-rest resources may be found here:
https://github.com/troyanskiy/ng2-resource-rest
*/
