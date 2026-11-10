import React from 'react';
import { X, Printer, ExternalLink, ShieldCheck, CheckCircle2, Award, QrCode } from 'lucide-react';
import { Certificate, WashService } from '../types';
import { FamasoLogo } from './FamasoLogo';

interface CertificateModalProps {
  certificate: Certificate | null;
  washService?: WashService | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  washService,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !certificate) return null;

  const handlePrintOrDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto no-print">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Actions Bar */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>CERTIFICADO DIGITAL VALIDADO</span>
            <span className="text-slate-400">|</span>
            <span className="text-orange-400 font-bold">{certificate.certificateNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintOrDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
              title="Descargar PDF / Imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Descargar PDF</span>
            </button>
            <a
              href={certificate.driveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
              title="Ver en Google Drive"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Drive</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Clean Printable Container) */}
        <div id="printable-certificate" className="p-8 sm:p-10 bg-white text-slate-800 space-y-6">
          {/* Header with border */}
          <div className="border-b-2 border-orange-500 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <FamasoLogo size="lg" showText={true} />
            </div>
            <div className="text-right sm:text-right">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>INOCUIDAD GRADO ALIMENTICIO</span>
              </div>
              <p className="text-xs font-mono text-slate-500 mt-1">
                FOLIO OFICIAL: <strong>{certificate.certificateNumber}</strong>
              </p>
            </div>
          </div>

          {/* Title banner */}
          <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight uppercase font-mono">
              Constancia de Lavado e Inocuidad Microbiológica
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Protocolo FAMASO Fast Food Road conforme a la norma NOM-251-SSA1-2009
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-400 text-[10px] uppercase font-mono tracking-wider block">
                Datos de la Unidad y Transportista
              </span>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Cliente / Transportista:</span>
                <span className="font-bold text-slate-900">{certificate.clientName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">No. Económico:</span>
                <span className="font-bold text-orange-600 font-mono text-sm">{certificate.unitEconomic}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Placas de Circulación:</span>
                <span className="font-mono font-bold text-slate-800">{certificate.unitPlates}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Servicio Aplicado:</span>
                <span className="font-semibold text-slate-800 text-right">{certificate.serviceName}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-400 text-[10px] uppercase font-mono tracking-wider block">
                Trazabilidad y Validación de Liberación
              </span>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Fecha y Hora de Liberación:</span>
                <span className="font-mono font-bold text-slate-900">{certificate.releasedAt}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Supervisor Responsable:</span>
                <span className="font-semibold text-slate-800">{certificate.supervisorName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Auditor de Calidad:</span>
                <span className="font-semibold text-slate-800">{certificate.inspectorName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Almacenamiento Cloud:</span>
                <span className="text-blue-600 truncate max-w-[150px]">Google Drive Certs</span>
              </div>
            </div>
          </div>

          {/* Food Grade Sanitation Checklist Proof */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase font-mono">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Verificación de Parámetros de Biocida e Inocuidad</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-emerald-950 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sanitizante QuatSan 5G (EPA 6836)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lavado térmico a alta presión</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ausencia de residuos grasos / olores</span>
              </div>
            </div>
          </div>

          {/* Digital Signatures & Hash Footer */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-slate-300 rounded-lg bg-white shadow-2xs">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-500 space-y-0.5">
                <span className="font-bold text-slate-700 block font-mono">CÓDIGO QR SEGURO</span>
                <span>Escanee para verificar autenticidad en tiempo real.</span>
              </div>
            </div>

            <div className="text-center sm:border-l sm:border-r border-slate-200 px-4">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-slate-700 text-sm border-b border-slate-400 px-6">
                  {certificate.supervisorName}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block mt-1">
                Firma Digital Supervisor Patio
              </span>
            </div>

            <div className="text-right text-[10px] text-slate-500 font-mono space-y-1">
              <div>Sello Criptográfico:</div>
              <div className="text-[9px] text-slate-700 bg-slate-100 p-1 rounded break-all border border-slate-200">
                {certificate.hashVerification}
              </div>
              <div className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Vigencia: 72 Horas en Ruta
              </div>
            </div>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 no-print">
          <span>Este documento digital se encuentra respaldado en Google Drive FAMASO.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
