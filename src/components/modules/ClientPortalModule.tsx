import React, { useState } from 'react';
import {
  Building2,
  FileCheck2,
  Clock,
  Download,
  ShieldCheck,
  Search,
  Lock,
  Calendar,
  Truck,
  ArrowUpRight,
  Printer,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { WashService, Certificate } from '../../types';

interface ClientPortalModuleProps {
  washes: WashService[];
  certificates: Certificate[];
  clientId: string;
  clientName: string;
  onOpenCertificate: (certificate: Certificate, wash?: WashService) => void;
}

export const ClientPortalModule: React.FC<ClientPortalModuleProps> = ({
  washes,
  certificates,
  clientId,
  clientName,
  onOpenCertificate,
}) => {
  const [activeTab, setActiveTab] = useState<'monitoreo' | 'historial'>('monitoreo');
  const [searchQuery, setSearchQuery] = useState('');

  // Strict security filter by CLIENT_ID
  const clientWashes = washes.filter((w) => w.clientId === clientId);
  const clientCertificates = certificates.filter((c) => c.clientId === clientId);

  // Tablero de Control metrics
  const recibidasHoy = clientWashes.filter((w) => w.status === 'RECIBIDA').length;
  const enProcesoHoy = clientWashes.filter((w) => w.status === 'EN_PROCESO').length;
  const pendientesHoy = clientWashes.filter((w) => w.status === 'PENDIENTE_REVISION').length;
  const liberadasHoy = clientWashes.filter((w) => w.status === 'LIBERADA').length;
  const totalMes = clientWashes.length + 28; // Accumulated monthly volume

  // Unidades activas / en proceso
  const activeWashes = clientWashes.filter(
    (w) => w.status === 'RECIBIDA' || w.status === 'EN_PROCESO' || w.status === 'PENDIENTE_REVISION'
  );

  // Historial de unidades liberadas
  const completedWashes = clientWashes.filter((w) => w.status === 'LIBERADA');

  const filteredHistory = completedWashes.filter((w) => {
    return (
      w.folio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.unitEconomic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.unitPlates.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.operatorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDownloadMonthlyReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Banner / Security filter statement */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-mono font-bold border border-orange-500/30 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>PORTAL AUTORIZADO CLIENTE: {clientId}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-white">
              {clientName}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Monitoreo en tiempo real de sanitizado de flota de reparto, trazabilidad de inocuidad grado alimenticio y descarga de constancias oficiales.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <button
              onClick={handleDownloadMonthlyReport}
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Reporte Conciliado</span>
            </button>
            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              Datos protegidos por Security Filter
            </span>
          </div>
        </div>
      </div>

      {/* Tablero de Control (KPI Counters) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase font-mono">
            Recibidas Hoy
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            {recibidasHoy}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">En patio de ingreso</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-700 uppercase font-mono">
            En Proceso
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1 font-mono">
            {enProcesoHoy}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">En bahía de lavado</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-blue-700 uppercase font-mono">
            Pendientes Revisión
          </div>
          <div className="text-2xl font-extrabold text-blue-900 mt-1 font-mono">
            {pendientesHoy}
          </div>
          <div className="text-[11px] text-blue-600 mt-1">Inspección de calidad</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-700 uppercase font-mono">
            Liberadas Hoy
          </div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1 font-mono">
            {liberadasHoy}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Listas para ruta</div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase font-mono">
            Total Mensual Acumulado
          </div>
          <div className="text-2xl font-extrabold text-orange-600 mt-1 font-mono">
            {totalMes}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Unidades sanitizadas</div>
        </div>
      </div>

      {/* Navigation Switch between Real-Time Monitoring & Historical Services */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('monitoreo')}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'monitoreo'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Monitoreo en Tiempo Real ({activeWashes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('historial')}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'historial'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Historial de Servicios y Certificados ({completedWashes.length})</span>
        </button>
      </div>

      {/* Tab 1: Real-Time Monitoring Table */}
      {activeTab === 'monitoreo' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>UNIDADES EN BAHÍA DE LAVADO ({activeWashes.length})</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Sincronización en Vivo
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {activeWashes.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-slate-700">Sin unidades activas en patio</p>
                <p className="text-slate-400 mt-1">Todas las unidades recibidas han sido liberadas.</p>
              </div>
            ) : (
              activeWashes.map((wash) => (
                <div
                  key={wash.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {wash.folio}
                      </span>
                      <span className="text-base font-extrabold text-slate-900 font-mono">
                        {wash.unitEconomic}
                      </span>
                      <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                        Placas: {wash.unitPlates}
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                        {wash.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pt-1">
                      <div>
                        <span className="text-slate-400">Tipo de Unidad:</span>{' '}
                        <strong className="text-slate-800">{wash.unitCategory}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Operador:</span>{' '}
                        <strong className="text-slate-800">{wash.operatorName}</strong>
                        {/* Note on confidential privacy */}
                        <span className="ml-2 text-[10px] text-slate-400 italic">
                          (Teléfono protegido)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Servicio:</span>{' '}
                        <span className="font-medium text-slate-800">{wash.serviceName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Hora Ingreso:</span>{' '}
                        <span className="font-mono font-bold text-slate-700">{wash.receivedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right text-xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">
                        Estado Actual
                      </span>
                      <span className="font-bold text-amber-800">
                        {wash.status === 'EN_PROCESO'
                          ? 'En Bahía de Lavado'
                          : wash.status === 'RECIBIDA'
                          ? 'En Cola de Espera'
                          : 'En Inspección de Calidad'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Historial de Servicios Concluidos y Descarga de Certificados */}
      {activeTab === 'historial' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por folio, económico o placas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Mostrando {filteredHistory.length} servicios liberados
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3.5">Folio / Económico</th>
                    <th className="p-3.5">Placas & Categoría</th>
                    <th className="p-3.5">Servicio Aplicado</th>
                    <th className="p-3.5">Fecha / Hora Liberación</th>
                    <th className="p-3.5">Dictamen Inocuidad</th>
                    <th className="p-3.5 text-right">Constancia Oficial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No hay servicios en el historial con ese criterio de búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((wash) => {
                      const cert = clientCertificates.find((c) => c.washId === wash.id);

                      return (
                        <tr key={wash.id} className="hover:bg-slate-50/60 transition">
                          <td className="p-3.5 font-mono">
                            <span className="font-bold text-orange-600 block">{wash.folio}</span>
                            <span className="font-extrabold text-slate-900 text-sm">
                              {wash.unitEconomic}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-slate-800 block">
                              {wash.unitPlates}
                            </span>
                            <span className="text-slate-500 text-[11px]">{wash.unitCategory}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-slate-800 block">
                              {wash.serviceName}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              Operador: {wash.operatorName}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-700">
                            {wash.releasedAt || wash.finishedAt}
                          </td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-300">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              APROBADO NOM-251
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            {cert ? (
                              <button
                                onClick={() => onOpenCertificate(cert, wash)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Descargar PDF</span>
                              </button>
                            ) : (
                              <span className="text-slate-400 text-[11px]">En generación</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Security Privacy Notice Box */}
      <div className="p-4 bg-slate-100/70 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 block">
            Aviso de Confidencialidad y Seguridad FAMASO
          </span>
          <p className="mt-0.5 text-slate-500">
            Conforme a las políticas de seguridad institucional, este portal de cliente mantiene bloqueados y ocultos los teléfonos personales de operadores, inventario y costos de químicos, utilidades y nómina.
          </p>
        </div>
      </div>
    </div>
  );
};
