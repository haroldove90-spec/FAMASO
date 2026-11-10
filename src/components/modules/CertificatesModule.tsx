import React, { useState } from 'react';
import {
  FileCheck2,
  Download,
  ExternalLink,
  Search,
  ShieldCheck,
  CheckCircle,
  QrCode,
  Calendar,
  Lock,
} from 'lucide-react';
import { Certificate, WashService } from '../../types';

interface CertificatesModuleProps {
  certificates: Certificate[];
  washes: WashService[];
  onOpenCertificate: (certificate: Certificate, wash?: WashService) => void;
  clientIdFilter?: string; // Optional client restriction
}

export const CertificatesModule: React.FC<CertificatesModuleProps> = ({
  certificates,
  washes,
  onOpenCertificate,
  clientIdFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCerts = certificates.filter((c) => {
    const matchesClient = !clientIdFilter || c.clientId === clientIdFilter;
    const matchesSearch =
      c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.unitEconomic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.unitPlates.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.folio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClient && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-mono tracking-tight uppercase flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-orange-600" />
            Certificados Digitales de Inocuidad y Lavado
          </h2>
          <p className="text-xs text-slate-500">
            Documentación oficial automatizada respaldada en Google Drive con firma criptográfica y QR.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar certificado, placas o económico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Certificates Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCerts.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
            <FileCheck2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-700">No se encontraron certificados</p>
            <p className="text-xs text-slate-400 mt-1">Los certificados se generan automáticamente al liberar unidades.</p>
          </div>
        ) : (
          filteredCerts.map((cert) => {
            const relatedWash = washes.find((w) => w.id === cert.washId);

            return (
              <div
                key={cert.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {cert.certificateNumber}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Inocuidad NOM-251
                    </span>
                  </div>

                  <div>
                    <div className="text-lg font-extrabold text-slate-900 font-mono">
                      {cert.unitEconomic}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Placas: {cert.unitPlates} | Folio: {cert.folio}
                    </div>
                    <div className="text-xs font-medium text-slate-700 mt-1 truncate">
                      {cert.serviceName}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Liberado:</span>
                      <span className="font-mono font-semibold text-slate-800">{cert.releasedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Supervisor:</span>
                      <span className="font-medium text-slate-800">{cert.supervisorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hash SHA-256:</span>
                      <span className="font-mono text-[10px] text-slate-700 truncate max-w-[120px]">
                        {cert.hashVerification}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenCertificate(cert, relatedWash)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ver y Descargar PDF</span>
                  </button>

                  <a
                    href={cert.driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg transition"
                    title="Abrir respaldo en Google Drive"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
