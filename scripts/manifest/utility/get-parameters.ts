import { ParameterReflection } from 'typedoc';

import { SkyManifestParameterDefinition } from '../types';

import { getComment } from './get-comment';
import { getDefaultValue } from './get-default-value';
import { getType } from './get-type';

export function getParameters(
  refl: ParameterReflection[] | undefined,
): SkyManifestParameterDefinition[] {
  const parameters: SkyManifestParameterDefinition[] = [];

  if (refl) {
    for (const param of refl) {
      const { defaultValue, description } = getComment(param.comment);

      parameters.push({
        defaultValue: getDefaultValue(param, defaultValue),
        description,
        isOptional: !!param.flags?.isOptional,
        name: param.name,
        type: getType(param.type),
      });
    }
  }

  return parameters;
}
