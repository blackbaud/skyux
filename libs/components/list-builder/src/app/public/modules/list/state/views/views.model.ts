import { ListViewModel } from './view.model';

 export class ListViewsModel {
   public active: string;
   public views: ListViewModel[] = [];

   constructor(data?: any) {
     if (data) {
       this.active = data.active;
       this.views = data.views;
     }
  }
 }
