# Convert Stache Action Buttons to SKY UX

## 🔍 WORKSPACE SEARCH REQUIREMENTS

**BEFORE MAKING ANY CHANGES**: You must search the entire workspace for:

- Files containing `stache-action-buttons` (search pattern: `stache-action-buttons`)
- Component files (search pattern: `*.component.ts`)
- Module files (search pattern: `*.module.ts`)
- JSON data files (search pattern: `*.json` in directories like `src/stache/data/`)
- Services using StacheJsonDataService (search pattern: `StacheJsonDataService`)

**IMPORTANT**: Only process files that are NOT listed in the project's `.gitignore` file. Exclude any files or directories specified in `.gitignore` from migration.

## ⚠️ CRITICAL REQUIREMENTS - READ FIRST

**STOP**: Before making ANY changes, you MUST:

1. Use `@for` syntax, NOT `*ngFor`
2. Use `permalink` with route commands, NOT `routerLink`
3. **If using StacheJsonDataService**: Update JSON data files to convert icons and add leading slashes to paths
4. Apply icon mapping from the table below, NOT original icon names
5. Follow the EXACT template structure shown in the examples

**Failure to follow these requirements means the conversion is incorrect.**

## ❌ COMMON MISTAKES TO AVOID

- Using `*ngFor` instead of `@for` (Angular 17+ control flow)
- Using `routerLink` instead of `permalink`
- Not converting icon names (e.g., using 'pencil' instead of 'edit')
- Using old Angular syntax instead of new control flow
- **Forgetting to update JSON data files when using StacheJsonDataService**
- **Not ensuring paths start with `/` in JSON data files**
- Trying to handle icon conversion in TypeScript when JSON should be updated instead
- **❌ CRITICAL: Importing SkyActionButtonModule into modules that don't actually declare components using the action button container**

## 🤖 AI ASSISTANT INSTRUCTIONS

When processing this conversion:

1. **WORKSPACE EXPLORATION**: Always examine the entire workspace, not just the current file:
   - Search for component files (\*.component.ts) that use `stache-action-buttons`
   - Look for module files (\*.module.ts) where components are declared
   - Find JSON data files in `src/stache/data/` or similar directories
   - Identify any services that load route data (like StacheJsonDataService)
   - Check package.json for existing dependencies
   - Examine imports in existing files to understand the current architecture
2. Read the ENTIRE prompt before starting
3. **Check if the component uses StacheJsonDataService** - if so, update JSON files first
4. **Identify ALL files that need changes** before making any modifications
5. **CRITICAL**: Only import `SkyActionButtonModule` into modules that declare components using action buttons - do NOT import into every module
6. Follow the template structure EXACTLY as written
7. Do NOT make assumptions about "standard" approaches
8. Apply ALL mappings from the icon table (in JSON files OR TypeScript methods)
9. **For unmapped icons**: Use 'document' as default and provide clear user instructions
10. Use modern Angular control flow (@for, @if) not legacy (*ngFor, *ngIf)
11. **Ensure ALL paths start with `/` character** - this is critical for navigation
12. **Provide a complete solution** that includes all necessary file changes across the workspace
13. Test your conversion against the validation checklist before responding

Convert `stache-action-buttons` elements to SKY UX `sky-action-button-container` components following these steps:

## Prerequisites Check

1. Verify `@skyux/layout` package is installed with matching `@skyux/core` version
2. If not installed, run: `npm install @skyux/layout@$(npm list @skyux/core --depth=0 | grep @skyux/core | sed 's/.*@skyux\/core@//' | sed 's/ .*//')`
3. **If search functionality is needed** (original component had `[showSearch]="true"`), verify `@skyux/lookup` package is installed
4. If `@skyux/lookup` is not installed, run: `npm install @skyux/lookup@$(npm list @skyux/core --depth=0 | grep @skyux/core | sed 's/.*@skyux\/core@//' | sed 's/ .*//')`
5. Ensure the action button components are available from the `SkyActionButtonModule` in `@skyux/layout`
6. Ensure the search component is available from the `SkySearchModule` in `@skyux/lookup` (when search is needed)

## Conversion Steps

### 1. Update HTML Template

**For components WITHOUT search functionality:**

Replace:

```html
<stache-action-buttons [routes]="actionButtonRoutes"></stache-action-buttons>
```

With:

