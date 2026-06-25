import { getPrismaClientClass, type PrismaClient as PrismaClientType } from '../generated/prisma/internal/class';
import * as $Enums from '../generated/prisma/enums';

export const PrismaClient = getPrismaClientClass();
export type PrismaClient = PrismaClientType;
export { $Enums };
export * from '../generated/prisma/enums';
