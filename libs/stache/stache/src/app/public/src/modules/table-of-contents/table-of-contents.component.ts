import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { StacheNav, StacheNavLink } from '../nav';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'stache-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StacheTableOfContentsComponent implements StacheNav, AfterViewInit {
  @Input()
  public routes: StacheNavLink[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  public ngAfterViewInit() {
    this.cdr.markForCheck();
  }
}
