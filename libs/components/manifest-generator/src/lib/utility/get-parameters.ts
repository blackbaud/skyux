import type { SkyManifestParameterDefinition } from '@skyux/manifest-local';

import {
  DeclarationReflection,
  ParameterReflection,
  SignatureReflection,
} from 'typedoc';

import { formatType } from './format-type.js';
import { getComment } from './get-comment.js';
import { getDefaultValue } from './get-default-value.js';

export function getParameters(
  reflection: DeclarationReflection | SignatureReflection,
): SkyManifestParameterDefinition[] | undefined {
  let params: ParameterReflection[] | undefined;

  if (reflection instanceof SignatureReflection) {
    params = reflection.parameters;
  } else {
    params = reflection.signatures?.[0]?.parameters;
  }

  if (!params || params.length === 0) {
    return;
  }

  const paramDefinitions: SkyManifestParameterDefinition[] = [];

  for (const param of params) {
    const { defaultValue, description } = getComment(param);

    paramDefinitions.push({
      defaultValue: getDefaultValue(param, defaultValue),
      description,
      isOptional: param.flags.isOptional ? true : undefined,
      name: param.name,
      type: formatType(param),
    });
  }

  return paramDefinitions;
}
