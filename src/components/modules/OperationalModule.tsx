import React, { useState } from 'react';
import {
  Car,
  Play,
  CheckCircle,
  FileCheck,
  PlusCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Flame,
  ArrowRight,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  WashService,
  WashStatus,
  Client,
  Unit,
  Operator,
  ServiceRate,
  OperationalShift,
  Certificate,
} from '../../types';

interface OperationalModuleProps {
  washes: WashService[];
  clients: Client[];
  units: Unit[];
  operators: Operator[];
  services: ServiceRate[];
  shifts: OperationalShift[];
  onAddWash: (newWash: WashService) => void;
  onUpdateWashStatus: (
    washId: string,
    newStatus: WashStatus,
    extraData?: Partial<WashService>
  ) => void;
  onOpenCertificate: (certificate: Certificate, wash: WashService) => void;
  onOpenInspectionModal: (wash: WashService) => void;
  currentSupervisorName: string;
}

export const OperationalModule: React.FC<OperationalModuleProps> = ({
  washes,
  clients,
  units,
  operators,
  services,
  shifts,
  onAddWash,
  onUpdateWashStatus,
  onOpenCertificate,
  onOpenInspectionModal,
  currentSupervisorName,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [cancellationModalWash, setCancellationModalWash] = useState<WashService | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  // Form state for new unit intake
  const [formData, setFormData] = useState({
    clientId: clients[0]?.id || 'CLI-FFR-001',
    economicNumber: 'FFR-102',
    plates: '98-AK-3B',
    category: 'Caja Refrigerada 3.5T' as Unit['category'],
    operatorId: operators[0]?.id || 'OP-01',
    serviceId: services[0]?.id || 'SRV-01',
    shiftId: shifts[0]?.id || 'SHF-01',
    notes: '',
  });

  // Filtered washes
  const filteredWashes = washes.filter((w) => {
    const matchesStatus = filterStatus === 'TODOS' || w.status === filterStatus;
    const matchesSearch =
      w.folio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.unitEconomic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.unitPlates.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.operatorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: WashStatus) => {
    switch (status) {
      case 'RECIBIDA':
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-500',
          label: '1. RECIBIDA',
        };
      case 'EN_PROCESO':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-500 animate-ping',
          label: '2. EN PROCESO',
        };
      case 'PENDIENTE_REVISION':
        return {
          bg: 'bg-blue-100 text-blue-900 border-blue-300',
          dot: 'bg-blue-500',
          label: '3. PENDIENTE REVISIÓN',
        };
      case 'LIBERADA':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-500',
          label: '4. LIBERADA',
        };
      case 'CANCELADA':
        return {
          bg: 'bg-red-100 text-red-900 border-red-300',
          dot: 'bg-red-500',
          label: 'CANCELADA',
        };
    }
  };

  const handleUnitSelectChange = (econ: string) => {
    const matched = units.find((u) => u.economicNumber === econ);
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        economicNumber: matched.economicNumber,
        plates: matched.plates,
        category: matched.category,
      }));
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === formData.clientId) || clients[0];
    const op = operators.find((o) => o.id === formData.operatorId) || operators[0];
    const srv = services.find((s) => s.id === formData.serviceId) || services[0];
    const shf = shifts.find((sh) => sh.id === formData.shiftId) || shifts[0];

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newFolioNumber = washes.length + 895;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newWash: WashService = {
      id: `UID-${randomSuffix}`,
      folio: `FOL-2026-0${newFolioNumber}`,
      clientId: client.id,
      clientName: client.name,
      unitEconomic: formData.economicNumber,
      unitPlates: formData.plates,
      unitCategory: formData.category,
      operatorId: op.id,
      operatorName: op.fullName,
      serviceId: srv.id,
      serviceName: srv.name,
      servicePrice: srv.unitPrice,
      shiftId: shf.id,
      shiftName: shf.name,
      status: 'RECIBIDA',
      receivedAt: nowStr,
      supervisorResponsible: currentSupervisorName,
      chemicalsApplied: [],
      notes: formData.notes,
    };

    onAddWash(newWash);
    setIsRegisterModalOpen(false);
  };

  const handleStartWash = (wash: WashService) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    onUpdateWashStatus(wash.id, 'EN_PROCESO', {
      startedAt: nowStr,
    });
  };

  const handleFinishWash = (wash: WashService) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    onUpdateWashStatus(wash.id, 'PENDIENTE_REVISION', {
      finishedAt: nowStr,
    });
  };

  const handleConfirmCancel = () => {
    if (!cancellationModalWash) return;
    onUpdateWashStatus(cancellationModalWash.id, 'CANCELADA', {
      cancellationReason: cancellationReason || 'Cancelación solicitada en patio por supervisor',
    });
    setCancellationModalWash(null);
    setCancellationReason('');
  };

  // KPI Counters
  const countRecibidas = washes.filter((w) => w.status === 'RECIBIDA').length;
  const countEnProceso = washes.filter((w) => w.status === 'EN_PROCESO').length;
  const countPendientes = washes.filter((w) => w.status === 'PENDIENTE_REVISION').length;
  const countLiberadas = washes.filter((w) => w.status === 'LIBERADA').length;

  return (
    <div className="space-y-6">
      {/* 5-Step Workflow Pipeline Diagram */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-mono tracking-tight uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              Flujo Operativo de Lavado e Inocuidad (5 Pasos)
            </h2>
            <p className="text-xs text-slate-500">
              Control de ingresos, tiempos de lavado, revisión de calidad y liberación automática.
            </p>
          </div>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Unidad</span>
          </button>
        </div>

        {/* Visual Pipeline */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>PASO 1</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">
                {countRecibidas}
              </span>
            </div>
            <div className="my-2">
              <div className="font-bold text-slate-900 text-sm">INGRESO</div>
              <div className="text-[11px] text-slate-500">Captura unidad & operador. Estatus: RECIBIDA</div>
            </div>
            <span className="text-[10px] text-orange-600 font-semibold flex items-center gap-1">
              Supervisor <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-amber-600 font-mono">
              <span>PASO 2</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 font-bold text-[10px]">
                {countEnProceso}
              </span>
            </div>
            <div className="my-2">
              <div className="font-bold text-amber-950 text-sm">LAVADO</div>
              <div className="text-[11px] text-amber-700">Bahía activa. Estatus: EN PROCESO</div>
            </div>
            <span className="text-[10px] text-amber-800 font-semibold flex items-center gap-1">
              Supervisor <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-blue-600 font-mono">
              <span>PASO 3</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-200 text-blue-800 font-bold text-[10px]">
                {countPendientes}
              </span>
            </div>
            <div className="my-2">
              <div className="font-bold text-blue-950 text-sm">REVISIÓN</div>
              <div className="text-[11px] text-blue-700">Checklist & evidencias. PENDIENTE REVISIÓN</div>
            </div>
            <span className="text-[10px] text-blue-800 font-semibold flex items-center gap-1">
              Supervisor / Calidad <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-emerald-600 font-mono">
              <span>PASO 4</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 font-bold text-[10px]">
                {countLiberadas}
              </span>
            </div>
            <div className="my-2">
              <div className="font-bold text-emerald-950 text-sm">LIBERACIÓN</div>
              <div className="text-[11px] text-emerald-700">Aprueba revisión, estatus LIBERADA & PDF</div>
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
              Automático <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="col-span-2 md:col-span-1 p-3 rounded-xl bg-purple-50/70 border border-purple-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-purple-600 font-mono">
              <span>PASO 5</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-200 text-purple-800 font-bold text-[10px]">
                PORTAL
              </span>
            </div>
            <div className="my-2">
              <div className="font-bold text-purple-950 text-sm">CONSULTA / CIERRE</div>
              <div className="text-[11px] text-purple-700">Cliente descarga PDF y Admin concilia</div>
            </div>
            <span className="text-[10px] text-purple-800 font-semibold">
              Cliente & Finanzas
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['TODOS', 'RECIBIDA', 'EN_PROCESO', 'PENDIENTE_REVISION', 'LIBERADA'].map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => setFilterStatus(statusKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterStatus === statusKey
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {statusKey === 'TODOS'
                ? 'Todos los Estados'
                : statusKey.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por folio, placas, económico u operador..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Operative Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>REGISTROS EN PISO ({filteredWashes.length})</span>
          <span>TIEMPO REAL: SUPERVISOR FAMASO</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredWashes.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Car className="w-12 h-12 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-sm font-medium">No se encontraron servicios de lavado con estos filtros.</p>
            </div>
          ) : (
            filteredWashes.map((wash) => {
              const badge = getStatusBadge(wash.status);

              return (
                <div
                  key={wash.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/60 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                        {wash.folio}
                      </span>
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {wash.unitEconomic}
                      </span>
                      <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                        {wash.unitPlates}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">
                          Cliente & Categoría
                        </span>
                        <span className="font-semibold text-slate-800">{wash.clientName}</span>
                        <span className="text-slate-500 block text-[11px]">{wash.unitCategory}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">
                          Operador Asignado
                        </span>
                        <span className="font-medium text-slate-800">{wash.operatorName}</span>
                        <span className="text-slate-500 block text-[11px]">Turno: {wash.shiftName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">
                          Servicio Solicitado
                        </span>
                        <span className="font-semibold text-slate-800">{wash.serviceName}</span>
                        <span className="text-emerald-700 font-mono font-bold block text-[11px]">
                          ${wash.servicePrice.toFixed(2)} MXN
                        </span>
                      </div>
                    </div>

                    {/* Timeline row */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Ingreso: <strong>{wash.receivedAt}</strong>
                      </span>
                      {wash.startedAt && (
                        <span>
                          Inicio: <strong>{wash.startedAt}</strong>
                        </span>
                      )}
                      {wash.finishedAt && (
                        <span>
                          Fin Lavado: <strong>{wash.finishedAt}</strong>
                        </span>
                      )}
                      {wash.releasedAt && (
                        <span className="text-emerald-700 font-bold">
                          Liberada: {wash.releasedAt}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions depending on current status */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {wash.status === 'RECIBIDA' && (
                      <button
                        onClick={() => handleStartWash(wash)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                        title="Iniciar proceso de lavado y marcar tiempo"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Pasar a EN PROCESO</span>
                      </button>
                    )}

                    {wash.status === 'EN_PROCESO' && (
                      <button
                        onClick={() => handleFinishWash(wash)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                        title="Finalizar lavado y enviar a revisión de calidad"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Fin Lavado (REVISIÓN)</span>
                      </button>
                    )}

                    {wash.status === 'PENDIENTE_REVISION' && (
                      <button
                        onClick={() => onOpenInspectionModal(wash)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                        title="Realizar inspección de calidad física y dictaminar"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Inspeccionar & Liberar</span>
                      </button>
                    )}

                    {wash.status === 'LIBERADA' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (wash.certificateId) {
                              onOpenCertificate(
                                {
                                  id: wash.certificateId,
                                  certificateNumber: `FAMASO-FFR-${wash.folio.replace('FOL-', '')}`,
                                  washId: wash.id,
                                  folio: wash.folio,
                                  unitEconomic: wash.unitEconomic,
                                  unitPlates: wash.unitPlates,
                                  clientName: wash.clientName,
                                  clientId: wash.clientId,
                                  serviceName: wash.serviceName,
                                  releasedAt: wash.releasedAt || '2026-11-09',
                                  supervisorName: wash.supervisorResponsible,
                                  inspectorName: wash.inspection?.inspectorName || currentSupervisorName,
                                  driveUrl: wash.driveFileUrl || 'https://drive.google.com',
                                  hashVerification: 'e79b8a221f4560cd88',
                                  qrCodeData: 'https://famaso.mx/validar',
                                  temperatureSanitized: true,
                                  biocidalValidation: true,
                                  foodSafetyCertified: true,
                                },
                                wash
                              );
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-orange-400" />
                          <span>Certificado PDF</span>
                        </button>
                        {wash.driveFileUrl && (
                          <a
                            href={wash.driveFileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Ver en Google Drive"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}

                    {wash.status !== 'LIBERADA' && wash.status !== 'CANCELADA' && (
                      <button
                        onClick={() => setCancellationModalWash(wash)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Registrar cancelación justificada"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal: Registrar Ingreso de Unidad */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-sm sm:text-base font-mono uppercase tracking-tight">
                  Registro de Ingreso a Patio
                </h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Cliente / Transportista
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    No. Económico Unidad
                  </label>
                  <select
                    value={formData.economicNumber}
                    onChange={(e) => handleUnitSelectChange(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono font-bold"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.economicNumber}>
                        {u.economicNumber} - {u.category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Placas de Circulación
                  </label>
                  <input
                    type="text"
                    value={formData.plates}
                    onChange={(e) => setFormData({ ...formData, plates: e.target.value })}
                    required
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Operador en Turno
                  </label>
                  <select
                    value={formData.operatorId}
                    onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {operators.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.fullName} ({op.employeeNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Servicio Solicitado
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - ${s.unitPrice.toFixed(2)} MXN
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Turno Operativo
                  </label>
                  <select
                    value={formData.shiftId}
                    onChange={(e) => setFormData({ ...formData, shiftId: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {shifts.map((sh) => (
                      <option key={sh.id} value={sh.id}>
                        {sh.name} ({sh.timeRange})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Supervisor Asignado
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentSupervisorName}
                    className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Notas de Ingreso / Incidencias Previas
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre carga previa, rayones preexistentes o instrucciones..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                >
                  Confirmar Ingreso (RECIBIDA)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Justified Cancellation */}
      {cancellationModalWash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">
                Cancelar Servicio de Lavado
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Estás a punto de cancelar el servicio con folio{' '}
              <strong className="font-mono text-slate-900">{cancellationModalWash.folio}</strong>{' '}
              (Económico {cancellationModalWash.unitEconomic}).
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Motivo Obligatorio de Cancelación
              </label>
              <textarea
                rows={3}
                required
                placeholder="Ejemplo: Unidad retirada por emergencia de ruta logística de Fast Food Road..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCancellationModalWash(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Volver
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition"
              >
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
