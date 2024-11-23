import { type ParameterReflection } from 'typedoc';

import type { SkyManifestParameterDefinition } from '../../types/function-def';

import { formatType } from './format-type';
import { getComment } from './get-comment';
import { getDefaultValue } from './get-default-value';

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
        type: formatType(param.type),
      });
    }
  }

  return parameters;
}
