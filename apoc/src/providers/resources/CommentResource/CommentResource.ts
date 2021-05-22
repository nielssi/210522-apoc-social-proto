import { Resource, ResourceParams } from "ng2-resource-rest";
import { Injectable } from "@angular/core";
import { AppSettings } from "../../app-settings";

@Injectable()
@ResourceParams({
    url: new AppSettings().API_PATH,
    path: '/comments/{id}',			// Api path
    headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
})

export class CommentResource extends Resource {
	public body: string;
	public images: any;
}

/**
Documentation for using ng2-resource-rest resources may be found here:
https://github.com/troyanskiy/ng2-resource-rest
*/
