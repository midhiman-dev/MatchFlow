/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  EmergencyState, 
  LiveClosure, 
  SafetyCommand, 
  SafetyAuditLog, 
  CommandType,
  EmergencyLevel
} from '../domain/live/types';

/**
 * Service to handle emergency and closure commands.
 * This implements T1 of Spec 06.
 * 
 * DESIGN PRINCIPLE: Safety-first with explicit operator intent.
 * Commands must be created, confirmed, and then applied to authoritative state.
 */
export class EmergencyService {
  private static instance: EmergencyService;
  
  // Local state representing what would eventually be in Firebase RTDB
  private emergencyState: EmergencyState = {
    active: false,
    level: 'notice',
    message: '',
    updatedAt: Date.now()
  };
  
  // Records of active closures
  private activeClosures: Record<string, LiveClosure> = {};
  
  // In-memory audit log representing what would eventually be in Firestore
  private auditLog: SafetyAuditLog[] = [];
  
  // Registry of pending commands awaiting confirmation
  private pendingCommands: Record<string, SafetyCommand> = {};

  private constructor() {}

  public static getInstance(): EmergencyService {
    if (!this.instance) {
      this.instance = new EmergencyService();
    }
    return this.instance;
  }

  /**
   * Creates a new structured safety command.
   * This is the first step in a confirmation-friendly flow.
   */
  public createCommand(
    type: CommandType,
    operatorId: string,
    params: { 
      targetId?: string; 
      level?: EmergencyLevel; 
      message?: string; 
      reason: string 
    }
  ): SafetyCommand {
    const command: SafetyCommand = {
      id: `cmd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      targetId: params.targetId,
      level: params.level,
      message: params.message,
      reason: params.reason,
      operatorId,
      timestamp: Date.now(),
      status: 'pending'
    };

    this.pendingCommands[command.id] = command;
    return command;
  }

  /**
   * Confirms and applies a pending command.
   * PROTECTED ACTION: In production, this would require server-side auth validation.
   */
  public confirmCommand(commandId: string): { success: boolean; error?: string; command?: SafetyCommand } {
    const command = this.pendingCommands[commandId];
    if (!command) return { success: false, error: 'Command not found' };

    try {
      // 1. Snapshot previous state for audit (simplified for T1)
      const previousState = this.getStateSnapshot();

      // 2. Apply change to authoritative live state
      this.applyCommandToState(command);

      // 3. Create persistent audit record
      this.createAuditLog(command, previousState, this.getStateSnapshot());

      // 4. Update command completion status
      command.status = 'applied';
      delete this.pendingCommands[commandId];

      return { success: true, command };
    } catch (err) {
      command.status = 'failed';
      return { success: false, error: (err as Error).message, command };
    }
  }

  /**
   * Internal logic to update authoritative state based on command type.
   */
  private applyCommandToState(command: SafetyCommand) {
    const now = Date.now();

    switch (command.type) {
      case 'activateEmergency':
        this.emergencyState = {
          active: true,
          level: command.level || 'notice',
          message: command.message || 'Emergency Mode Activated',
          updatedAt: now
        };
        break;

      case 'clearEmergency':
        this.emergencyState = {
          active: false,
          level: 'notice',
          message: '',
          updatedAt: now
        };
        break;

      case 'closePath':
      case 'closeZone':
        if (!command.targetId) throw new Error('Target ID is required for closure commands');
        this.activeClosures[command.targetId] = {
          targetId: command.targetId,
          targetType: command.type === 'closePath' ? 'path' : 'zone',
          reason: command.reason,
          timestamp: now
        };
        break;

      case 'openPath':
      case 'openZone':
        if (!command.targetId) throw new Error('Target ID is required for open commands');
        delete this.activeClosures[command.targetId];
        break;

      default:
        throw new Error(`Unknown command type: ${command.type}`);
    }
  }

  /**
   * Creates a durable audit record for the action.
   */
  private createAuditLog(command: SafetyCommand, previousState: any, newState: any) {
    const log: SafetyAuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      commandId: command.id,
      operatorId: command.operatorId,
      action: command.type,
      targetId: command.targetId,
      reason: command.reason,
      timestamp: Date.now(),
      previousState,
      newState
    };
    this.auditLog.push(log);
  }

  /**
   * Returns current emergency status.
   */
  public getEmergencyState(): EmergencyState {
    return { ...this.emergencyState };
  }

  /**
   * Returns all active closures.
   */
  public getActiveClosures(): LiveClosure[] {
    return Object.values(this.activeClosures);
  }

  /**
   * Returns the safety audit history.
   */
  public getAuditHistory(): SafetyAuditLog[] {
    return [...this.auditLog];
  }

  /**
   * Helper to capture state for audit trail.
   */
  private getStateSnapshot() {
    return {
      emergency: { ...this.emergencyState },
      closures: { ...this.activeClosures }
    };
  }

  /**
   * Reset the service state (useful for tests).
   */
  public reset() {
    this.emergencyState = { active: false, level: 'notice', message: '', updatedAt: Date.now() };
    this.activeClosures = {};
    this.auditLog = [];
    this.pendingCommands = {};
  }
}