```html
<sky-action-button-container>
  @for (route of actionButtonRoutes; track route.path) {
  <sky-action-button
    [permalink]="{ 
        route: { 
          commands: [route.path.startsWith('/') ? route.path : '/' + route.path] 
        } 
      }"
  >
    <sky-action-button-icon [iconName]="route.icon" />
    <sky-action-button-header>{{ route.name }}</sky-action-button-header>
    @if (route.summary) {
    <sky-action-button-details> {{ route.summary }} </sky-action-button-details>
    }
  </sky-action-button>
  }
</sky-action-button-container>
```

**For components WITH search functionality (`[showSearch]="true"`):**

Replace:

```html
<stache-action-buttons
  [routes]="actionButtonRoutes"
  [showSearch]="true"
></stache-action-buttons>
```

With:

```html
<div class="sky-margin-stacked-xl">
  <sky-search
    [searchText]="searchText"
    (searchApply)="onSearchApplied($event)"
    (searchChange)="onSearchApplied($event)"
    (searchClear)="onSearchApplied($event)"
  />
</div>

<sky-action-button-container>
  @for (route of filteredActionButtonRoutes; track route.path) {
  <sky-action-button
    [permalink]="{ 
        route: { 
          commands: [route.path.startsWith('/') ? route.path : '/' + route.path] 
        } 
      }"
  >
    <sky-action-button-icon [iconName]="route.icon" />
    <sky-action-button-header>{{ route.name }}</sky-action-button-header>
    @if (route.summary) {
    <sky-action-button-details> {{ route.summary }} </sky-action-button-details>
    }
  </sky-action-button>
  }
</sky-action-button-container>
```

## � STACHE JSON DATA SERVICE HANDLING

**CRITICAL**: If the component uses `StacheJsonDataService` to load route data from JSON files, you MUST:

### Step 1: Update JSON Data Files

1. **Locate the JSON file** that contains the route data (usually in `src/stache/data/`)
2. **Convert ALL icon names** in the JSON file using the icon mapping table above
3. **Ensure ALL path values start with `/`** - prepend `/` if missing
4. **Update the JSON file directly** - do NOT handle conversion in TypeScript

Example JSON transformation:

```json
// BEFORE (incorrect)
{
  "name": "Edit",
  "icon": "pencil",           // ❌ Old icon name
  "path": "edit/content",     // ❌ Missing leading slash
  "summary": "Edit content"
}

// AFTER (correct)
{
  "name": "Edit",
  "icon": "edit",             // ✅ Converted icon name
  "path": "/edit/content",    // ✅ Leading slash added
  "summary": "Edit content"
}
```

### Step 2: Simplify Component Template

When using StacheJsonDataService, choose the appropriate template based on search requirements:

**For components WITHOUT search:**

```html
<sky-action-button-container>
  @for (route of stache.jsonData.yourDataProperty; track route.path) {
  <sky-action-button [permalink]="{ route: { commands: [route.path] } }">
    <sky-action-button-icon [iconName]="route.icon" />
    <sky-action-button-header>{{ route.name }}</sky-action-button-header>
    @if (route.summary) {
    <sky-action-button-details> {{ route.summary }} </sky-action-button-details>
    }
  </sky-action-button>
  }
</sky-action-button-container>
```

**For components WITH search (`[showSearch]="true"`):**

```html
<div class="sky-margin-stacked-xl">
  <sky-search
    [searchText]="searchText"
    (searchApply)="onSearchApplied($event)"
    (searchChange)="onSearchApplied($event)"
    (searchClear)="onSearchApplied($event)"
  />
</div>

<sky-action-button-container>
  @for (route of filteredRoutes; track route.path) {
  <sky-action-button [permalink]="{ route: { commands: [route.path] } }">
    <sky-action-button-icon [iconName]="route.icon" />
    <sky-action-button-header>{{ route.name }}</sky-action-button-header>
    @if (route.summary) {
    <sky-action-button-details> {{ route.summary }} </sky-action-button-details>
    }
  </sky-action-button>
  }
</sky-action-button-container>
```

And add the search method to the component:

```typescript
interface ActionButtonRoute {
  name: string;
  path: string;
  icon: string;
  summary?: string;
}

protected searchText = '';
protected filteredRoutes: ActionButtonRoute[] = [];

public ngOnInit(): void {
  // Initialize filtered routes
  this.filteredRoutes = this.stache.jsonData.yourDataProperty || [];
}

protected onSearchApplied(searchText: string | void): void {
  this.searchText = searchText ?? '';
  const routes: ActionButtonRoute[] = this.stache.jsonData.yourDataProperty || [];

  if (this.searchText.trim()) {
    this.filteredRoutes = routes.filter((route: ActionButtonRoute) => {
      const searchLower = this.searchText.toLowerCase();
      return (
        route.name?.toLowerCase().includes(searchLower) ||
        route.summary?.toLowerCase().includes(searchLower)
      );
    });
  } else {
    this.filteredRoutes = routes;
  }
}
```

