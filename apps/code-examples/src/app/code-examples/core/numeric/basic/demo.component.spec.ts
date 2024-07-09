import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyNumericOptions } from '@skyux/core';

import { DemoComponent } from './demo.component';

describe('Basic numeric options', () => {
  async function setupTest(options?: {
    defaultValue?: number;
    configuredValue?: number;
    config?: SkyNumericOptions;
  }): Promise<{ fixture: ComponentFixture<DemoComponent> }> {
    const fixture = TestBed.createComponent(DemoComponent);

    if (options?.defaultValue !== undefined) {
      fixture.componentInstance.defaultValue = options.defaultValue;
    }

    if (options?.configuredValue !== undefined) {
      fixture.componentInstance.configuredValue = options.configuredValue;
    }

    if (options?.config !== undefined) {
      fixture.componentInstance.numericOptions = options.config;
    }

    fixture.detectChanges();
    await fixture.whenStable();

    return { fixture };
  }

  function getTextContent(
    fixture: ComponentFixture<DemoComponent>,
    selector: string,
  ): string {
    const el = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLSpanElement>(selector);

    return el?.textContent?.trim() ?? '';
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent],
    });
  });

  it('should show the expected number in the default format', async () => {
    const { fixture } = await setupTest({ defaultValue: 123456 });

    fixture.detectChanges();

    expect(getTextContent(fixture, '.default-value')).toEqual('123.5K');
  });

  it('should show the expected number in a specified format', async () => {
    const { fixture } = await setupTest({
      configuredValue: 5000000,
      config: { truncate: false },
    });

    expect(getTextContent(fixture, '.configured-value')).toEqual('5,000,000');
  });
});
