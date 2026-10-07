import type { IasAppConfig } from './iasConfig.example';
import { iasConfig as loadedConfig } from './iasConfig';

export type { IasAppConfig };

export const config: IasAppConfig = loadedConfig;

