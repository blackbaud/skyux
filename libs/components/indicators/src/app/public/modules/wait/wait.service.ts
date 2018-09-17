import {
  ComponentFactoryResolver,
  ApplicationRef,
  Injectable
} from '@angular/core';

import {
  SkyWaitPageComponent
} from './wait-page.component';

import {
  SkyWaitPageAdapterService
} from './wait-page-adapter.service';
import {
  SkyWindowRefService
} from '@skyux/core';

@Injectable()
export class SkyWaitService {

  private static waitComponent: SkyWaitPageComponent;
  private static pageWaitBlockingCount: number = 0;
  private static pageWaitNonBlockingCount: number = 0;

  constructor(
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private waitAdapter: SkyWaitPageAdapterService,
    private windowSvc: SkyWindowRefService
    ) {}

  public beginBlockingPageWait() {
    this.beginPageWait(true);
  }

  public beginNonBlockingPageWait() {
    this.beginPageWait(false);
  }

  public endBlockingPageWait() {
    this.endPageWait(true);
  }

  public endNonBlockingPageWait() {
    this.endPageWait(false);
  }

  public clearAllPageWaits() {
    this.clearPageWait(true);
    this.clearPageWait(false);
  }

  public dispose() {
    if (SkyWaitService.waitComponent) {
      SkyWaitService.waitComponent = undefined;
      SkyWaitService.pageWaitBlockingCount = 0;
      SkyWaitService.pageWaitNonBlockingCount = 0;
      this.waitAdapter.removePageWaitEl();
    }
  }

  private setWaitComponentProperties(isBlocking: boolean) {
    if (isBlocking) {
      SkyWaitService.waitComponent.hasBlockingWait = true;
      SkyWaitService.pageWaitBlockingCount++;
    } else {
      SkyWaitService.waitComponent.hasNonBlockingWait = true;
      SkyWaitService.pageWaitNonBlockingCount++;
    }
  }

  private beginPageWait(isBlocking: boolean) {
    if (!SkyWaitService.waitComponent) {
      /*
          Dynamic component creation needs to be done in a timeout to prevent ApplicationRef from
          crashing when wait service is called in Angular lifecycle functions.
      */
      this.windowSvc.getWindow().setTimeout(() => {
        let factory = this.resolver.resolveComponentFactory(SkyWaitPageComponent);

        this.waitAdapter.addPageWaitEl();

        let cmpRef = this.appRef.bootstrap(factory);

        SkyWaitService.waitComponent = cmpRef.instance;

        this.setWaitComponentProperties(isBlocking);
      });

    } else {
      this.setWaitComponentProperties(isBlocking);
    }

  }

  private endPageWait(isBlocking: boolean) {
    /*
        Needs to yield so that wait creation can finish
        before it is dismissed in the event of a race.
    */
    this.windowSvc.getWindow().setTimeout(() => {
      if (SkyWaitService.waitComponent) {
        if (isBlocking) {
          if (SkyWaitService.pageWaitBlockingCount > 0) {
            SkyWaitService.pageWaitBlockingCount--;
          }

          if (SkyWaitService.pageWaitBlockingCount < 1) {
            SkyWaitService.waitComponent.hasBlockingWait = false;
          }
        } else {
          if (SkyWaitService.pageWaitNonBlockingCount > 0) {
            SkyWaitService.pageWaitNonBlockingCount--;
          }

          if (SkyWaitService.pageWaitNonBlockingCount < 1) {
            SkyWaitService.waitComponent.hasNonBlockingWait = false;
          }
        }
      }
    });
  }

  private clearPageWait(isBlocking: boolean) {
    if (SkyWaitService.waitComponent) {
      if (isBlocking) {
        SkyWaitService.pageWaitBlockingCount = 0;
        SkyWaitService.waitComponent.hasBlockingWait = false;
      } else {
        SkyWaitService.pageWaitNonBlockingCount = 0;
        SkyWaitService.waitComponent.hasNonBlockingWait = false;
      }
    }
  }
}
