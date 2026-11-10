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
} from 'lucide-react';
import { Role } from '../types';
import { ModuleType } from './DesktopSidebar';

interface BottomNavProps {
  activeModule: ModuleType;
  onChangeModule: (module: ModuleType) => void;
  activeRole: Role;
}

interface BottomTabItem {
  id: ModuleType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: Role[];
}

const TABS: BottomTabItem[] = [
  {
    id: 'operativo',
    label: 'Operativo',
    icon: Car,
    allowedRoles: ['SUPERVISOR', 'ADMIN_FAMASO', 'CALIDAD'],
  },
  {
    id: 'calidad',
    label: 'Calidad',
    icon: ClipboardCheck,
    allowedRoles: ['SUPERVISOR', 'ADMIN_FAMASO', 'CALIDAD'],
  },
  {
    id: 'cliente',
    label: 'Portal FFR',
    icon: Building2,
    allowedRoles: ['CLIENTE'],
  },
  {
    id: 'certificados',
    label: 'Certificados',
    icon: FileCheck2,
    allowedRoles: ['SUPERVISOR', 'ADMIN_FAMASO', 'CLIENTE', 'CALIDAD'],
  },
  {
    id: 'quimicos',
    label: 'Químicos',
    icon: FlaskConical,
    allowedRoles: ['ADMIN_FAMASO'],
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: Coins,
    allowedRoles: ['ADMIN_FAMASO'],
  },
  {
    id: 'catalogos',
    label: 'Catálogos',
    icon: Database,
    allowedRoles: ['SUPERVISOR'],
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeModule,
  onChangeModule,
  activeRole,
}) => {
  const visibleTabs = TABS.filter((tab) => tab.allowedRoles.includes(activeRole)).slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg md:hidden safe-area-bottom">
      <div className="grid grid-flow-col auto-cols-fr h-16 max-w-lg mx-auto">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeModule(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-150 relative cursor-pointer ${
                isActive
                  ? 'text-orange-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-orange-600 rounded-b-full shadow-xs" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-orange-600' : ''} transition-transform`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
