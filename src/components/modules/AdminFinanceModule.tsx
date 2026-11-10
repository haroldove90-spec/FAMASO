import React, { useState } from 'react';
import {
  Coins,
  Shield,
  FileSpreadsheet,
  CheckCircle,
  Download,
  Phone,
  Mail,
  UserCheck,
  TrendingUp,
  Receipt,
  Eye,
  EyeOff,
  Search,
} from 'lucide-react';
import { WashService, Operator, UserAccount } from '../../types';

interface AdminFinanceModuleProps {
  washes: WashService[];
  operators: Operator[];
  users: UserAccount[];
}

export const AdminFinanceModule: React.FC<AdminFinanceModuleProps> = ({
  washes,
  operators,
  users,
}) => {
  const [activeTab, setActiveTab] = useState<'conciliacion' | 'operadores_privados' | 'productividad'>('conciliacion');
  const [showConfidentialData, setShowConfidentialData] = useState(true);
  const [searchOperator, setSearchOperator] = useState('');

  // Released services ready for billing
  const releasedWashes = washes.filter((w) => w.status === 'LIBERADA');

  const subtotal = releasedWashes.reduce((acc, curr) => acc + curr.servicePrice, 0);
  const iva = subtotal * 0.16;
  const totalFacturacion = subtotal + iva;

  const handleExportCSV = () => {
    const headers = 'Folio,Cliente,Economico,Placas,Servicio,FechaLiberacion,PrecioUnitarioMXN\n';
    const rows = releasedWashes
      .map(
        (w) =>
          `"${w.folio}","${w.clientName}","${w.unitEconomic}","${w.unitPlates}","${w.serviceName}","${w.releasedAt}",${w.servicePrice}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Conciliacion_FAMASO_${new Date().toISOString().substring(0, 10)}.csv`;
    link.click();
  };

  const filteredOperators = operators.filter(
    (op) =>
      op.fullName.toLowerCase().includes(searchOperator.toLowerCase()) ||
      op.employeeNumber.toLowerCase().includes(searchOperator.toLowerCase()) ||
      op.unitAssigned.toLowerCase().includes(searchOperator.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-mono tracking-tight uppercase flex items-center gap-2">
            <Coins className="w-5 h-5 text-orange-600" />
            Módulo de Administración y Finanzas FAMASO
          </h2>
          <p className="text-xs text-slate-500">
            Conciliación de facturación, auditoría privada de operadores y métricas de rentabilidad.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Exportar Conciliación CSV</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('conciliacion')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'conciliacion'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Conciliación de Facturación ({releasedWashes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('operadores_privados')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'operadores_privados'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>OPERADORES_PRIVADOS (Confidencial)</span>
        </button>

        <button
          onClick={() => setActiveTab('productividad')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'productividad'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Productividad y Tiempos</span>
        </button>
      </div>

      {/* TAB 1: Conciliación de Servicios Liberados para Facturación */}
      {activeTab === 'conciliacion' && (
        <div className="space-y-6">
          {/* Summary Financial Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                Subtotal Servicios Concluidos
              </span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                ${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {releasedWashes.length} unidades liberadas con certificado
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                IVA Trasladado (16%)
              </span>
              <div className="text-2xl font-extrabold text-slate-700 mt-1 font-mono">
                ${iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Tasa legal aplicable
              </span>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-5 rounded-2xl text-white shadow-md">
              <span className="text-[10px] font-bold text-orange-200 uppercase font-mono">
                Total a Facturar Fast Food Road
              </span>
              <div className="text-2xl font-extrabold mt-1 font-mono">
                ${totalFacturacion.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </div>
              <span className="text-[11px] text-orange-100 mt-1 block">
                Liquidación quincenal acordada
              </span>
            </div>
          </div>

          {/* Table of Released Services */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>SERVICIOS LIBERADOS CONCILIADOS</span>
              <span className="text-emerald-600 font-bold">Listos para Emisión CFDI</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3.5">Folio / Certificado</th>
                    <th className="p-3.5">Cliente</th>
                    <th className="p-3.5">Económico & Placas</th>
                    <th className="p-3.5">Servicio Aplicado</th>
                    <th className="p-3.5">Liberación</th>
                    <th className="p-3.5 text-right">Tarifa Unitaria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {releasedWashes.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3.5 font-mono">
                        <span className="font-bold text-orange-600 block">{w.folio}</span>
                        <span className="text-[10px] text-slate-400">
                          {w.certificateId || 'CERT-AUT'}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">{w.clientName}</td>
                      <td className="p-3.5 font-mono">
                        <strong className="text-slate-900">{w.unitEconomic}</strong>
                        <span className="text-slate-500 block text-[11px]">{w.unitPlates}</span>
                      </td>
                      <td className="p-3.5 text-slate-700">{w.serviceName}</td>
                      <td className="p-3.5 font-mono text-slate-600">{w.releasedAt}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                        ${w.servicePrice.toFixed(2)} MXN
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OPERADORES_PRIVADOS (Confidencial) */}
      {activeTab === 'operadores_privados' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <strong className="block">TABLA CONFIDENCIAL Y PRIVADA DE OPERADORES</strong>
                <span>
                  Esta vista contiene teléfonos particulares, datos médicos de emergencia y licencias. Bloqueada por Security Filters para el rol CLIENTE.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowConfidentialData(!showConfidentialData)}
              className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-bold text-amber-800 flex items-center gap-1.5 hover:bg-amber-100 transition"
            >
              {showConfidentialData ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showConfidentialData ? 'Ocultar Datos' : 'Mostrar Datos'}</span>
            </button>
          </div>

          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar operador privado..."
              value={searchOperator}
              onChange={(e) => setSearchOperator(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3.5">No. Empleado / Nombre</th>
                    <th className="p-3.5">Unidad Habitual</th>
                    <th className="p-3.5">Teléfono Privado</th>
                    <th className="p-3.5">Correo Confidencial</th>
                    <th className="p-3.5">Contacto Emergencia</th>
                    <th className="p-3.5">Licencia & Vencimiento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredOperators.map((op) => (
                    <tr key={op.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3.5">
                        <span className="font-mono text-orange-600 font-bold block">
                          {op.employeeNumber}
                        </span>
                        <strong className="text-slate-900">{op.fullName}</strong>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-700">
                        {op.unitAssigned}
                      </td>
                      <td className="p-3.5 font-mono text-slate-800">
                        {showConfidentialData ? op.phonePrivate : '•••• •••• ••••'}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">
                        {showConfidentialData ? op.emailPrivate : '••••••••@••••.com'}
                      </td>
                      <td className="p-3.5 text-slate-700">
                        {showConfidentialData ? op.emergencyContact : '••••••••••••••••'}
                      </td>
                      <td className="p-3.5 font-mono">
                        <span className="text-slate-900 block font-bold">
                          {showConfidentialData ? op.licenseNumber : '••••••••'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Expira: {op.licenseExpiry}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Productividad Global */}
      {activeTab === 'productividad' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase font-mono block">
              Tiempo Promedio de Bahía
            </span>
            <div className="text-3xl font-extrabold text-orange-600 font-mono">
              38.5 <span className="text-base text-slate-500 font-sans font-medium">min/unidad</span>
            </div>
            <p className="text-xs text-slate-500">
              Objetivo operativo: 45 min máximo. Rendimiento: +14% eficiencia en turno matutino.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase font-mono block">
              Tasa de Aprobación Primera Inspección
            </span>
            <div className="text-3xl font-extrabold text-emerald-600 font-mono">
              96.2%
            </div>
            <p className="text-xs text-slate-500">
              Cumplimiento microbiológico NOM-251 y sellado de inocuidad en cajas frías.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase font-mono block">
              Capacidad Instalada de Patio
            </span>
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              24 <span className="text-base text-slate-500 font-sans font-medium">unidades/día</span>
            </div>
            <p className="text-xs text-slate-500">
              Operación con 2 bahías activas de lavado simultáneo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
