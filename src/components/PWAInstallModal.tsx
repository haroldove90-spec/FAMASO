import React from 'react';
import { Download, Smartphone, Monitor, Apple, CheckCircle2, X } from 'lucide-react';
import { FamasoLogo } from './FamasoLogo';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall: () => void;
  isInstallable: boolean;
  isIOS: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onNativeInstall,
  isInstallable,
  isIOS,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <FamasoLogo size="md" showText={false} unencapsulated={true} />
            <div>
              <h3 className="text-xl font-bold font-mono tracking-tight text-white">
                Invernadero Futura
              </h3>
              <p className="text-xs text-orange-400 font-medium">
                FAMASO - Fast Food Road PWA
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Instala la aplicación en tu dispositivo para acceso ultra-rápido de piso, notificaciones operativas y funcionamiento en red.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isInstallable && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-semibold text-orange-900 text-sm">
                  Instalación Directa Disponible
                </p>
                <p className="text-xs text-orange-700">
                  Tu navegador soporta instalación en 1 clic.
                </p>
              </div>
              <button
                onClick={() => {
                  onNativeInstall();
                  onClose();
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Instalar Ahora
              </button>
            </div>
          )}

          {/* Platform Guides */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700 shadow-sm">
                <Smartphone className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block text-sm">
                  Android (Chrome / Edge)
                </span>
                <span className="text-slate-600">
                  Toca el menú de tres puntos (⋮) en la esquina superior derecha y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700 shadow-sm">
                <Apple className="w-5 h-5 text-slate-900" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block text-sm">
                  iPhone / iPad (Safari iOS)
                </span>
                <span className="text-slate-600">
                  Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba) en la barra de Safari y presiona <strong>"Agregar a pantalla de inicio"</strong>.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700 shadow-sm">
                <Monitor className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block text-sm">
                  Computadora (Chrome / Edge / Mac / Windows)
                </span>
                <span className="text-slate-600">
                  Haz clic en el icono de instalación (⊞) en la barra de direcciones de tu navegador para añadirla como app de escritorio independiente.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              PWA 100% Certificada
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100 rounded-lg transition"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
