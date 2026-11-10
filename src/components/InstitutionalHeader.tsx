import React from 'react';
import { LogOut, Download, ShieldCheck, UserCheck, Menu } from 'lucide-react';
import { Role, UserAccount } from '../types';
import { FamasoLogo } from './FamasoLogo';

interface InstitutionalHeaderProps {
  activeRole: Role;
  currentUser: UserAccount;
  onLogout: () => void;
  onOpenInstall: () => void;
  isInstallable?: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const InstitutionalHeader: React.FC<InstitutionalHeaderProps> = ({
  activeRole,
  currentUser,
  onLogout,
  onOpenInstall,
  sidebarOpen,
  onToggleSidebar,
}) => {
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'SUPERVISOR':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-600',
          label: 'SUPERVISOR FAMASO',
        };
      case 'CLIENTE':
        return {
          bg: 'bg-orange-100 text-orange-900 border-orange-300',
          dot: 'bg-orange-600',
          label: 'CLIENTE (Fast Food Road)',
        };
      case 'ADMIN_FAMASO':
        return {
          bg: 'bg-slate-900 text-white border-slate-700',
          dot: 'bg-emerald-400',
          label: 'ADMIN FAMASO',
        };
      case 'CALIDAD':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-600',
          label: 'AUDITORÍA DE CALIDAD',
        };
    }
  };

  const badge = getRoleBadge(activeRole);

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/90 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger (Desktop) + Logotipo del sistema */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            title="Alternar Menú Lateral"
            className="hidden md:flex p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <FamasoLogo size="md" showText={true} />
        </div>

        {/* Center / Right: Identificación del rol activo, Botón de Instalación Rápida y Cierre de Sesión */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Identificación del Rol Activo */}
          <div className="flex items-center gap-2">
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-wide uppercase ${badge.bg}`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${badge.dot}`} />
              <span>{badge.label}</span>
            </div>

            {/* User identity details (Compact on mobile) */}
            <div className="hidden lg:flex flex-col text-right leading-tight">
              <span className="text-xs font-semibold text-slate-900 truncate max-w-[170px]">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-slate-500 font-mono truncate max-w-[170px]">
                {currentUser.email}
              </span>
            </div>
          </div>

          {/* Botón de Instalación Rápida de la Aplicación ("Instalar") */}
          <button
            onClick={onOpenInstall}
            className="flex items-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition duration-150 cursor-pointer"
            title="Instalar Invernadero Futura en tu dispositivo"
          >
            <Download className="w-4 h-4" />
            <span>Instalar</span>
          </button>

          {/* Botón de Cierre de Sesión */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 hover:text-red-700 active:scale-95 text-xs font-semibold rounded-lg shadow-2xs transition duration-150 cursor-pointer"
            title="Cerrar Sesión y volver al selector de roles"
          >
            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-600" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>

      </div>
    </header>
  );
};
