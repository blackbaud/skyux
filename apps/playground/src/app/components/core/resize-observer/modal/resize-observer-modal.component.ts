import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
import {
  SkyModalConfigurationInterface,
  SkyModalInstance,
  SkyModalModule,
  SkyModalService,
} from '@skyux/modals';
import { SkySectionedFormComponent, SkySectionedFormModule } from '@skyux/tabs';

type SizeOptions = 'small' | 'medium' | 'large';

let identifier = 1;

@Component({
  selector: 'app-resize-observer-modal',
  templateUrl: './resize-observer-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyModalModule, SkySectionedFormModule],
})
export class ResizeObserverModalComponent implements AfterViewInit, OnInit {
  @ViewChild(SkySectionedFormComponent)
  public sectionedFormComponent: SkySectionedFormComponent;

  public breakpoint = '(breakpoint not set)';

  public tabsHidden = false;

  public get headingText(): string {
    return `Modal title | Breakpoint: ${this.breakpoint}`;
  }

  public sizes: SizeOptions[] = ['small', 'medium', 'large'];

  public identifier: number;

  constructor(
    public modalInstance: SkyModalInstance,
    private changeDetectorRef: ChangeDetectorRef,
    private mediaQueryService: SkyMediaQueryService,
    private modalService: SkyModalService,
    @Inject('size') public size: string,
  ) {
    this.identifier = identifier++;
  }

  public ngOnInit(): void {
    this.mediaQueryService.subscribe((breakpoint) => {
      switch (breakpoint) {
        case SkyMediaBreakpoints.xs:
          this.breakpoint = 'SkyMediaBreakpoints.xs';
          break;
        case SkyMediaBreakpoints.sm:
          this.breakpoint = 'SkyMediaBreakpoints.sm';
          break;
        case SkyMediaBreakpoints.md:
          this.breakpoint = 'SkyMediaBreakpoints.md';
          break;
        case SkyMediaBreakpoints.lg:
          this.breakpoint = 'SkyMediaBreakpoints.lg';
          break;
        default:
          this.breakpoint = `(other breakpoint: ${JSON.stringify(breakpoint)})`;
      }
      if (typeof console === 'object') {
        console.log(
          `${this.size} modal ${this.identifier}: ${this.breakpoint}`,
        );
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  public ngAfterViewInit(): void {
    this.tabsHidden = !this.sectionedFormComponent.tabsVisible();
    if (this.tabsHidden) {
      this.changeDetectorRef.markForCheck();
    }
  }

  public showTabs(): void {
    this.sectionedFormComponent.showTabs();
  }

  public openAnotherModal(size: SizeOptions): void {
    const modalInstanceType = ResizeObserverModalComponent;
    const options: SkyModalConfigurationInterface = {
      size,
      providers: [
        {
          provide: 'size',
          useValue: size,
        },
      ],
    };
    this.modalService.open(modalInstanceType, options);
  }
}
