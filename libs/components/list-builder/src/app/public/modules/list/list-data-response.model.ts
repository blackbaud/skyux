import { ListItemModel } from './state/items/item.model';

 export class ListDataResponseModel {
   public count: number;
   public items: ListItemModel[];

   constructor(data?: any) {
     if (data !== undefined) {
       this.count = data.count;
       this.items = data.items;
     }
   }
 }
