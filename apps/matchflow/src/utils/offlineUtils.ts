/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Returns true if the browser reports it is online.
 */
export const isOnline = () => {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
};

/**
 * Simple helper to format time since a timestamp.
 */
export const getTimeSince = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};
