/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Role, UserAccount, WashService, Certificate, InspectionRecord, ChemicalMovement } from './types';
import {
  INITIAL_USERS,
  INITIAL_CLIENTS,
  INITIAL_UNIDADES,
  INITIAL_OPERADORES,
  INITIAL_PERSONAL,
  INITIAL_SHIFTS,
  INITIAL_SERVICES,
  INITIAL_WASHES,
  INITIAL_CERTIFICATES,
  INITIAL_CHEMICALS,
  INITIAL_CHEMICAL_MOVEMENTS,
} from './data/mockData';
import { RoleSelector } from './components/RoleSelector';
import { InstitutionalHeader } from './components/InstitutionalHeader';
import { DesktopSidebar, ModuleType } from './components/DesktopSidebar';
import { BottomNav } from './components/BottomNav';
import { CertificateModal } from './components/CertificateModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useOnlineStatus } from './hooks/useOnlineStatus';

// Module views
import { OperationalModule } from './components/modules/OperationalModule';
import { QualityModule } from './components/modules/QualityModule';
import { CertificatesModule } from './components/modules/CertificatesModule';
import { ClientPortalModule } from './components/modules/ClientPortalModule';
import { InventoryModule } from './components/modules/InventoryModule';
import { AdminFinanceModule } from './components/modules/AdminFinanceModule';
import { MasterCatalogsModule } from './components/modules/MasterCatalogsModule';
import { SecurityModule } from './components/modules/SecurityModule';

