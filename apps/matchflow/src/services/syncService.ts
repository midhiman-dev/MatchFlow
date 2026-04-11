/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OfflineAction, OfflineActionType } from '../domain/sync/types';
import { ConnectivityService } from './connectivityService';

/**
 * Service to handle outbox and pending actions for offline support.
 */
export class SyncService {
  private static instance: SyncService;
  private outbox: OfflineAction[] = [];
  private handlers: Map<OfflineActionType, (payload: any) => Promise<void>> = new Map();
  private processing: boolean = false;
  private storageKey = 'matchflow_outbox';

  private constructor() {
    this.loadOutbox();
    ConnectivityService.getInstance().subscribe((status) => {
      if (status === 'online') {
        this.flush();
      }
    });
  }

  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  /**
   * Registers a handler for a specific action type.
   * Handlers are responsible for the actual API call.
   */
  public registerHandler(type: OfflineActionType, handler: (payload: any) => Promise<void>) {
    this.handlers.set(type, handler);
  }

  /**
   * Enqueues an action to the outbox. 
   * Flushes immediately if online.
   */
  public async enqueue(type: OfflineActionType, payload: any) {
    const action: OfflineAction = {
      id: Math.random().toString(36).substring(2, 9), // Simple UUID for T1
      type,
      payload,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.outbox.push(action);
    this.saveOutbox();

    if (ConnectivityService.getInstance().getStatus() === 'online') {
      this.flush();
    }
  }

  public getOutbox(): OfflineAction[] {
    return [...this.outbox];
  }

  /**
   * Clears the outbox (primarily for testing)
   */
  public clearOutbox() {
    this.outbox = [];
    this.saveOutbox();
  }

  /**
   * Attempts to process all pending actions in the outbox.
   */
  public async flush() {
    if (this.processing || this.outbox.length === 0) return;
    if (ConnectivityService.getInstance().getStatus() === 'offline') return;

    this.processing = true;
    const remainingActions: OfflineAction[] = [];

    // Process actions sequentially to maintain order intent
    for (const action of this.outbox) {
      const handler = this.handlers.get(action.type);
      if (handler) {
        try {
          // Wrap in a promise to handle async handlers
          await handler(action.payload);
        } catch (error) {
          console.error(`Failed to flush action ${action.id}`, error);
          action.retryCount++;
          // Retry logic: keep in outbox if retry count < limit
          if (action.retryCount < 3) {
            remainingActions.push(action);
          }
        }
      } else {
        // If no handler, keep it for later (or could discard for MVP)
        remainingActions.push(action);
      }
    }

    this.outbox = remainingActions;
    this.saveOutbox();
    this.processing = false;
  }

  private loadOutbox() {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.outbox = JSON.parse(saved);
      } catch {
        this.outbox = [];
      }
    }
  }

  private saveOutbox() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(this.outbox));
  }
}
