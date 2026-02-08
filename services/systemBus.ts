
export type SystemEventType = 
  | 'PR_MERGED' 
  | 'JOB_ACCEPTED' 
  | 'JOB_COMPLETED' 
  | 'COMMUNITY_HELP_PROVIDED' 
  | 'SECURITY_FIX_APPLIED'
  | 'USER_FOLLOWED';

interface SystemEvent {
  type: SystemEventType;
  payload: any;
  timestamp: number;
}

type SystemCallback = (payload: any) => void;

class SystemBus {
  private listeners: Map<SystemEventType, SystemCallback[]> = new Map();

  subscribe(type: SystemEventType, callback: SystemCallback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)?.push(callback);
    return () => {
      const filtered = this.listeners.get(type)?.filter(cb => cb !== callback) || [];
      this.listeners.set(type, filtered);
    };
  }

  emit(type: SystemEventType, payload: any) {
    const event: SystemEvent = { type, payload, timestamp: Date.now() };
    console.debug(`[TrackCodex SystemBus] ${type}`, payload);
    this.listeners.get(type)?.forEach(cb => cb(payload));
    
    // Global side effects
    window.dispatchEvent(new CustomEvent('trackcodex-system-event', { detail: event }));
  }
}

export const systemBus = new SystemBus();
