import { JsonRpcRequestStruct } from '@metamask/utils';
import {
  array,
  assign,
  Infer,
  is,
  object,
  omit,
  partial,
  pick,
  refine,
  string,
} from 'superstruct';
import { parseExpression } from 'cron-parser';

export const CronjobRpcRequestStruct = assign(
  partial(pick(JsonRpcRequestStruct, ['id', 'jsonrpc'])),
  omit(JsonRpcRequestStruct, ['id', 'jsonrpc']),
);
export type CronjobRpcRequest = Infer<typeof CronjobRpcRequestStruct>;

export const CronExpressionStruct = refine(
  string(),
  'CronExpression',
  (value) => {
    try {
      parseCronExpression(value);
      return true;
    } catch {
      return false;
    }
  },
);

export type CronExpression = Infer<typeof CronExpressionStruct>;

/**
 * Parses a cron expression.
 *
 * @param expression - Expression to parse.
 * @returns A CronExpression class instance.
 */
export function parseCronExpression(expression: string) {
  return parseExpression(expression);
}

export const CronjobSpecificationStruct = object({
  expression: CronExpressionStruct,
  request: CronjobRpcRequestStruct,
});
export type CronjobSpecification = Infer<typeof CronjobSpecificationStruct>;

/**
 * Check if the given value is a {@link CronjobSpecification} object.
 *
 * @param value - The value to check.
 * @returns Whether the value is a valid {@link CronjobSpecification} object.
 */
export function isCronjobSpecification(
  value: unknown,
): value is CronjobSpecification {
  return is(value, CronjobSpecificationStruct);
}

export const CronjobSpecificationArrayStruct = array(
  CronjobSpecificationStruct,
);

/**
 * Check if the given value is an array of {@link CronjobSpecification} objects.
 *
 * @param value - The value to check.
 * @returns Whether the value is a valid array of {@link CronjobSpecification} objects.
 */
export function isCronjobSpecificationArray(
  value: unknown,
): value is CronjobSpecification[] {
  return is(value, CronjobSpecificationArrayStruct);
}
