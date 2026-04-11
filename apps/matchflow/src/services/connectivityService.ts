/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ConnectivityStatus = 'online' | 'offline';

/**
 * Service to track browser connectivity status.
 */
export class ConnectivityService {
  private static instance: ConnectivityService;
  private status: ConnectivityStatus = 'online';
  private listeners: ((status: ConnectivityStatus) => void)[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      this.status = navigator.onLine ? 'online' : 'offline';
      window.addEventListener('online', () => this.updateStatus('online'));
      window.addEventListener('offline', () => this.updateStatus('offline'));
    }
  }

  public static getInstance(): ConnectivityService {
    if (!ConnectivityService.instance) {
      ConnectivityService.instance = new ConnectivityService();
    }
    return ConnectivityService.instance;
  }

  public getStatus(): ConnectivityStatus {
    return this.status;
  }

  /**
   * For testing purposes or manual control
   */
  public setMockStatus(status: ConnectivityStatus) {
    this.updateStatus(status);
  }

  public subscribe(callback: (status: ConnectivityStatus) => void) {
    this.listeners.push(callback);
    callback(this.status);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private updateStatus(newStatus: ConnectivityStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.listeners.forEach(l => l(this.status));
    }
  }
}
