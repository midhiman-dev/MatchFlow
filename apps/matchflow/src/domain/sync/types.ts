/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OfflineActionType = 'PLACE_ORDER' | 'UPDATE_PROFILE' | 'ACKNOWLEDGE_ALERT';

export interface OfflineAction {
  id: string;
  type: OfflineActionType;
  payload: any;
  timestamp: number;
  retryCount: number;
}

export interface CachedState<T = any> {
  key: string;
  value: T;
  lastUpdated: number;
}
