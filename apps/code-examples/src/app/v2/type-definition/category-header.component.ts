import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

type Category =
  | 'blue'
  | 'light-blue'
  | 'orange'
  | 'purple'
  | 'red'
  | 'teal'
  | 'yellow';

@Component({
  host: {
    '[class]': "'sky-docs-category-header-' + category()",
  },
  imports: [NgClass],
  selector: 'sky-docs-category-header',
  styles: `
    :host {
      display: block;
      // border-left: 3px solid grey;
      // padding-left: 10px;
    }

    .subheading {
      // display: inline-block;
      // background-color: grey;
      // color: #fff;
      // padding: 2px 7px;
      // border-radius: 6px;
      // font-weight: bold;
      // font-size: 10px;
      // text-transform: uppercase;
      display: none;
      font-size: 13px;
      margin-top: -15px;
    }

    // .subheading:before {
    //   content: '';
    //   width: 3px;
    //   height: 16px;
    //   display: inline-block;
    //   background-color: grey;
    // }

    :host(.sky-docs-category-header-blue) {
      border-color: #006ea8;
      .subheading {
        color: #006ea8;
      }
    }

    :host(.sky-docs-category-header-light-blue) {
      border-color: #079cda;
      .subheading {
        color: #079cda;
      }
    }

    :host(.sky-docs-category-header-orange) {
      border-color: #dc7821;
      .subheading {
        color: #dc7821;
      }
    }

    :host(.sky-docs-category-header-purple) {
      border-color: #490285;
      .subheading {
        color: #490285;
      }
    }

    :host(.sky-docs-category-header-red) {
      border-color: #8f0043;
      .subheading {
        color: #8f0043;
      }
    }

    :host(.sky-docs-category-header-teal) {
      border-color: #04a87d;
      .subheading {
        color: #04a87d;
      }
    }

    :host(.sky-docs-category-header-yellow) {
      border-color: #ba8d02;
      .subheading {
        color: #ba8d02;
      }
    }
  `,
  template: ` <ng-content />
    <div class="subheading">{{ categoryLabel() }}</div>`,
})
export class SkyDocsCategoryHeader {
  public categoryLabel = input.required<string>();
  public category = input.required<Category>();
}
