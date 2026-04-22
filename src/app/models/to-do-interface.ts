export interface Task {
  taskId: number;
  companyId: number;
  projectId: number;
  originType: 'AUDIT' | 'MANUAL' | 'CHAT';
  title: string;
  functionalSummary: string;
  assignedUserId: number;
  state: 'BACKLOG' | 'TODO' | 'DOING' | 'TEST' | 'DONE';
  createdBy: number;
  currentIteration: number;
  validationMode: 'EVIDENCE_ONLY' | 'FULL_SANDBOX' | 'PARTIAL_SANDBOX' | 'NONE';
  relatedTaskId: number | null;
  automationActive: boolean;
  automationBranchName: string | null;
  createdAt: string;
  updatedAt: string;
  orderIndex?: number;
  
  // Compatibilidad interna y legacy
  id: number;
  texto: string;
  estado: 'completada' | 'pendiente';
  asignadaA: number;
  priority: 'Low' | 'Medium' | 'High';
}

/**
 * Tipos de ítems que pueden existir en el Mise en Place
 */
export type MiseEnPlaceItemType = 
  | 'PROJECT_VERSION' 
  | 'REPOSITORY_CONFIG' 
  | 'AUDIT_REPORT' 
  | 'COMPANY_PROFILE' 
  | 'BILLING_STATUS';

/**
 * Estados posibles para los ítems del Mise en Place
 */
export type MiseEnPlaceStatus = 
  | 'ACTIVA' 
  | 'CONECTADO' 
  | 'COMPLETADO' 
  | 'VALIDADO' 
  | 'DISPONIBLE'
  | 'PENDIENTE'
  | 'ERROR';

/**
 * Interface base para cualquier ítem de Mise en Place
 */
export interface BaseMiseEnPlaceItem {
  itemId: string;
  projectId: number;
  companyId: number;
  itemType: MiseEnPlaceItemType;
  title: string;
  summary: string;
  status: MiseEnPlaceStatus | string;
  createdAt: string;
  updatedAt: string;
  priority?: 'Low' | 'Medium' | 'High';
  
  // Propiedades opcionales para facilitar el acceso en templates (evita errores TS7053/4111)
  versionNumber?: number;
  provider?: string;
  globalHealthScore?: number;
  
  // Compatibilidad con componentes genéricos de tablero
  id: number; 
  texto: string;
  orderIndex?: number;
}

export interface ProjectVersionItem extends BaseMiseEnPlaceItem {
  itemType: 'PROJECT_VERSION';
  sourceType: string;
  versionNumber: number;
  storageObjectId: string;
  uploadedByUserId: number;
  uploadedAt: string;
}

export interface RepositoryConfigItem extends BaseMiseEnPlaceItem {
  itemType: 'REPOSITORY_CONFIG';
  provider: string;
  defaultBranch: string;
  lastSyncAt: string;
}

export interface AuditReportItem extends BaseMiseEnPlaceItem {
  itemType: 'AUDIT_REPORT';
  auditId: number;
  auditStatus: string;
  globalHealthScore: number;
  premiumUnlocked: boolean;
}

export interface CompanyProfileItem extends BaseMiseEnPlaceItem {
  itemType: 'COMPANY_PROFILE';
  companyStatus: string;
  validatedByUserId: number;
}

export interface BillingStatusItem extends BaseMiseEnPlaceItem {
  itemType: 'BILLING_STATUS';
  invoiceScopeEnabled: string[];
}

/**
 * Unión de todos los posibles ítems de Mise en Place
 */
export type MiseEnPlaceItem = 
  | ProjectVersionItem 
  | RepositoryConfigItem 
  | AuditReportItem 
  | CompanyProfileItem 
  | BillingStatusItem 
  | BaseMiseEnPlaceItem;

export interface Column {
  id: string;
  name: string;
  tasks: (Task | MiseEnPlaceItem)[];
  isMiseEnPlace?: boolean;
}