**Note**: No `getConvertedIcon()` method needed since icons are pre-converted in JSON.
**Note**: No path normalization needed since paths already start with `/` in JSON.

## 📋 MANDATORY TEMPLATE STRUCTURE (Standard Data)

Choose the appropriate template based on search requirements:

**For components WITHOUT search:**

```html
<sky-action-button-container>
  @for (route of actionButtonRoutes; track route.path) {
  <sky-action-button
    [permalink]="{ 
        route: { 
          commands: [route.path.startsWith('/') ? route.path : '/' + route.path] 
        } 
      }"
  >
    <sky-action-button-icon [iconName]="route.icon" />
    <sky-action-button-header>{{ route.name }}</sky-action-button-header>
    @if (route.summary) {
    <sky-action-button-details> {{ route.summary }} </sky-action-button-details>
    }
  </sky-action-button>
  }
</sky-action-button-container>
```

**For components WITH search (`[showSearch]="true"`):**

```html
<div class="sky-margin-stacked-xl">
  <sky-search
    [searchText]="searchText"
    (searchApply)="onSearchApplied($event)"
    (searchChange)="onSearchApplied($event)"
    (searchClear)="onSearchApplied($event)"
  />
</div>

<sky-action-button-container>
  @for (route of filteredActionButtonRoutes; track route.path) {
  <sky-action-button
    [permalink]="{ 
        route: { 
          commands: [route.path.startsWith('/') ? route.path : '/' + route.path] 
        } 
      }"
  >
    <sky-action-button-icon [iconName]="route.icon" />
    <sky-action-button-header>{{ route.name }}</sky-action-button-header>
    @if (route.summary) {
    <sky-action-button-details> {{ route.summary }} </sky-action-button-details>
    }
  </sky-action-button>
  }
</sky-action-button-container>
```

You MUST use this EXACT structure (do not deviate). For hardcoded data, you must convert the icon values directly in the code using the mapping table, NOT with a runtime function.

### 2. Update Component Code (For Search Functionality)

**If the original component had `[showSearch]="true"`, add these properties and methods to the component:**

```typescript
export class YourComponent {
  protected searchText = '';
  protected filteredActionButtonRoutes = this.actionButtonRoutes;

  protected onSearchApplied(searchText: string | void): void {
    this.searchText = searchText ?? '';

    if (this.searchText.trim()) {
      this.filteredActionButtonRoutes = this.actionButtonRoutes.filter(
        (route) => {
          const searchLower = this.searchText.toLowerCase();
          return (
            route.name?.toLowerCase().includes(searchLower) ||
            route.summary?.toLowerCase().includes(searchLower)
          );
        },
      );
    } else {
      this.filteredActionButtonRoutes = this.actionButtonRoutes;
    }
  }
}
```

**For StacheJsonDataService components with search:**

```typescript
interface ActionButtonRoute {
  name: string;
  path: string;
  icon: string;
  summary?: string;
}

export class YourComponent {
  protected searchText = '';
  protected filteredRoutes: ActionButtonRoute[] = [];

  protected onSearchApplied(searchText: string | void): void {
    this.searchText = searchText ?? '';
    const routes: ActionButtonRoute[] =
      this.stache.jsonData.yourDataProperty || [];

    if (this.searchText.trim()) {
      this.filteredRoutes = routes.filter((route: ActionButtonRoute) => {
        const searchLower = this.searchText.toLowerCase();
        return (
          route.name?.toLowerCase().includes(searchLower) ||
          route.summary?.toLowerCase().includes(searchLower)
        );
      });
    } else {
      this.filteredRoutes = routes;
    }
  }
}
```

### 3. Update Module Imports

**IMPORTANT**: Only import modules into components/modules that actually declare components using the converted features. Do NOT add imports to modules that don't have components in their declarations array that use these features.

**Steps to determine where to import:**

