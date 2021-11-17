# @skyux/autonumeric

[![npm](https://img.shields.io/npm/v/@skyux/autonumeric.svg)](https://www.npmjs.com/package/@skyux/autonumeric)
![SKY UX CI](https://github.com/blackbaud/skyux-autonumeric/workflows/SKY%20UX%20CI/badge.svg)
[![coverage](https://codecov.io/gh/blackbaud/skyux-autonumeric/branch/master/graphs/badge.svg?branch=master)](https://codecov.io/gh/blackbaud/skyux-autonumeric/branch/master)

### Usage

Add the autonumeric attribute to an input element.

```
<input
  type="text"
  skyAutonumeric
>
```

To use a [predefined set of options](https://github.com/autoNumeric/autoNumeric#predefined-options):

```
<input
  type="text"
  skyAutonumeric="dollar"
/>
```

To use a [custom set of options](https://github.com/autoNumeric/autoNumeric#options):

```
<input
  type="text"
  [skyAutonumeric]="{ decimalPlaces: 5 }"
/>
```

### Global Configuration

To configure all `skyAutonumeric` instances in your SPA the same way, create a class that extends the base class `SkyAutonumericOptionsProvider` and supply it in the module providers.

**my-autonumeric-options-provider.ts**

```
export class MyAutonumericOptionsProvider extends SkyAutonumericOptionsProvider {
  constructor() {
    super();
  }

  public getConfig(): SkyAutonumericOptions {
    return {
      decimalPlaces: 5
    };
  }
}
```

**app.module.ts**

```
providers: [
  {
    provide: SkyAutonumericOptionsProvider,
    useClass: MyAutonumericOptionsProvider
  }
]
```

## Install dependencies and view the example

```
skyux install
skyux serve
```
