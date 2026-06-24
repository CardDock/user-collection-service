import { getPrismaClientClass, type PrismaClient as PrismaClientType } from './internal/class';
import * as $Enums from './enums';

export const PrismaClient = getPrismaClientClass();
export type PrismaClient = PrismaClientType;
export { $Enums };
export * from './enums';