1. **Find components using action buttons**: Search for component files (_.component.ts or _.component.html) that contain `stache-action-buttons` and will be converted to use `sky-action-button-container`
2. **Find their declaring modules**: For each component found, locate the module file (\*.module.ts) where that component appears in the `declarations` array
3. **Only import where needed**: Add the required modules ONLY to those specific modules

**For module-based components:**

1. **Identify the module file** where the component that uses action buttons is declared (appears in the `declarations` array)
2. **Add the import statements**:
   - `import { SkyActionButtonModule } from '@skyux/layout';`
   - **If search is needed**: `import { SkySearchModule } from '@skyux/lookup';`
3. **Add modules** to that module's imports array:
   - `SkyActionButtonModule`
   - **If search is needed**: `SkySearchModule`
4. **Remove any `StacheActionButtonsModule` imports** from that same module

**For standalone components:**

- Add the required modules directly to the component's imports array:
  - `SkyActionButtonModule`
  - **If search is needed**: `SkySearchModule`

**Do NOT import these modules into:**

- Modules that don't declare components using action buttons or search
- Modules where components are only imported/exported but not declared
- Root modules unless they directly declare a component using these features

### 3. Convert Icon Names

Apply the following icon name mappings when updating route data or hardcoded icons:

```javascript
const iconMapping = {
  add: 'add',
  'address-book': 'book-contacts',
  'address-card': 'contact-card',
  'align-center': 'text-align-center',
  'align-left': 'text-align-left',
  'align-right': 'text-align-right',
  'angle-double-down': 'chevron-double-down',
  'angle-double-up': 'chevron-double-up',
  'angle-down': 'chevron-down',
  'angle-left': 'chevron-left',
  'angle-right': 'chevron-right',
  'angle-up': 'chevron-up',
  apple: 'apple',
  'arrow-circle-left': 'arrow-circle-left',
  'arrow-circle-right': 'arrow-circle-right',
  'arrow-down': 'arrow-down',
  'arrow-left': 'arrow-left',
  'arrow-right': 'arrow-right',
  arrows: 'arrow-move',
  'arrows-v': 'arrow-bidirectional-up-down',
  'arrow-up-right-dots': 'arrow-trending-lines',
  at: 'mention',
  ban: 'prohibited',
  'bar-chart': 'data-bar-vertical-ascending',
  bars: 'navigation',
  'bars-2': 'navigation',
  'bars-progress': 'data-bar-horizontal-descending',
  'bb-diamond-2': 'bb-diamond',
  'bb-diamond-2-solid': 'bb-diamond',
  bell: 'alert',
  binoculars: 'eye',
  'birthday-cake': 'food-cake',
  bold: 'text-bold',
  bolt: 'flash',
  book: 'book',
  bookmark: 'bookmark',
  building: 'building',
  'building-o': 'building',
  bullhorn: 'megaphone',
  bullseye: 'target',
  calculator: 'calculator',
  calendar: 'calendar-ltr',
  'caret-down': 'chevron-down',
  'caret-left': 'chevron-left',
  'caret-right': 'chevron-right',
  'caret-up': 'chevron-up',
  'cash-payment-bill-2': 'cash-payment-bill',
  'cash-register': 'money-hand',
  certificate: 'ribbon',
  'chalkboard-teacher': 'share-screen-person',
  'chart-bar': 'data-bar-horizontal',
  'chart-column': 'data-bar-vertical-ascending',
  'chart-gantt': 'gantt-chart',
  'chart-line': 'data-trending',
  'chart-pie': 'data-pie',
  'chart-simple': 'data-histogram',
  check: 'checkmark',
  'check-circle': 'success',
  'check-square': 'checkmark-square',
  'check-square-o': 'checkmark-square',
  chess: 'chess',
  'chevron-down': 'chevron-down',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  'chevron-up': 'chevron-up',
  circle: 'circle',
  'circle-o-notch': 'spinner-ios',
  clipboard: 'clipboard-multiple',
  'clipboard-check': 'clipboard-checkmark',
  'clipboard-list': 'clipboard-bullet-list',
  'clock-o': 'clock',
  clone: 'copy',
  close: 'close',
  cloud: 'cloud',
  'cloud-download': 'arrow-download',
  'cloud-upload': 'arrow-upload',
  code: 'code',
  'code-branch': 'branch-fork',
  'code-fork': 'branch-fork',
  cog: 'settings',
  'cog-2': 'settings',
  cogs: 'settings-cog-multiple',
  columns: 'layout-column-three',
  comment: 'chat-empty',
  'comment-o': 'chat-empty',
  comments: 'chat-multiple',
  'comments-o': 'chat-multiple',
  compass: 'compass-northwest',
  copy: 'copy',
  'copy-to-clipboard': 'clipboard-multiple',
  'credit-card': 'payment',
  crop: 'crop',
  cubes: 'cube-multiple',
  cutlery: 'food',
  dashboard: 'top-speed',
  database: 'database-stack',
  'database-2': 'database-stack',
  desktop: 'desktop',
  'diagram-predecessor': 'text-arrow-down-right-column',
  'divider-line': 'insert',
  'doc-file': 'document-doc',
  dollar: 'dollar',
  'double-chevron-down': 'chevron-double-down',
  'double-chevron-left': 'chevron-double-left',
  'double-chevron-right': 'chevron-double-right',
  'double-chevron-up': 'chevron-double-up',
  download: 'arrow-download',
  edit: 'edit',
  ellipsis: 'more-actions',
  'ellipsis-h': 'more-actions',
  'ellipsis-v': 'more-vertical',
  envelope: 'mail',
  'envelope-o': 'mail',
  eraser: 'eraser',
  'exclamation-circle': 'error-circle',
  'exclamation-triangle': 'warning',
  expand: 'arrow-maximize',
  'external-link': 'open',
  'external-link-alt': 'open',
  eye: 'eye',
  f: 'letter-f',
  facebook: 'facebook',
  'fas fa-plus-circle': 'add',
  'fa-solid fa-map-pin': 'location',
  'feather-alt': 'bookmark',
  file: 'document',
  'file-alt': 'document-text',
  'file-code': 'document-chevron-double',
  'file-code-o': 'document-chevron-double',
  'file-contract': 'document-contract',
  'file-excel-o': 'document-xls',
  'file-image-o': 'document-image',
  'file-invoice': 'document-table',
  'file-o': 'document',
  'file-pdf-o': 'document-pdf',
  'files-o': 'document-multiple',
  'file-text-o': 'document-text',
  filter: 'filter',
  flag: 'flag',
  'folder-open-o': 'folder-open',
  gavel: 'gavel',
  gear: 'settings',
  gift: 'gift',
  git: 'git',
  github: 'github',
  'git-square': 'git',
  globe: 'globe',
  google: 'google',
  'graduation-cap': 'hat-graduation',
  group: 'people-team',
  'hammer-wrench-2': 'wrench-screwdriver',
  'hand-paper-o': 'hand-left',
  handshake: 'handshake',
  'handshake-o': 'handshake',
  'hands-helping': 'handshake',
  help: 'question-circle',
  hide: 'eye-off',
  history: 'history',
  'hourglass-start': 'hourglass-half',
  'id-card': 'contact-card',
  image: 'image',
  images: 'image-multiple',
  inbox: 'mail-inbox',
  info: 'info',
  'info-circle': 'info',
  'info-circle info-circle-icon': 'info',
  institution: 'building-bank',
  italic: 'text-italic',
  key: 'key',
  'keyboard-o': 'keyboard',
  laptop: 'laptop',
  'laptop-code': 'code',
  'life-ring': 'person-support',
  lightbulb: 'lightbulb',
  'lightbulb-o': 'lightbulb',
  'line-chart': 'data-trending',
  link: 'link',
  linkedin: 'linkedin',
  list: 'text-bullet-list',
  'list-check': 'task-list-ltr',
  'list-ol': 'text-number-list-ltr',
  'list-ul': 'text-bullet-list-ltr',
  lock: 'lock-closed',
  'lock-2': 'lock-closed',
  'long-arrow-down': 'arrow-down',
  'long-arrow-up': 'arrow-up',
  m: 'letter-m',
  magic: 'wand',
  map: 'map',
  'map-marker': 'location',
  'map-o': 'map',
  'map-signs': 'street-sign',
  microphone: 'mic',
  minus: 'subtract',
  'minus-circle': 'subtract-circle',
  mobile: 'phone',
  money: 'money',
  'newspaper-o': 'news',
  'object-group': 'group',
  'open-new-tab': 'open',
  'open-new-tab-line': 'open',
  paintbrush: 'paint-brush',
  paperclip: 'attach',
  'paper-plane': 'send',
  'pdf-file': 'document-pdf',
  pencil: 'edit',
  'pencil-alt': 'edit',
  'pencil-square-o': 'note-edit',
  'pen-to-square': 'window-edit',
  'people-group': 'people-team',
  phone: 'call',
  'phone-square': 'call',
  'pie-chart': 'data-pie',
  play: 'play',
  'play-circle': 'play-circle',
  plug: 'plug-disconnected',
  plus: 'add',
  'plus-circle': 'add',
  'plus-square': 'add-square',
  'power-off': 'power',
  print: 'print',
  printer: 'print',
  'puzzle-piece': 'puzzle-piece',
  question: 'question',
  'question-circle': 'question-circle',
  'question-circle-o': 'question-circle',
  recycle: 'recycle',
  redo: 'arrow-redo',
  refresh: 'arrow-clockwise',
  road: 'road',
  robot: 'bot',
  rocket: 'rocket',
  s: 'letter-s',
  save: 'save',
  search: 'search',
  send: 'send',
  server: 'server',
  settings: 'settings',
  shapes: 'shapes',
  share: 'share',
  'share-alt': 'share-android',
  'share-square-o': 'share',
  shield: 'shield',
  'shield-alt': 'shield',
  'shield-virus': 'shield-keyhole',
  show: 'eye',
  'sign-in': 'arrow-enter',
  'sign-in-alt': 'arrow-enter',
  sitemap: 'cube-tree',
  slack: 'slack',
  sliders: 'options',
  sort: 'arrow-sort',
  'sparkles-2': 'sparkles',
  spinner: 'spinner-ios',
  'square-o': 'square',
  star: 'star',
  'sticky-note': 'note',
  'sticky-note-o': 'note',
  stop: 'stop',
  sync: 'arrow-sync',
  t: 'letter-t',
  table: 'table',
  tablet: 'tablet',
  'tachometer-alt': 'top-speed',
  tag: 'tag',
  tags: 'tag-multiple',
  tasks: 'task-list-ltr',
  th: 're-order-dots-vertical',
  'thermometer-half': 'temperature',
  'th-large': 'grid',
  'thumbs-o-down': 'thumb-dislike',
  'thumbs-o-up': 'thumb-like',
  'thumbs-up': 'thumb-like',
  ticket: 'ticket-diagonal',
  'tile-drag': 're-order-dots-vertical',
  times: 'close',
  'times-circle': 'dismiss-circle',
  toolbox: 'toolbox',
  tools: 'wrench-screwdriver',
  train: 'vehicle-subway',
  trash: 'delete',
  'trash-o': 'delete',
  truck: 'vehicle-truck-profile',
  twitter: 'twitter',
  underline: 'text-underline',
  'universal-access': 'accessibility',
  university: 'building-bank',
  'unlock-alt': 'lock-open',
  upload: 'arrow-upload',
  usd: 'dollar',
  user: 'person',
  'user-check': 'person-available',
  'user-circle': 'person-circle',
  'user-lock': 'person-lock',
  'user-o': 'person',
  'user-plus': 'person-add',
  users: 'people-team',
  'user-tag': 'person-tag',
  video: 'video',
  'video-camera': 'video',
  'volume-off': 'speaker-mute',
  w: 'letter-w',
  wallet: 'wallet',
  'wand-sparkles': 'wand',
  warehouse: 'building-factory',
  warning: 'warning',
  'window-close': 'dismiss-square',
  windows: 'windows',
  wrench: 'wrench',
  'xls-file': 'document-xls',
  youtube: 'youtube',
  photo: 'image',
};
```

