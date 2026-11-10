export type Role = 'SUPERVISOR' | 'CLIENTE' | 'ADMIN_FAMASO' | 'CALIDAD';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: Role;
  roleTitle: string;
  clientId?: string;
  clientName?: string;
  avatar?: string;
}

export interface Client {
  id: string;
  code: string;
  name: string;
  rfc: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  active: boolean;
  totalUnits: number;
}

export interface Unit {
  id: string;
  clientId: string;
  clientName: string;
  economicNumber: string;
  plates: string;
  category: 'Caja Refrigerada 3.5T' | 'Caja Seca 4.5T' | 'Rabón Térmico Inocuo' | 'Torthon Grado Alimenticio' | 'Camioneta Reparto Exprés';
  brandModel: string;
  assignedOperator: string;
  status: 'DISPONIBLE' | 'EN_LAVADO' | 'EN_RUTA';
}

export interface Operator {
  id: string;
  employeeNumber: string;
  fullName: string;
  unitAssigned: string;
  active: boolean;
  // Private / confidential fields (Restricted to FAMASO Admin/Staff, hidden from Client)
  phonePrivate: string;
  emailPrivate: string;
  emergencyContact: string;
  medicalNotes: string;
  licenseNumber: string;
  licenseExpiry: string;
}

export interface FamasoPersonnel {
  id: string;
  employeeNumber: string;
  name: string;
  position: 'Supervisor de Patio' | 'Auditor de Calidad e Inocuidad' | 'Auditora de Calidad e Inocuidad' | 'Técnico de Lavado Especializado' | 'Jefe de Operaciones';
  shift: string;
  phone: string;
  active: boolean;
}

export interface OperationalShift {
  id: string;
  name: string;
  timeRange: string;
  supervisorName: string;
  activeUnitsCount: number;
}

export interface ServiceRate {
  id: string;
  code: string;
  name: string;
  description: string;
  unitPrice: number; // in MXN
  currency: string;
  estimatedMinutes: number;
  foodGradeCertificationIncluded: boolean;
}

export type WashStatus = 'RECIBIDA' | 'EN_PROCESO' | 'PENDIENTE_REVISION' | 'LIBERADA' | 'CANCELADA';

export interface InspectionItem {
  id: string;
  title: string;
  category: 'Caja Grado Alimenticio' | 'Exterior y Cristales' | 'Chasís y Rines' | 'Sellos e Inocuidad';
  passed: boolean;
}

export interface InspectionRecord {
  inspectionId: string;
  inspectorName: string;
  inspectedAt: string;
  verdict: 'APROBADO' | 'REQUIERE_CORRECCION';
  items: InspectionItem[];
  observations: string;
  photos: string[];
  reworkNotes?: string;
  reworkCompleted?: boolean;
}

export interface ChemicalUsage {
  chemicalId: string;
  chemicalName: string;
  amountLiters: number;
}

export interface WashService {
  id: string; // Internal UNIQUEID()
  folio: string; // Visible consecutive folio e.g. FOL-2026-0891
  clientId: string;
  clientName: string;
  unitEconomic: string;
  unitPlates: string;
  unitCategory: string;
  operatorId: string;
  operatorName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  shiftId: string;
  shiftName: string;
  status: WashStatus;
  receivedAt: string;
  startedAt?: string;
  finishedAt?: string;
  releasedAt?: string;
  supervisorResponsible: string;
  cancellationReason?: string;
  notes?: string;
  chemicalsApplied: ChemicalUsage[];
  inspection?: InspectionRecord;
  certificateId?: string;
  driveFileUrl?: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  washId: string;
  folio: string;
  unitEconomic: string;
  unitPlates: string;
  clientName: string;
  clientId: string;
  serviceName: string;
  releasedAt: string;
  supervisorName: string;
  inspectorName: string;
  driveUrl: string;
  hashVerification: string;
  qrCodeData: string;
  temperatureSanitized: boolean;
  biocidalValidation: boolean;
  foodSafetyCertified: boolean;
}

export interface ChemicalItem {
  id: string;
  code: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  unitCost: number;
  supplier: string;
  safetyDataSheetUrl: string;
  technicalSpecs: string;
  hazardClass: string;
}

export interface ChemicalMovement {
  id: string;
  chemicalId: string;
  chemicalName: string;
  type: 'ENTRADA' | 'SALIDA';
  quantity: number;
  unit: string;
  date: string;
  referenceFolio?: string;
  reason: string;
  registeredBy: string;
}
