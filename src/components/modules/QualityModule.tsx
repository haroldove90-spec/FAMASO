import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Camera,
  AlertTriangle,
  Upload,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  WashService,
  InspectionRecord,
  InspectionItem,
  Certificate,
} from '../../types';
import { DEFAULT_INSPECTION_ITEMS } from '../../data/mockData';

interface QualityModuleProps {
  washes: WashService[];
  onApproveAndRelease: (
    washId: string,
    inspection: InspectionRecord,
    newCertificate: Certificate
  ) => void;
  onRequireCorrection: (washId: string, inspection: InspectionRecord) => void;
  currentInspectorName: string;
  selectedWashForInspection?: WashService | null;
  onClearSelectedWash?: () => void;
  onOpenCertificate: (cert: Certificate, wash: WashService) => void;
}

export const QualityModule: React.FC<QualityModuleProps> = ({
  washes,
  onApproveAndRelease,
  onRequireCorrection,
  currentInspectorName,
  selectedWashForInspection,
  onClearSelectedWash,
  onOpenCertificate,
}) => {
  // Units waiting for inspection
  const pendingInspectionWashes = washes.filter(
    (w) => w.status === 'PENDIENTE_REVISION'
  );
  // Units already inspected & released
  const inspectedWashes = washes.filter(
    (w) => w.inspection && w.status === 'LIBERADA'
  );

  // Active target unit being inspected
  const [activeWashId, setActiveWashId] = useState<string>(
    selectedWashForInspection?.id || pendingInspectionWashes[0]?.id || ''
  );

  const currentWash = washes.find((w) => w.id === activeWashId);

  // Form state for inspection
  const [checklist, setChecklist] = useState<InspectionItem[]>(
    currentWash?.inspection?.items || DEFAULT_INSPECTION_ITEMS
  );
  const [observations, setObservations] = useState<string>(
    currentWash?.inspection?.observations ||
      'Lavado completado conforme a especificaciones de inocuidad Fast Food Road.'
  );
  const [photos, setPhotos] = useState<string[]>(
    currentWash?.inspection?.photos || [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    ]
  );
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [reworkNotes, setReworkNotes] = useState('');

  const toggleCheckItem = (itemId: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, passed: !item.passed } : item
      )
    );
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl) return;
    setPhotos((prev) => [...prev, newPhotoUrl]);
    setNewPhotoUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApproveInspection = () => {
    if (!currentWash) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const hash = 'a' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 10);
    const certNumber = `FAMASO-FFR-${currentWash.folio.replace('FOL-', '')}`;

    const inspectionRecord: InspectionRecord = {
      inspectionId: `INSP-${currentWash.id}`,
      inspectorName: currentInspectorName,
      inspectedAt: nowStr,
      verdict: 'APROBADO',
      items: checklist,
      observations: observations,
      photos: photos,
    };

    const newCertificate: Certificate = {
      id: `CERT-${currentWash.id}`,
      certificateNumber: certNumber,
      washId: currentWash.id,
      folio: currentWash.folio,
      unitEconomic: currentWash.unitEconomic,
      unitPlates: currentWash.unitPlates,
      clientName: currentWash.clientName,
      clientId: currentWash.clientId,
      serviceName: currentWash.serviceName,
      releasedAt: nowStr,
      supervisorName: currentWash.supervisorResponsible,
      inspectorName: currentInspectorName,
      driveUrl: `https://drive.google.com/file/d/FAMASO-CERT-${currentWash.folio}-${currentWash.unitEconomic}/view?usp=sharing`,
      hashVerification: hash,
      qrCodeData: `https://famaso.mx/validar?cert=${certNumber}&hash=${hash}`,
      temperatureSanitized: true,
      biocidalValidation: true,
      foodSafetyCertified: true,
    };

    onApproveAndRelease(currentWash.id, inspectionRecord, newCertificate);

    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleRequireCorrectionSubmit = () => {
    if (!currentWash) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const inspectionRecord: InspectionRecord = {
      inspectionId: `INSP-${currentWash.id}`,
      inspectorName: currentInspectorName,
      inspectedAt: nowStr,
      verdict: 'REQUIERE_CORRECCION',
      items: checklist,
      observations: observations,
      photos: photos,
      reworkNotes: reworkNotes || 'Retrabajo requerido en bahía de lavado.',
      reworkCompleted: false,
    };

    onRequireCorrection(currentWash.id, inspectionRecord);
  };

  const allItemsPassed = checklist.every((i) => i.passed);

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-mono tracking-tight uppercase flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-emerald-600" />
            Módulo de Calidad e Inspección de Inocuidad
          </h2>
          <p className="text-xs text-slate-500">
            Revisión física estricta, dictamen (Aprobado / Corrección) y evidencias fotográficas previas a liberación.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg border border-amber-300">
            {pendingInspectionWashes.length} Pendientes de Dictamen
          </span>
        </div>
      </div>

      {/* Main Grid: Selector / Current Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Queue of Units Pending Inspection */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase font-mono">
              Unidades en Espera de Dictamen
            </span>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              Piso
            </span>
          </div>

          <div className="p-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[600px]">
            {pendingInspectionWashes.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-slate-700">Sin unidades en espera</p>
                <p className="text-slate-400 mt-1">Todas las unidades en patio han sido inspeccionadas.</p>
              </div>
            ) : (
              pendingInspectionWashes.map((wash) => {
                const isSelected = wash.id === activeWashId;

                return (
                  <button
                    key={wash.id}
                    onClick={() => {
                      setActiveWashId(wash.id);
                      setChecklist(DEFAULT_INSPECTION_ITEMS);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition cursor-pointer mb-1 ${
                      isSelected
                        ? 'bg-orange-50 border-2 border-orange-500 shadow-xs'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-orange-600">
                        {wash.folio}
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                        Fin Lavado
                      </span>
                    </div>
                    <div className="mt-1 font-bold text-slate-900 text-sm font-mono">
                      {wash.unitEconomic} - {wash.unitPlates}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {wash.unitCategory}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Operador: {wash.operatorName}
                    </div>
                  </button>
                );
              })
            )}

            {/* Historical Inspected units shortcut */}
            {inspectedWashes.length > 0 && (
              <div className="pt-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase font-mono px-2 mb-2">
                  Historial Reciente Aprobado ({inspectedWashes.length})
                </div>
                {inspectedWashes.slice(0, 3).map((w) => (
                  <div
                    key={w.id}
                    className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs mb-1.5 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-emerald-950 font-mono">{w.unitEconomic}</span>
                      <span className="text-emerald-700 block text-[10px]">
                        Dictamen: APROBADO
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (w.certificateId) {
                          onOpenCertificate(
                            {
                              id: w.certificateId,
                              certificateNumber: `FAMASO-FFR-${w.folio.replace('FOL-', '')}`,
                              washId: w.id,
                              folio: w.folio,
                              unitEconomic: w.unitEconomic,
                              unitPlates: w.unitPlates,
                              clientName: w.clientName,
                              clientId: w.clientId,
                              serviceName: w.serviceName,
                              releasedAt: w.releasedAt || '2026-11-09',
                              supervisorName: w.supervisorResponsible,
                              inspectorName: w.inspection?.inspectorName || currentInspectorName,
                              driveUrl: w.driveFileUrl || 'https://drive.google.com',
                              hashVerification: 'a9f24e78b10c4391e457d19e0b82fa',
                              qrCodeData: 'https://famaso.mx/validar',
                              temperatureSanitized: true,
                              biocidalValidation: true,
                              foodSafetyCertified: true,
                            },
                            w
                          );
                        }
                      }}
                      className="text-xs font-bold text-emerald-700 hover:underline"
                    >
                      Ver Cert
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Inspection Checklist & Evidence Capturing */}
        <div className="lg:col-span-2 space-y-6">
          {currentWash ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
              {/* Unit Header in Checklist */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {currentWash.folio}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono">
                      {currentWash.unitEconomic} ({currentWash.unitPlates})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentWash.clientName} | {currentWash.serviceName}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">
                    Auditor Responsable
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {currentInspectorName}
                  </span>
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wide flex items-center justify-between">
                  <span>Criterios de Inspección Física y Desinfección</span>
                  <span className="text-[11px] text-orange-600 font-semibold lowercase">
                    {checklist.filter((i) => i.passed).length} de {checklist.length} cumplidos
                  </span>
                </h4>

                <div className="space-y-2">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleCheckItem(item.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                        item.passed
                          ? 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                          : 'bg-red-50/60 border-red-200 text-slate-900'
                      }`}
                    >
                      <button
                        type="button"
                        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition ${
                          item.passed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {item.passed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </button>
                      <div className="flex-1 text-xs">
                        <span className="font-semibold block">{item.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono uppercase mt-0.5 block">
                          Categoría: {item.category}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.passed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.passed ? 'CONFORME' : 'NO CONFORME'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photographic Evidences */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wide flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-orange-600" />
                    <span>Evidencia Fotográfica de Calidad ({photos.length})</span>
                  </h4>
                  <label className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Photo grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {photos.map((src, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100"
                    >
                      <img
                        src={src}
                        alt={`Evidencia ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[9px] text-white font-mono">
                          Evidencia #{idx + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Optional Photo URL */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="O pegar URL de imagen de evidencia..."
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {/* Observations & Rework Notes */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Observaciones Generales de la Inspección
                  </label>
                  <textarea
                    rows={2}
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Registrar condiciones de secado, inocuidad de sellos o notas..."
                  />
                </div>

                {!allItemsPassed && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-red-800 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Instrucciones de Retrabajo Requerido</span>
                    </div>
                    <textarea
                      rows={2}
                      value={reworkNotes}
                      onChange={(e) => setReworkNotes(e.target.value)}
                      placeholder="Describir los puntos que deben corregirse en bahía de lavado..."
                      className="w-full text-xs p-2 bg-white border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}
              </div>

              {/* Dictamen Formal Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={handleRequireCorrectionSubmit}
                  className="w-full sm:w-auto px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>REQUIERE CORRECCIÓN (Retrabajo)</span>
                </button>

                <button
                  onClick={handleApproveInspection}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>DICTAMEN: APROBADO (Liberar y Generar PDF)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <ClipboardCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-slate-700">Selecciona una unidad de la lista para inspeccionar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