## 🚨 UNMAPPED ICON HANDLING

**If no mapping exists for an icon:**

1. **Use 'document' as the temporary default**
2. **Alert the user with this message:**

   ```
   ⚠️ ICON MAPPING NEEDED: The icon '{original-icon-name}' is not mapped in our conversion table.

   Please visit https://developer.blackbaud.com/skyux/components/icon to:
   1. Browse the standard SKY UX icons
   2. Choose an appropriate replacement for '{original-icon-name}'
   3. Manually update the icon name in your migrated code

   Temporarily using 'document' icon as placeholder.
   ```

3. **Include this in your migration output** so the user knows what needs manual attention

## 🔄 CONVERSION PROCESS (Follow in Order)

### BEFORE YOU START - WORKSPACE ANALYSIS:

1. **Search the entire workspace** for files containing `stache-action-buttons`
2. **Check for search functionality** - look for `[showSearch]="true"` usage
3. **Identify all components** that need migration
4. **Find the module files** where each component is declared
5. **Locate any JSON data files** used by StacheJsonDataService
6. **Check for any shared services** that provide route data
7. **Create a complete plan** for all files that need changes

## 🎯 THREE DIFFERENT APPROACHES

**Important**: There are three different approaches based on how the component gets its data and search requirements:

1. **StacheJsonDataService (JSON files) WITHOUT search**: Convert icons directly in JSON data files
2. **StacheJsonDataService (JSON files) WITH search**: Convert icons in JSON + add search functionality
3. **Hardcoded Data**: Convert icons directly in the template/component code + optional search

