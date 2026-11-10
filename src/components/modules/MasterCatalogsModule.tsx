import React, { useState } from 'react';
import {
  Database,
  Building2,
  Truck,
  Users,
  Clock,
  Tag,
  Plus,
  Edit2,
  Check,
  Shield,
  Search,
} from 'lucide-react';
import {
  Client,
  Unit,
  Operator,
  FamasoPersonnel,
  OperationalShift,
  ServiceRate,
} from '../../types';

interface MasterCatalogsModuleProps {
  clients: Client[];
  units: Unit[];
  operators: Operator[];
  personnel: FamasoPersonnel[];
  shifts: OperationalShift[];
  services: ServiceRate[];
  onAddUnit?: (unit: Unit) => void;
  onAddOperator?: (operator: Operator) => void;
}

export const MasterCatalogsModule: React.FC<MasterCatalogsModuleProps> = ({
  clients,
  units,
  operators,
  personnel,
  shifts,
  services,
}) => {
  const [activeTab, setActiveTab] = useState<'clientes' | 'unidades' | 'operadores' | 'personal' | 'turnos' | 'servicios'>('unidades');
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-mono tracking-tight uppercase flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-600" />
            Catálogos Maestros del Sistema FAMASO
          </h2>
          <p className="text-xs text-slate-500">
            Administración centralizada de clientes, flota de unidades, operadores, personal de patio y tarifas.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-bold gap-2">
        {[
          { id: 'unidades', label: `Unidades (${units.length})`, icon: Truck },
          { id: 'clientes', label: `Clientes (${clients.length})`, icon: Building2 },
          { id: 'operadores', label: `Operadores (${operators.length})`, icon: Users },
          { id: 'personal', label: `Personal FAMASO (${personnel.length})`, icon: Users },
          { id: 'turnos', label: `Turnos (${shifts.length})`, icon: Clock },
          { id: 'servicios', label: `Tarifas y Servicios (${services.length})`, icon: Tag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 px-3.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: UNIDADES */}
      {activeTab === 'unidades' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3.5">Económico</th>
                  <th className="p-3.5">Placas & Modelo</th>
                  <th className="p-3.5">Categoría Inocua</th>
                  <th className="p-3.5">Cliente / Propietario</th>
                  <th className="p-3.5">Operador Habitual</th>
                  <th className="p-3.5">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {units.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5 font-mono font-extrabold text-orange-600 text-sm">
                      {u.economicNumber}
                    </td>
                    <td className="p-3.5 font-mono">
                      <strong className="text-slate-900 block">{u.plates}</strong>
                      <span className="text-[11px] text-slate-500">{u.brandModel}</span>
                    </td>
                    <td className="p-3.5 text-slate-800 font-semibold">{u.category}</td>
                    <td className="p-3.5 text-slate-700">{u.clientName}</td>
                    <td className="p-3.5 text-slate-800">{u.assignedOperator}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: CLIENTES */}
      {activeTab === 'clientes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clients.map((c) => (
            <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                  {c.id}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  ACTIVO
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">{c.name}</h3>
              <div className="text-xs text-slate-600 space-y-1">
                <div><span className="text-slate-400">RFC:</span> <strong className="font-mono">{c.rfc}</strong></div>
                <div><span className="text-slate-400">Contacto:</span> {c.contactName}</div>
                <div><span className="text-slate-400">Email:</span> {c.contactEmail}</div>
                <div><span className="text-slate-400">Flota Registrada:</span> {c.totalUnits} unidades</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: OPERADORES VISIBLES */}
      {activeTab === 'operadores' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3.5">No. Empleado</th>
                  <th className="p-3.5">Nombre Completo</th>
                  <th className="p-3.5">Unidad Asignada</th>
                  <th className="p-3.5">Estado Operativo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {operators.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5 font-mono font-bold text-orange-600">
                      {op.employeeNumber}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900">{op.fullName}</td>
                    <td className="p-3.5 font-mono text-slate-800">{op.unitAssigned}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ACTIVO EN RUTA
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PERSONAL FAMASO */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {personnel.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 text-xs">
              <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">{p.employeeNumber}</span>
              <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
              <p className="text-orange-600 font-semibold text-xs">{p.position}</p>
              <div className="pt-2 border-t border-slate-100 text-slate-500 text-[11px]">
                <div>Turno: {p.shift}</div>
                <div>Teléfono: {p.phone}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: TURNOS */}
      {activeTab === 'turnos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shifts.map((sh) => (
            <div key={sh.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                {sh.id}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{sh.name}</h3>
              <p className="text-xs text-slate-600 font-mono">{sh.timeRange}</p>
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
                <span className="text-slate-400">Supervisor a cargo:</span> {sh.supervisorName}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: TARIFAS Y SERVICIOS */}
      {activeTab === 'servicios' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((srv) => (
            <div key={srv.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {srv.code}
                  </span>
                  <span className="font-mono text-lg font-extrabold text-slate-900">
                    ${srv.unitPrice.toFixed(2)} MXN
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{srv.name}</h3>
                <p className="text-xs text-slate-500">{srv.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Tiempo Est.: <strong>{srv.estimatedMinutes} min</strong></span>
                {srv.foodGradeCertificationIncluded && (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Incluye Certificado Inocuidad NOM-251
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
