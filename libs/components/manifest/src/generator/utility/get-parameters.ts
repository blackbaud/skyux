import { type ParameterReflection } from 'typedoc';

import type { SkyManifestParameterDefinition } from '../../types/function-def';

import { getComment } from './get-comment';
import { getDefaultValue } from './get-default-value';
import { getType } from './get-type';

export function getParameters(
  params: ParameterReflection[] | undefined,
): SkyManifestParameterDefinition[] {
  const parameters: SkyManifestParameterDefinition[] = [];

  if (params) {
    for (const param of params) {
      const { defaultValue, description } = getComment(param.comment);

      parameters.push({
        defaultValue: getDefaultValue(param, defaultValue),
        description,
        isOptional: param.flags.isOptional ? true : undefined,
        name: param.name,
        type: getType(param.type),
      });
    }
  }

  return parameters;
}