**DO NOT** create runtime conversion functions - always convert icon values during migration.

### For Components Using StacheJsonDataService WITHOUT Search:

1. **FIRST**: Locate and update JSON data files (convert icons, add leading slashes to paths)
2. **SECOND**: Import SkyActionButtonModule ONLY into the module that declares the component using action buttons
3. **THIRD**: Replace HTML using the StacheJsonDataService template (without search)
4. **FOURTH**: Verify using the validation checklist below
5. **LAST**: Test the build

### For Components Using StacheJsonDataService WITH Search:

1. **FIRST**: Locate and update JSON data files (convert icons, add leading slashes to paths)
2. **SECOND**: Import SkyActionButtonModule AND SkySearchModule ONLY into the module that declares the component using action buttons
3. **THIRD**: Replace HTML using the StacheJsonDataService template with search
4. **FOURTH**: Add search properties and methods to the component
5. **FIFTH**: Verify using the validation checklist below
6. **LAST**: Test the build

### For Components with Hardcoded Data WITHOUT Search:

1. **FIRST**: Convert icon values directly in the code using the icon mapping table (e.g., change 'pencil' to 'edit')
2. **SECOND**: Import SkyActionButtonModule ONLY into the module that declares the component using action buttons
3. **THIRD**: Replace HTML using the standard data template (without search) with converted icon values
4. **FOURTH**: For unmapped icons, use 'document' and alert the user
5. **FIFTH**: Verify using the validation checklist below
6. **LAST**: Test the build

