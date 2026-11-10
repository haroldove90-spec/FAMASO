import React from 'react';
import { Role } from '../types';
import { FamasoLogo } from './FamasoLogo';

interface RoleSelectorProps {
  onSelectRole: (role: Role) => void;
}

interface RoleCardItem {
  role: Role;
  label: string;
}

const ROLES: RoleCardItem[] = [
  {
    role: 'SUPERVISOR',
    label: 'SUPERVISOR',
  },
  {
    role: 'CLIENTE',
    label: 'CLIENTE',
  },
  {
    role: 'ADMIN_FAMASO',
    label: 'ADMIN FAMASO',
  },
  {
    role: 'CALIDAD',
    label: 'CALIDAD',
  },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-50">
      <div className="w-full max-w-5xl">
        {/* Selector limpio con tarjetas independientes para cada rol.
            Sin header, sin descripciones, solo nombre del rol y el logo del sistema sin encapsular.
            Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {ROLES.map(({ role, label }) => (
            <button
              key={role}
              onClick={() => onSelectRole(role)}
              className="group relative flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm hover:shadow-xl hover:border-orange-500 hover:-translate-y-1 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-orange-500/20 active:scale-95"
            >
              {/* Logo del sistema sin encapsular */}
              <div className="mb-6 flex items-center justify-center">
                <FamasoLogo
                  size="xl"
                  showText={false}
                  unencapsulated={true}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              </div>

              {/* Solo nombre del rol */}
              <span className="text-center font-extrabold text-sm sm:text-base md:text-lg tracking-wider text-slate-900 group-hover:text-orange-600 transition-colors uppercase font-mono">
                {label}
              </span>

              {/* Accent hover line */}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-0 bg-orange-500 rounded-full group-hover:w-16 transition-all duration-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
