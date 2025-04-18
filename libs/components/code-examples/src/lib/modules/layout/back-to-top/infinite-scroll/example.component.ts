import { Component, OnInit } from '@angular/core';
import { SkyBackToTopModule } from '@skyux/layout';
import { SkyInfiniteScrollModule, SkyRepeaterModule } from '@skyux/lists';

import { Person } from './person';

/**
 * @title Infinite scroll with back to top directive
 * @docsDemoHidden
 */
@Component({
  selector: 'app-layout-back-to-top-infinite-scroll-example',
  templateUrl: './example.component.html',
  imports: [SkyBackToTopModule, SkyInfiniteScrollModule, SkyRepeaterModule],
})
export class LayoutBackToTopInfiniteScrollExampleComponent implements OnInit {
  public hasMore = true;

  public personList: Person[] = [];

  public personDataSet = [
    {
      name: 'Barbara Durr',
      address: '7436 Fieldstone Court',
    },
    {
      name: 'Colton Chamberlain',
      address: '342 Foster Court',
    },
    {
      name: 'Alva Clifford',
      address: '657 West Rockville Street',
    },
    {
      name: 'Tonja Sanderson',
      address: '7004 Third Street',
    },
    {
      name: 'Paulene Baum',
      address: '9309 Mammoth Street',
    },
    {
      name: 'Jessy Witherspoon',
      address: '43 Canal Street',
    },
    {
      name: 'Solomon Hurley',
      address: '667 Wakehurst Circle',
    },
    {
      name: 'Calandra Geer',
      address: '164 Applegate Drive',
    },
    {
      name: 'Latrice Ashmore',
      address: '7965 Lake Road',
    },
    {
      name: 'Rod Tomlinson',
      address: '9664 Newport Drive',
    },
    {
      name: 'Cristen Sizemore',
      address: '17 Edgefield Street',
    },
    {
      name: 'Kristeen Lunsford',
      address: '245 Green Lake Street',
    },
    {
      name: 'Jack Lovett',
      address: '73 Academy Street',
    },
    {
      name: 'Elwood Farris',
      address: '90 Smoky Hollow Court',
    },
    {
      name: 'Ilene Woo',
      address: '71 Pumpkin Hill Street',
    },
    {
      name: 'Kanesha Hutto',
      address: '107 East Cooper Street',
    },
    {
      name: 'Nick Bourne',
      address: '62 Evergreen Street',
    },
    {
      name: 'Ed Sipes',
      address: '8824 Hill Street',
    },
    {
      name: 'Wonda Lumpkin',
      address: '134 North Warren Street',
    },
    {
      name: 'Cheyenne Lightfoot',
      address: '184 Pierce Avenue',
    },
    {
      name: 'Darcel Lenz',
      address: '9408 Beechwood Street',
    },
    {
      name: 'Martine Rocha',
      address: '871 Shadow Brook Street',
    },
    {
      name: 'Cherelle Connell',
      address: '649 Glenwood Street',
    },
    {
      name: 'Molly Seymour',
      address: '386 E. George Street',
    },
    {
      name: 'Clarice Overton',
      address: '16 Manchester Street',
    },
    {
      name: 'Eliza Vanhorn',
      address: '8232 S. Augusta Street',
    },
  ];

  public ngOnInit(): void {
    void this.#addData(0, 10);
  }

  public onScrollEnd(): void {
    void this.#addData(this.personList.length, 10);
  }

  async #addData(start: number, rowSize: number): Promise<void> {
    if (this.hasMore) {
      const result = await this.mockRemote(start, rowSize);
      this.personList = this.personList.concat(result.data);
      this.hasMore = result.hasMore;
    }
  }

  /**
   * Simulate a remote request.
   */
  private mockRemote(
    start: number,
    rowSize: number,
  ): Promise<{ data: Person[]; hasMore: boolean }> {
    const data: Person[] = [];

    for (let i = 0; i < rowSize; i++) {
      if (this.personDataSet[start + i]) {
        data.push(this.personDataSet[start + i]);
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data,
          hasMore: this.personList.length < this.personDataSet.length,
        });
      }, 1000);
    });
  }
}