### For Components with Hardcoded Data WITH Search:

1. **FIRST**: Convert icon values directly in the code using the icon mapping table (e.g., change 'pencil' to 'edit')
2. **SECOND**: Import SkyActionButtonModule AND SkySearchModule ONLY into the module that declares the component using action buttons
3. **THIRD**: Replace HTML using the standard data template with search and converted icon values
4. **FOURTH**: Add search properties and methods to the component
5. **FIFTH**: For unmapped icons, use 'document' and alert the user
6. **SIXTH**: Verify using the validation checklist below
7. **LAST**: Test the build

### 4. Verification Steps

After conversion:

1. Check that all `sky-action-button` elements render correctly
2. Verify that route navigation works as expected
3. Ensure all icons display properly with the new icon names
4. Confirm that any `route.summary` content displays in action button details
5. Test that the permalink routing handles both absolute and relative paths correctly
6. **If search was implemented**: Verify that search functionality filters action buttons correctly by name and summary

## ✅ Validation Checklist

Before submitting your conversion, verify:

### For ALL Conversions:

- [ ] Used `@for (route of dataSource; track route.path)` syntax
- [ ] Used `[permalink]="{ route: { commands: [route.path] } }"` format
- [ ] Used `@if (route.summary)` for conditional details
- [ ] Added module imports ONLY to modules that declare components using the converted features (not to every module or unrelated modules)
- [ ] Build completes without errors

### For Components WITH Search:

- [ ] **CRITICAL**: Added `SkySearchModule` import to the appropriate module
- [ ] **CRITICAL**: Implemented search component and functionality correctly
- [ ] **CRITICAL**: Search filters on both `route.name` and `route.summary` properties
- [ ] **CRITICAL**: Used `filteredActionButtonRoutes` or `filteredRoutes` in the @for loop
- [ ] Search debounce is set to 250ms
- [ ] Search handles empty/cleared search terms correctly

### For StacheJsonDataService Components:

- [ ] **CRITICAL**: Updated JSON data file with converted icon names
- [ ] **CRITICAL**: All paths in JSON start with `/` character
- [ ] Used direct `route.icon` in template (no conversion method)
- [ ] Used direct `route.path` in permalink (no normalization)
- [ ] **If search enabled**: Added search method and filtered data array

### For Hardcoded Data Components:

