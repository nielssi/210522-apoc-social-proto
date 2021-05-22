import { Injectable } from '@angular/core';
import { Resource, ResourceParams, ResourceAction, ResourceMethod, ResourceCRUD } from 'ng2-resource-rest';
import { RequestMethod } from '@angular/http';
import { AppSettings } from "../providers/app-settings";
import { ProblemModel } from '../models/problem/problem.model';

let appSettings: AppSettings = new AppSettings();

export interface IQueryInput {
  page?: number;
  perPage?: number;
  dateFrom?: string;
  dateTo?: string;
  isRead?: string;
}

export interface IProblemShort {
  _id: string;
}

export interface IProblemFull extends ProblemModel, IProblemShort {

}

@Injectable()
@ResourceParams({
  url: appSettings.API_URL + '/api/problems'
})
export class ProblemResource extends ResourceCRUD<IQueryInput, IProblemShort, IProblemFull> {

  // @ResourceAction({
  //   method: RequestMethod.Get,
  //   path: '/me'
  // })
  // myProjects: ResourceMethod<IQueryInput, IProjectFull>;

}
