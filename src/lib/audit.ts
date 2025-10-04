interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: Record<string, any>;
  version: number;
}

interface AuditLog {
  entries: AuditEntry[];
  currentVersion: number;
}

const AUDIT_KEY = 'pomorska-arena-audit-log';

export const addAuditEntry = (
  action: string,
  user: string,
  details: Record<string, any> = {}
): void => {
  try {
    const existing = localStorage.getItem(AUDIT_KEY);
    const auditLog: AuditLog = existing ? JSON.parse(existing) : { entries: [], currentVersion: 0 };
    
    const newVersion = auditLog.currentVersion + 1;
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      user,
      details,
      version: newVersion
    };
    
    auditLog.entries.push(entry);
    auditLog.currentVersion = newVersion;
    
    // Keep only last 100 entries to prevent localStorage bloat
    if (auditLog.entries.length > 100) {
      auditLog.entries = auditLog.entries.slice(-100);
    }
    
    localStorage.setItem(AUDIT_KEY, JSON.stringify(auditLog));
  } catch (error) {
    console.warn('Failed to add audit entry:', error);
  }
};

export const getAuditLog = (): AuditEntry[] => {
  try {
    const existing = localStorage.getItem(AUDIT_KEY);
    if (!existing) return [];
    
    const auditLog: AuditLog = JSON.parse(existing);
    return auditLog.entries.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.warn('Failed to get audit log:', error);
    return [];
  }
};

export const clearAuditLog = (): void => {
  try {
    localStorage.removeItem(AUDIT_KEY);
  } catch (error) {
    console.warn('Failed to clear audit log:', error);
  }
};
