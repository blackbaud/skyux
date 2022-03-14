import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX label component.
 */
export class SkyLabelFixture {
  /**
   * The label's current type.
   */
  public get labelType(): string {
    const clsList = this.getLabelEl().nativeElement.classList;

    if (clsList.contains('sky-label-danger')) {
      return 'danger';
    }

    if (clsList.contains('sky-label-info')) {
      return 'info';
    }

    if (clsList.contains('sky-label-success')) {
      return 'success';
    }

    if (clsList.contains('sky-label-warning')) {
      return 'warning';
    }

    return undefined;
  }

  /**
   * The label's current text.
   */
  public get text(): string {
    const labelEl = this.getLabelEl();

    return SkyAppTestUtility.getText(labelEl);
  }

  private debugEl: DebugElement;

  constructor(fixture: ComponentFixture<any>, skyTestId: string) {
    this.debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-label'
    );
  }

  private getLabelEl(): DebugElement {
    return this.debugEl.query(By.css('.sky-label'));
  }
}
