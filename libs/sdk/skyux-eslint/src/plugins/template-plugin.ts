import { processors } from '@angular-eslint/eslint-plugin-template';
import type { TSESLint } from '@typescript-eslint/utils';

import {
  rule as noDeprecatedClassnames,
  RULE_NAME as noDeprecatedClassnamesRuleName,
} from '../rules/template/no-deprecated-classnames';
import {
  rule as noDeprecatedDirectives,
  RULE_NAME as noDeprecatedDirectivesRuleName,
} from '../rules/template/no-deprecated-directives';
import {
  rule as noInvalidInputBoxChildren,
  RULE_NAME as noInvalidInputBoxChildrenRuleName,
} from '../rules/template/no-invalid-input-box-children';
import {
  rule as noInvalidInputTypes,
  RULE_NAME as noInvalidInputTypesRuleName,
} from '../rules/template/no-invalid-input-types';
import {
  rule as noLegacyIcons,
  RULE_NAME as noLegacyIconsRuleName,
} from '../rules/template/no-legacy-icons';
import {
  rule as noRadioGroupWithNestedList,
  RULE_NAME as noRadioGroupWithNestedListRuleName,
} from '../rules/template/no-radio-group-with-nested-list';
import {
  rule as noUnboundId,
  RULE_NAME as noUnboundIdRuleName,
} from '../rules/template/no-unbound-id';
import {
  rule as preferDisabledAttr,
  RULE_NAME as preferDisabledAttrRuleName,
} from '../rules/template/prefer-disabled-attr';
import {
  rule as preferFormControlComponent,
  RULE_NAME as preferFormControlComponentRuleName,
} from '../rules/template/prefer-form-control-component';
import {
  rule as preferInputBox,
  RULE_NAME as preferInputBoxRuleName,
} from '../rules/template/prefer-input-box';
import {
  rule as preferInputBoxForSkyComponents,
  RULE_NAME as preferInputBoxForSkyComponentsRuleName,
} from '../rules/template/prefer-input-box-for-sky-components';
import {
  rule as preferLabelText,
  RULE_NAME as preferLabelTextRuleName,
} from '../rules/template/prefer-label-text';

export default {
  meta: {
    name: 'skyux-eslint-template',
  },
  processors,
  rules: {
    [noDeprecatedClassnamesRuleName]: noDeprecatedClassnames,
    [noDeprecatedDirectivesRuleName]: noDeprecatedDirectives,
    [noInvalidInputBoxChildrenRuleName]: noInvalidInputBoxChildren,
    [noInvalidInputTypesRuleName]: noInvalidInputTypes,
    [noLegacyIconsRuleName]: noLegacyIcons,
    [noRadioGroupWithNestedListRuleName]: noRadioGroupWithNestedList,
    [noUnboundIdRuleName]: noUnboundId,
    [preferDisabledAttrRuleName]: preferDisabledAttr,
    [preferFormControlComponentRuleName]: preferFormControlComponent,
    [preferInputBoxRuleName]: preferInputBox,
    [preferInputBoxForSkyComponentsRuleName]: preferInputBoxForSkyComponents,
    [preferLabelTextRuleName]: preferLabelText,
  },
} satisfies TSESLint.FlatConfig.Plugin;