- [ ] **CRITICAL**: Converted icon values directly in the code using the mapping table (e.g., 'pencil' → 'edit')
- [ ] Used path normalization: `route.path.startsWith('/') ? route.path : '/' + route.path`
- [ ] **CRITICAL**: For unmapped icons, used 'document' as default and alerted user with instructions to visit SKY UX icon documentation
- [ ] **If search enabled**: Added search method and filtered data array

## Example Conversion

### StacheJsonDataService Example:

#### Before (JSON file):

```json
[
  {
    "name": "Edit",
    "icon": "pencil",
    "path": "edit/content",
    "summary": "Edit content"
  }
]
```

#### Before (HTML):

```html
<stache-action-buttons
  [routes]="stache.jsonData.myRoutes"
  [showSearch]="true"
></stache-action-buttons>
```

#### After (JSON file - UPDATED FIRST):

```json
[
  {
    "name": "Edit",
    "icon": "edit",
    "path": "/edit/content",
    "summary": "Edit content"
  }
]
```

#### After (HTML):

```html
<sky-action-button-container>
  @for (route of stache.jsonData.myRoutes; track route.path) {
  <sky-action-button [permalink]="{ route: { commands: [route.path] } }">
    <sky-action-button-icon [iconName]="route.icon" />
    <sky-action-button-header>{{ route.name }}</sky-action-button-header>
    <sky-action-button-details>{{ route.summary }}</sky-action-button-details>
  </sky-action-button>
  }
</sky-action-button-container>
```

### Hardcoded Data Example:

#### Before:

```html
<stache-action-buttons
  [routes]="[
    {name: 'Edit', icon: 'pencil', path: '/edit', summary: 'Edit content'},
    {name: 'Delete', icon: 'trash', path: '/delete', summary: 'Delete item'},
    {name: 'Settings', icon: 'cog', path: '/settings'}
  ]"
  [showSearch]="true"
></stache-action-buttons>
```

#### After (with direct icon conversion):

```html
<sky-action-button-container>
  <sky-action-button [permalink]="{ route: { commands: ['/edit'] } }">
    <sky-action-button-icon iconName="edit" />
    <sky-action-button-header>Edit</sky-action-button-header>
    <sky-action-button-details>Edit content</sky-action-button-details>
  </sky-action-button>
  <sky-action-button [permalink]="{ route: { commands: ['/delete'] } }">
    <sky-action-button-icon iconName="trash" />
    <sky-action-button-header>Delete</sky-action-button-header>
    <sky-action-button-details>Delete item</sky-action-button-details>
  </sky-action-button>
  <sky-action-button [permalink]="{ route: { commands: ['/settings'] } }">
    <sky-action-button-icon iconName="settings" />
    <sky-action-button-header>Settings</sky-action-button-header>
  </sky-action-button>
</sky-action-button-container>
```

**Note**: Icons 'pencil' → 'edit', 'cog' → 'settings', 'trash' stays 'trash' (already correct).

## Instructions

Please analyze the current workspace for any `stache-action-buttons` elements and perform the complete conversion following all the steps above.

**MANDATORY REQUIREMENTS** - Ensure that:

1. All necessary packages are installed
2. HTML templates are updated with the EXACT structure from the mandatory template above
3. Module imports are properly configured with `SkyActionButtonModule`
4. **Icon names are converted directly in the code** using the mapping table (no runtime functions needed)
5. **For unmapped icons**: Use 'document' as default and alert user with instructions to visit https://developer.blackbaud.com/skyux/components/icon
6. Modern Angular control flow (`@for`, `@if`) is used instead of legacy syntax
7. The `permalink` property is used with route commands, NOT `routerLink`
8. The conversion is verified against the validation checklist and working correctly

The route navigation is handled automatically by the permalink input, so no additional click handler methods are needed.

## 📄 REQUIRED OUTPUT FORMAT

Your response must include:

1. **Workspace Analysis Summary**: List all files found that contain `stache-action-buttons`
2. **Complete File Changes**: Show all files that need to be modified with before/after code
3. **Module Import Changes**: Specify exactly which module files need `SkyActionButtonModule` imported (ONLY modules that declare components using action buttons)
4. **JSON Data Updates**: If applicable, show all JSON file changes with icon conversions and path fixes
5. **Verification**: Confirm each item in the validation checklist is addressed
6. **Build Instructions**: Any npm commands needed to install dependencies

**Do not provide partial solutions** - include ALL necessary changes across the entire workspace.

**Remember**: Follow the CRITICAL REQUIREMENTS at the top of this document. Do not make assumptions or use alternative approaches.
