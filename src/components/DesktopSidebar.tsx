import React from 'react';
import {
  Car,
  ClipboardCheck,
  FileCheck2,
  Building2,
  FlaskConical,
  Coins,
  Database,
  ShieldAlert,
  LogOut,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Role } from '../types';

export type ModuleType =
  | 'operativo'
  | 'calidad'
  | 'certificados'
  | 'cliente'
  | 'quimicos'
  | 'finanzas'
  | 'catalogos'
  | 'seguridad';

interface DesktopSidebarProps {
  activeModule: ModuleType;
  onChangeModule: (module: ModuleType) => void;
  activeRole: Role;
  isOpen: boolean;
  onLogout: () => void;
}

interface NavItemConfig {
  id: ModuleType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  allowedRoles: Role[];
  badge?: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'operativo',
    label: 'Control Operativo',
    icon: Car,
    description: 'Flujo 5 pasos de lavado y tiempos',
    allowedRoles: ['SUPERVISOR', 'ADMIN_FAMASO', 'CALIDAD'],
    badge: 'En Vivo',
  },
  {
    id: 'calidad',
    label: 'Calidad e Inspección',
    icon: ClipboardCheck,
    description: 'Checklists de inocuidad y evidencias',
    allowedRoles: ['SUPERVISOR', 'ADMIN_FAMASO', 'CALIDAD'],
  },
  {
    id: 'certificados',
    label: 'Certificados Digitales',
    icon: FileCheck2,
    description: 'Constancias PDF y Google Drive',
    allowedRoles: ['SUPERVISOR', 'ADMIN_FAMASO', 'CLIENTE', 'CALIDAD'],
  },
  {
    id: 'cliente',
    label: 'Portal Fast Food Road',
    icon: Building2,
    description: 'Monitoreo de flota y descargas',
    allowedRoles: ['CLIENTE', 'ADMIN_FAMASO'],
    badge: 'Filtrado',
  },
  {
    id: 'quimicos',
    label: 'Inventario de Químicos',
    icon: FlaskConical,
    description: 'Insumos, fichas HDS y stock',
    allowedRoles: ['ADMIN_FAMASO', 'CALIDAD'],
  },
  {
    id: 'finanzas',
    label: 'Finanzas y Conciliación',
    icon: Coins,
    description: 'Facturación y datos confidenciales',
    allowedRoles: ['ADMIN_FAMASO'],
  },
  {
    id: 'catalogos',
    label: 'Catálogos Maestros',
    icon: Database,
    description: 'Unidades, clientes y tarifas',
    allowedRoles: ['ADMIN_FAMASO', 'SUPERVISOR'],
  },
  {
    id: 'seguridad',
    label: 'Seguridad y Roles',
    icon: ShieldAlert,
    description: 'Filtros y cuentas autorizadas',
    allowedRoles: ['ADMIN_FAMASO'],
  },
];

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeModule,
  onChangeModule,
  activeRole,
  isOpen,
  onLogout,
}) => {
  const visibleItems = NAV_ITEMS.filter((item) =>
    item.allowedRoles.includes(activeRole)
  );

  if (!isOpen) return null;

  return (
    <aside className="hidden md:flex flex-col w-72 shrink-0 bg-white border-r border-slate-200/90 min-h-[calc(100vh-64px)] transition-all duration-300">
      {/* Role Context Ribbon */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-1">
          <span>ENTORNO ACTIVO</span>
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            ONLINE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-100 text-orange-700">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-wide uppercase">
              {activeRole.replace('_', ' ')}
            </h4>
            <p className="text-[11px] text-slate-500">
              {activeRole === 'CLIENTE'
                ? 'Security Filter: CLI-FFR-001'
                : 'Acceso Operativo FAMASO'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          Módulos del Sistema
        </div>

        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeModule(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-150 cursor-pointer group ${
                isActive
                  ? 'bg-orange-50 text-orange-950 font-semibold border-l-4 border-orange-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-sm truncate leading-tight flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-1.5 py-0.2 rounded-md">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">
                    {item.description}
                  </div>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  isActive
                    ? 'text-orange-600 translate-x-0.5'
                    : 'text-slate-300 opacity-0 group-hover:opacity-100'
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Bottom Session Box */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              Turno Matutino
            </span>
            <span className="font-mono text-[10px] text-slate-400">Piso 1</span>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
