import React, { useState } from 'react';
import {
  FlaskConical,
  Plus,
  AlertTriangle,
  FileText,
  TrendingDown,
  TrendingUp,
  Search,
  CheckCircle2,
  X,
  Package,
} from 'lucide-react';
import { ChemicalItem, ChemicalMovement } from '../../types';

interface InventoryModuleProps {
  chemicals: ChemicalItem[];
  movements: ChemicalMovement[];
  onAddMovement: (newMov: ChemicalMovement) => void;
  currentUserName: string;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  chemicals,
  movements,
  onAddMovement,
  currentUserName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHdsChemical, setSelectedHdsChemical] = useState<ChemicalItem | null>(null);
  const [isNewMoveModalOpen, setIsNewMoveModalOpen] = useState(false);

  // New movement form state
  const [movForm, setMovForm] = useState({
    chemicalId: chemicals[0]?.id || 'CHM-01',
    type: 'SALIDA' as 'ENTRADA' | 'SALIDA',
    quantity: 2,
    unit: 'Litros',
    reason: 'Lavado en bahía de patio',
    referenceFolio: 'FOL-2026-0894',
  });

  const filteredChemicals = chemicals.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMovSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chem = chemicals.find((c) => c.id === movForm.chemicalId) || chemicals[0];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newMov: ChemicalMovement = {
      id: `MOV-${Date.now().toString().slice(-4)}`,
      chemicalId: chem.id,
      chemicalName: chem.name,
      type: movForm.type,
      quantity: Number(movForm.quantity),
      unit: movForm.unit,
      date: nowStr,
      referenceFolio: movForm.referenceFolio,
      reason: movForm.reason,
      registeredBy: currentUserName,
    };

    onAddMovement(newMov);
    setIsNewMoveModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-mono tracking-tight uppercase flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-orange-600" />
            Inventario y Control de Químicos Inocuos (Uso Interno FAMASO)
          </h2>
          <p className="text-xs text-slate-500">
            Control de insumos biocidas, desengrasantes grado alimenticio, hojas de seguridad HDS y costos unitarios.
          </p>
        </div>

        <button
          onClick={() => setIsNewMoveModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Movimiento</span>
        </button>
      </div>

      {/* Chemicals Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredChemicals.map((chem) => {
          const isLowStock = chem.currentStock <= chem.minStock;

          return (
            <div
              key={chem.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs flex flex-col justify-between space-y-4 ${
                isLowStock ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200/90'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {chem.code}
                  </span>
                  {isLowStock ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-3 h-3" />
                      Stock Mínimo
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Stock Óptimo
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {chem.name}
                </h3>
                <p className="text-[11px] text-slate-500">{chem.category}</p>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">
                      Stock Actual
                    </span>
                    <span className="font-mono font-extrabold text-slate-900 text-base">
                      {chem.currentStock}{' '}
                      <span className="text-xs font-normal text-slate-500 font-sans">
                        {chem.unit.split(' ')[0]}
                      </span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">
                      Costo Unitario
                    </span>
                    <span className="font-mono font-bold text-emerald-700">
                      ${chem.unitCost.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  <span className="text-slate-400">Proveedor:</span> {chem.supplier}
                </div>
              </div>

              <button
                onClick={() => setSelectedHdsChemical(chem)}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-700 hover:text-orange-600 bg-slate-50 hover:bg-orange-50 border border-slate-200 rounded-lg transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ver Ficha Técnica / HDS</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Movements History Table (MOV_QUIMICOS) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>MOVIMIENTOS DE ENTRADA Y SALIDA (MOV_QUIMICOS)</span>
          <span>AUDITORÍA INTERNA</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3.5">ID / Fecha</th>
                <th className="p-3.5">Insumo Químico</th>
                <th className="p-3.5">Tipo Movimiento</th>
                <th className="p-3.5">Cantidad</th>
                <th className="p-3.5">Referencia / Folio</th>
                <th className="p-3.5">Motivo / Registrado Por</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {movements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-3.5 font-mono">
                    <span className="font-bold text-slate-900 block">{m.id}</span>
                    <span className="text-[10px] text-slate-400">{m.date}</span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">
                    {m.chemicalName}
                  </td>
                  <td className="p-3.5">
                    {m.type === 'ENTRADA' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        <TrendingUp className="w-3 h-3" />
                        ENTRADA COMPRA
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        <TrendingDown className="w-3 h-3" />
                        SALIDA LAVADO
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">
                    {m.quantity} {m.unit}
                  </td>
                  <td className="p-3.5 font-mono text-orange-600">
                    {m.referenceFolio || 'N/A'}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    <div>{m.reason}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Por: {m.registeredBy}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Ficha Técnica & Hoja de Seguridad HDS */}
      {selectedHdsChemical && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold text-sm font-mono uppercase">
                  Ficha Técnica & Seguridad Inocua
                </h3>
              </div>
              <button
                onClick={() => setSelectedHdsChemical(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">
                  Producto Químico
                </span>
                <div className="text-base font-bold text-slate-900">
                  {selectedHdsChemical.name}
                </div>
                <div className="text-slate-500 font-mono">{selectedHdsChemical.code}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block">Especificaciones Técnicas:</span>
                <p className="text-slate-600 leading-relaxed">
                  {selectedHdsChemical.technicalSpecs}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 space-y-1">
                <span className="font-bold text-orange-900 block">
                  Clasificación de Riesgo & SGA:
                </span>
                <p className="text-orange-800">{selectedHdsChemical.hazardClass}</p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-slate-500">
                <span>Documento: {selectedHdsChemical.safetyDataSheetUrl}</span>
                <button
                  onClick={() => setSelectedHdsChemical(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Registrar Movimiento */}
      {isNewMoveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm font-mono uppercase">
                Registrar Movimiento de Insumo
              </h3>
              <button
                onClick={() => setIsNewMoveModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMovSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Insumo Químico
                </label>
                <select
                  value={movForm.chemicalId}
                  onChange={(e) => setMovForm({ ...movForm, chemicalId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {chemicals.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Stock: {c.currentStock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Tipo de Movimiento
                  </label>
                  <select
                    value={movForm.type}
                    onChange={(e) =>
                      setMovForm({ ...movForm, type: e.target.value as 'ENTRADA' | 'SALIDA' })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="SALIDA">SALIDA (Consumo Lavado)</option>
                    <option value="ENTRADA">ENTRADA (Compra/Reabastecimiento)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={movForm.quantity}
                    onChange={(e) =>
                      setMovForm({ ...movForm, quantity: parseFloat(e.target.value) || 1 })
                    }
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Folio de Referencia (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: FOL-2026-0894"
                  value={movForm.referenceFolio}
                  onChange={(e) => setMovForm({ ...movForm, referenceFolio: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Motivo / Observación
                </label>
                <input
                  type="text"
                  placeholder="Ej: Sanitizado de caja unidad FFR-108"
                  value={movForm.reason}
                  onChange={(e) => setMovForm({ ...movForm, reason: e.target.value })}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewMoveModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Guardar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
