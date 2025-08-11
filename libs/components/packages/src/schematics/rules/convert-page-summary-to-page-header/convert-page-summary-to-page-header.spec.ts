import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { firstValueFrom } from 'rxjs';

import { createTestApp } from '../../testing/scaffold';

import { convertPageSummaryToPageHeader } from './convert-page-summary-to-page-header';

describe('Convert Page Summary to Page Header', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  it('should convert page summary to page header', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-page-summary>
        <sky-page-summary-alert>
          <sky-alert alertType="info"> This is an alert. </sky-alert>
        </sky-page-summary-alert>
        <sky-page-summary-image>
          <sky-avatar [name]="name" [canChange]="true" />
        </sky-page-summary-image>
        <sky-page-summary-title>
          {{ name }}
        </sky-page-summary-title>
        <sky-page-summary-subtitle> Board member </sky-page-summary-subtitle>
        <sky-page-summary-status>
          <sky-label labelType="success"> Fundraiser </sky-label>
          <sky-label> Inactive </sky-label>
        </sky-page-summary-status>
        <sky-page-summary-content>
          This is the arbitrary content section. You can display any kind of content
          to complement the content on a page. We recommend that you display content
          to support the key tasks of users of users who visit the page. We also
          recommend that you keep in mind the context of how users will use the
          content and limit the amount of content to avoid overloading the summary.
        </sky-page-summary-content>
        <sky-page-summary-key-info>
          <sky-key-info>
            <sky-key-info-value> $1,500 </sky-key-info-value>
            <sky-key-info-label> Largest gift </sky-key-info-label>
          </sky-key-info>
          <sky-key-info>
            <sky-key-info-value> 37 </sky-key-info-value>
            <sky-key-info-label> Total gifts </sky-key-info-label>
          </sky-key-info>
        </sky-page-summary-key-info>
      </sky-page-summary>
    `;
    tree.create('src/app/test.component.html', input);
    const output = stripIndents`
      <sky-page-header pageTitle="{{ name }}">
        <sky-page-header-alerts>
          <sky-alert alertType="info"> This is an alert. </sky-alert>
        </sky-page-header-alerts>
        <sky-page-header-avatar>
          <sky-avatar [name]="name" [canChange]="true" />
        </sky-page-header-avatar>
        <sky-page-header-details>
          <div class="sky-margin-stacked-sm">
            Board member
          </div>
          <div class="sky-margin-stacked-md">
            <sky-label labelType="success"> Fundraiser </sky-label>
            <sky-label> Inactive </sky-label>
          </div>
          <div class="sky-margin-stacked-md">
            This is the arbitrary content section. You can display any kind of content
            to complement the content on a page. We recommend that you display content
            to support the key tasks of users of users who visit the page. We also
            recommend that you keep in mind the context of how users will use the
            content and limit the amount of content to avoid overloading the summary.
          </div>
          <div class="sky-margin-stacked-md">
            <sky-key-info>
              <sky-key-info-value> $1,500 </sky-key-info-value>
              <sky-key-info-label> Largest gift </sky-key-info-label>
            </sky-key-info>
            <sky-key-info>
              <sky-key-info-value> 37 </sky-key-info-value>
              <sky-key-info-label> Total gifts </sky-key-info-label>
            </sky-key-info>
          </div>
        </sky-page-header-details>
      </sky-page-header>
    `;
    await firstValueFrom(
      runner.callRule(convertPageSummaryToPageHeader(''), tree),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      output,
    );
  });

  it('should convert page summary to page header when there is a single detail element', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-page-summary>
        <sky-page-summary-alert>
          <sky-alert alertType="info"> This is an alert. </sky-alert>
        </sky-page-summary-alert>
        <sky-page-summary-image>
          <sky-avatar [name]="name" [canChange]="true" />
        </sky-page-summary-image>
        <sky-page-summary-title>
          {{ name }}
        </sky-page-summary-title>
        <sky-page-summary-subtitle> Board member </sky-page-summary-subtitle>
      </sky-page-summary>
    `;
    tree.create('src/app/test.component.html', input);
    const output = stripIndents`
      <sky-page-header pageTitle="{{ name }}">
        <sky-page-header-alerts>
          <sky-alert alertType="info"> This is an alert. </sky-alert>
        </sky-page-header-alerts>
        <sky-page-header-avatar>
          <sky-avatar [name]="name" [canChange]="true" />
        </sky-page-header-avatar>
        <sky-page-header-details>
          <div class="sky-margin-stacked-sm">
            Board member
          </div>
        </sky-page-header-details>
      </sky-page-header>
    `;
    await firstValueFrom(
      runner.callRule(convertPageSummaryToPageHeader(''), tree),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      output,
    );
  });

  it('should convert page summary to page header without a title', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-page-summary>
        <sky-page-summary-alert>
          <sky-alert alertType="info"> This is an alert. </sky-alert>
        </sky-page-summary-alert>
      </sky-page-summary>
    `;
    tree.create('src/app/test.component.html', input);
    const output = stripIndents`
      <sky-page-header pageTitle="">
        <sky-page-header-alerts>
          <sky-alert alertType="info"> This is an alert. </sky-alert>
        </sky-page-header-alerts>
      </sky-page-header>
    `;
    await firstValueFrom(
      runner.callRule(convertPageSummaryToPageHeader(''), tree),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      output,
    );
  });

  it('should do nothing', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    tree.create('src/app/test.component.html', '<sky-page-summary');
    await firstValueFrom(
      runner.callRule(convertPageSummaryToPageHeader(''), tree),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      '<sky-page-summary',
    );
  });

  it('should convert inline template', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const backtick = '`';
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkyPageSummaryModule } from '@skyux/layout';

      @Component({
        selector: 'app-test',
        template: ${backtick}
          <sky-page-summary>
            <sky-page-summary-alert>
              <sky-alert alertType="info"> This is an alert. </sky-alert>
            </sky-page-summary-alert>
            <sky-page-summary-image>
              <sky-avatar [name]="name" [canChange]="true" />
            </sky-page-summary-image>
            <sky-page-summary-title>
              {{ name }}
            </sky-page-summary-title>
          </sky-page-summary>
        ${backtick},
        imports: [SkyPageSummaryModule],
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    const output = stripIndents`
      import { Component } from '@angular/core';

      import { SkyPageModule } from '@skyux/pages';

      @Component({
        selector: 'app-test',
        template: ${backtick}
          <sky-page-header pageTitle="{{ name }}">
            <sky-page-header-alerts>
              <sky-alert alertType="info"> This is an alert. </sky-alert>
            </sky-page-header-alerts>
            <sky-page-header-avatar>
              <sky-avatar [name]="name" [canChange]="true" />
            </sky-page-header-avatar>

          </sky-page-header>
        ${backtick},
        imports: [SkyPageModule],
      })
      export class TestComponent {}
    `;
    await firstValueFrom(
      runner.callRule(convertPageSummaryToPageHeader(''), tree),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      output,
    );
  });

  it('should fail for complex titles', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-page-summary>
        <sky-page-summary-alert>
          <sky-alert alertType="info"> This is an alert. </sky-alert>
        </sky-page-summary-alert>
        <sky-page-summary-image>
          <sky-avatar [name]="name" [canChange]="true" />
        </sky-page-summary-image>
        <sky-page-summary-title>
          <font color="red">{{ name }}</font>
        </sky-page-summary-title>
      </sky-page-summary>
    `;
    tree.create('src/app/test.component.html', input);
    await expect(
      firstValueFrom(runner.callRule(convertPageSummaryToPageHeader(''), tree)),
    ).rejects.toThrowError(
      "Error converting '/src/app/test.component.html': The '<sky-page-summary-title>' element contains additional markup that is not supported as a 'pageTitle' for the <sky-page-header> component.",
    );
  });
});
