import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable
} from '@angular/core';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  SkyWaitPageComponent
} from './wait-page.component';

import {
  SkyWaitPageAdapterService
} from './wait-page-adapter.service';

@Injectable()
export class SkyWaitService {
  private static waitComponent: SkyWaitPageComponent;
  private static pageWaitBlockingCount = 0;
  private static pageWaitNonBlockingCount = 0;

  constructor(
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private waitAdapter: SkyWaitPageAdapterService,
    private windowSvc: SkyWindowRefService
  ) {}

  public beginBlockingPageWait(): void {
    this.beginPageWait(true);
  }

  public beginNonBlockingPageWait(): void {
    this.beginPageWait(false);
  }

  public endBlockingPageWait(): void {
    this.endPageWait(true);
  }

  public endNonBlockingPageWait(): void {
    this.endPageWait(false);
  }

  public clearAllPageWaits(): void {
    this.clearPageWait(true);
    this.clearPageWait(false);
  }

  public dispose(): void {
    if (SkyWaitService.waitComponent) {
      SkyWaitService.waitComponent = undefined;
      SkyWaitService.pageWaitBlockingCount = 0;
      SkyWaitService.pageWaitNonBlockingCount = 0;
      this.waitAdapter.removePageWaitEl();
    }
  }

  private setWaitComponentProperties(isBlocking: boolean): void {
    if (isBlocking) {
      SkyWaitService.waitComponent.hasBlockingWait = true;
      SkyWaitService.pageWaitBlockingCount++;
    } else {
      SkyWaitService.waitComponent.hasNonBlockingWait = true;
      SkyWaitService.pageWaitNonBlockingCount++;
    }
  }

  private beginPageWait(isBlocking: boolean): void {
    if (!SkyWaitService.waitComponent) {
      /*
          Dynamic component creation needs to be done in a timeout to prevent ApplicationRef from
          crashing when wait service is called in Angular lifecycle functions.
      */
      this.windowSvc.getWindow().setTimeout(() => {
        const factory = this.resolver.resolveComponentFactory(SkyWaitPageComponent);
        this.waitAdapter.addPageWaitEl();

        const cmpRef = this.appRef.bootstrap(factory);
        SkyWaitService.waitComponent = cmpRef.instance;

        this.setWaitComponentProperties(isBlocking);
      });

    } else {
      this.setWaitComponentProperties(isBlocking);
    }

  }

  private endPageWait(isBlocking: boolean): void {
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

  private clearPageWait(isBlocking: boolean): void {
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
