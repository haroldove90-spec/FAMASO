import React from 'react';
import { ShieldAlert, UserCheck, Shield, KeyRound, CheckCircle2, Lock } from 'lucide-react';
import { UserAccount, Role } from '../../types';

interface SecurityModuleProps {
  users: UserAccount[];
  currentUser: UserAccount;
  onSwitchUser: (user: UserAccount) => void;
}

export const SecurityModule: React.FC<SecurityModuleProps> = ({
  users,
  currentUser,
  onSwitchUser,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-mono tracking-tight uppercase flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-600" />
            Módulo de Autenticación y Seguridad (USUARIOS_ROLES)
          </h2>
          <p className="text-xs text-slate-500">
            Control de acceso institucional, asignación de permisos y reglas de Security Filters para segmentar datos internos y externos.
          </p>
        </div>
      </div>

      {/* Security Filters Explanation Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-orange-600 uppercase">
            <Lock className="w-4 h-4" />
            <span>Filtro de Seguridad: CLIENTE EXTERNO</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Regla de consulta estricta: <code className="bg-slate-100 px-1 py-0.5 rounded text-orange-700 font-mono font-bold">[CLIENTE_ID] = USER_CLIENTE_ID()</code>.
            Bloquea acceso a teléfonos personales de operadores, nómina, costos de químicos y utilidades.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-600 uppercase">
            <Shield className="w-4 h-4" />
            <span>Filtro de Seguridad: FAMASO INTERNO</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Regla de consulta total: <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono font-bold">[ACCESO] = 'OPERATIVO_FAMASO'</code>.
            Permite registro de patio, captura de tiempos, checklists de calidad, inventario químico y conciliación de servicios.
          </p>
        </div>
      </div>

      {/* Table USUARIOS_ROLES */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>CATÁLOGO DE CUENTAS AUTORIZADAS (USUARIOS_ROLES)</span>
          <span>AUTENTICACIÓN CORPORATIVA</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3.5">ID / Correo Institucional</th>
                <th className="p-3.5">Nombre & Puesto</th>
                <th className="p-3.5">Rol en Sistema</th>
                <th className="p-3.5">Security Filter Activo</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Sesión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {users.map((u) => {
                const isCurrent = u.id === currentUser.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5">
                      <span className="font-mono text-[10px] text-slate-400 block font-bold">
                        {u.id}
                      </span>
                      <strong className="text-slate-900 font-mono">{u.email}</strong>
                    </td>
                    <td className="p-3.5">
                      <strong className="text-slate-900 block">{u.name}</strong>
                      <span className="text-slate-500 text-[11px]">{u.roleTitle}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-xs">
                      {u.role === 'CLIENTE' ? (
                        <span className="text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                          CLIENTE_ID = 'CLI-FFR-001'
                        </span>
                      ) : (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          ALL (FAMASO Interno)
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ACTIVO
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {isCurrent ? (
                        <span className="px-3 py-1 bg-slate-900 text-white font-bold rounded-lg text-[10px]">
                          Sesión Actual
                        </span>
                      ) : (
                        <button
                          onClick={() => onSwitchUser(u)}
                          className="px-3 py-1 bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-700 font-bold rounded-lg text-[10px] transition"
                        >
                          Simular Acceso
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