export default function App() {
  // Authentication & Active Role State
  // When null, renders the required clean Start Screen (2-col mobile / 4-col desktop, no header, no descriptions)
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[0]);

  // Active module within dashboard
  const [activeModule, setActiveModule] = useState<ModuleType>('operativo');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Core Data States
  const [washes, setWashes] = useState<WashService[]>(INITIAL_WASHES);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [chemicals, setChemicals] = useState(INITIAL_CHEMICALS);
  const [chemicalMovements, setChemicalMovements] = useState<ChemicalMovement[]>(INITIAL_CHEMICAL_MOVEMENTS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);

  // Modals & Inspection shortcuts
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedCertificateWash, setSelectedCertificateWash] = useState<WashService | null>(null);
  const [selectedWashForInspection, setSelectedWashForInspection] = useState<WashService | null>(null);
  const [isPWAInstallModalOpen, setIsPWAInstallModalOpen] = useState(false);

  // PWA & Connectivity hooks
  const { isInstallable, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  // Handle Role Selection from Clean Start Screen
  const handleSelectRole = (role: Role) => {
    setActiveRole(role);
    const matchedUser = users.find((u) => u.role === role) || users[0];
    setCurrentUser(matchedUser);

    // Set initial module appropriate for chosen role
    if (role === 'CLIENTE') {
      setActiveModule('cliente');
    } else if (role === 'CALIDAD') {
      setActiveModule('calidad');
    } else {
      setActiveModule('operativo');
    }
  };

  // Handle Logout (returns to clean role selection screen)
  const handleLogout = () => {
    setActiveRole(null);
  };

  // Wash Service Handlers
  const handleAddWash = (newWash: WashService) => {
    setWashes((prev) => [newWash, ...prev]);
  };

  const handleUpdateWashStatus = (
    washId: string,
    newStatus: WashService['status'],
    extraData?: Partial<WashService>
  ) => {
    setWashes((prev) =>
      prev.map((w) => (w.id === washId ? { ...w, status: newStatus, ...extraData } : w))
    );
  };

  // Inspection approval & liberation with automatic certificate creation
  const handleApproveAndRelease = (
    washId: string,
    inspection: InspectionRecord,
    newCertificate: Certificate
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setWashes((prev) =>
      prev.map((w) => {
        if (w.id === washId) {
          return {
            ...w,
            status: 'LIBERADA',
            releasedAt: nowStr,
            inspection: inspection,
            certificateId: newCertificate.id,
            driveFileUrl: newCertificate.driveUrl,
          };
        }
        return w;
      })
    );

    // Prevent duplicates in certificates table
    setCertificates((prev) => {
      const exists = prev.some((c) => c.washId === washId);
      if (exists) return prev;
      return [newCertificate, ...prev];
    });
  };

  const handleRequireCorrection = (washId: string, inspection: InspectionRecord) => {
    setWashes((prev) =>
      prev.map((w) => {
        if (w.id === washId) {
          return {
            ...w,
            status: 'PENDIENTE_REVISION',
            inspection: inspection,
          };
        }
        return w;
      })
    );
  };

  const handleAddChemicalMovement = (newMov: ChemicalMovement) => {
    setChemicalMovements((prev) => [newMov, ...prev]);

    // Update stock in chemicals catalog
    setChemicals((prev) =>
      prev.map((c) => {
        if (c.id === newMov.chemicalId) {
          const delta = newMov.type === 'ENTRADA' ? newMov.quantity : -newMov.quantity;
          return { ...c, currentStock: Math.max(0, c.currentStock + delta) };
        }
        return c;
      })
    );
  };

  // Quick Open inspection from operational module
  const handleOpenInspectionFromOps = (wash: WashService) => {
    setSelectedWashForInspection(wash);
    setActiveModule('calidad');
  };

  const handleOpenCertificate = (cert: Certificate, wash?: WashService) => {
    setSelectedCertificate(cert);
    setSelectedCertificateWash(wash || null);
  };

  // If no role is selected, render the clean initial role selection screen
  if (!activeRole) {
    return <RoleSelector onSelectRole={handleSelectRole} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Offline Status Warning Indicator */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-900 text-xs font-bold py-1.5 px-4 text-center sticky top-0 z-50 shadow-xs flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>Modo Sin Conexión — Datos de flota en caché local PWA</span>
        </div>
      )}

      {/* Cabecera Institucional Unificada */}
      <InstitutionalHeader
        activeRole={activeRole}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenInstall={() => setIsPWAInstallModalOpen(true)}
        isInstallable={isInstallable}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Menú Lateral Desplegable en Escritorio */}
        <DesktopSidebar
          activeModule={activeModule}
          onChangeModule={setActiveModule}
          activeRole={activeRole}
          isOpen={sidebarOpen}
          onLogout={handleLogout}
        />

        {/* Dynamic Workspace Container (Sin Pestañas Repetitivas) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-full overflow-x-hidden">
          {activeModule === 'operativo' && (
            <OperationalModule
              washes={washes}
              clients={INITIAL_CLIENTS}
              units={INITIAL_UNIDADES}
              operators={INITIAL_OPERADORES}
              services={INITIAL_SERVICES}
              shifts={INITIAL_SHIFTS}
              onAddWash={handleAddWash}
              onUpdateWashStatus={handleUpdateWashStatus}
              onOpenCertificate={handleOpenCertificate}
              onOpenInspectionModal={handleOpenInspectionFromOps}
              currentSupervisorName={currentUser.name}
            />
          )}

          {activeModule === 'calidad' && (
            <QualityModule
              washes={washes}
              onApproveAndRelease={handleApproveAndRelease}
              onRequireCorrection={handleRequireCorrection}
              currentInspectorName={currentUser.name}
              selectedWashForInspection={selectedWashForInspection}
              onClearSelectedWash={() => setSelectedWashForInspection(null)}
              onOpenCertificate={handleOpenCertificate}
            />
          )}

          {activeModule === 'certificados' && (
            <CertificatesModule
              certificates={certificates}
              washes={washes}
              onOpenCertificate={handleOpenCertificate}
              clientIdFilter={activeRole === 'CLIENTE' ? currentUser.clientId : undefined}
            />
          )}

          {activeModule === 'cliente' && (
            <ClientPortalModule
              washes={washes}
              certificates={certificates}
              clientId={currentUser.clientId || 'CLI-FFR-001'}
              clientName={currentUser.clientName || 'Fast Food Road México S.A. de C.V.'}
              onOpenCertificate={handleOpenCertificate}
            />
          )}

          {activeModule === 'quimicos' && (
            <InventoryModule
              chemicals={chemicals}
              movements={chemicalMovements}
              onAddMovement={handleAddChemicalMovement}
              currentUserName={currentUser.name}
            />
          )}

          {activeModule === 'finanzas' && (
            <AdminFinanceModule
              washes={washes}
              operators={INITIAL_OPERADORES}
              users={users}
            />
          )}

          {activeModule === 'catalogos' && (
            <MasterCatalogsModule
              clients={INITIAL_CLIENTS}
              units={INITIAL_UNIDADES}
              operators={INITIAL_OPERADORES}
              personnel={INITIAL_PERSONAL}
              shifts={INITIAL_SHIFTS}
              services={INITIAL_SERVICES}
            />
          )}

          {activeModule === 'seguridad' && (
            <SecurityModule
              users={users}
              currentUser={currentUser}
              onSwitchUser={(user) => {
                setCurrentUser(user);
                setActiveRole(user.role);
              }}
            />
          )}
        </main>
      </div>

      {/* Navegación Móvil y Tablet (Bottom Bar) */}
      <BottomNav
        activeModule={activeModule}
        onChangeModule={setActiveModule}
        activeRole={activeRole}
      />

      {/* Modal Certificado Digital PDF */}
      <CertificateModal
        certificate={selectedCertificate}
        washService={selectedCertificateWash}
        isOpen={!!selectedCertificate}
        onClose={() => {
          setSelectedCertificate(null);
          setSelectedCertificateWash(null);
        }}
      />

      {/* Modal PWA Install Guide */}
      <PWAInstallModal
        isOpen={isPWAInstallModalOpen}
        onClose={() => setIsPWAInstallModalOpen(false)}
        onNativeInstall={install}
        isInstallable={isInstallable}
        isIOS={isIOS}
      />
    </div>
  );
}
