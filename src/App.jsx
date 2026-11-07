import React, { useState } from 'react';
import { Building2, FileText, LayoutDashboard, RefreshCw, Zap, Bell, CheckCircle2, User, Home } from 'lucide-react';

// --- DATOS DE PRUEBA (MOCK DATA) ---
const inventarioInicial = [
  { id: 'EB-1001', titulo: 'Casa Moderna en Tecámac', tipo: 'Venta', precio: 3200000, estatus: 'Activa', sync: true },
  { id: 'EB-1002', titulo: 'Departamento en Pachuca Centro', tipo: 'Renta', precio: 12000, estatus: 'Activa', sync: true },
  { id: 'EB-1003', titulo: 'Terreno Comercial Hidalgo', tipo: 'Venta', precio: 4500000, estatus: 'Activa', sync: false }
];

const prospectosIniciales = [
  { id: 1, nombre: 'Carlos Ruiz', operacion: 'Venta', presupuesto: 3500000, etapa: 'Nuevo', match: true, alerta: false },
  { id: 2, nombre: 'Saraí Reyes', operacion: 'Renta', presupuesto: 15000, etapa: 'Citas', match: true, alerta: true },
  { id: 3, nombre: 'Balman Herrera', operacion: 'Venta', presupuesto: 4000000, etapa: 'Oferta', match: false, alerta: false }
];

const etapasCRM = ['Nuevo', 'Perfilamiento', 'Citas', 'Oferta', 'Cierre'];

export default function App() {
  const [vistaActiva, setVistaActiva] = useState('crm');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* MENÚ LATERAL */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/50">
            IS
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">InmoStack</h1>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setVistaActiva('crm')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${vistaActiva === 'crm' ? 'bg-blue-600/10 text-blue-400 border border-blue-900/50' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">CRM Kanban</span>
          </button>
          
          <button 
            onClick={() => setVistaActiva('inventario')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${vistaActiva === 'inventario' ? 'bg-blue-600/10 text-blue-400 border border-blue-900/50' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Building2 size={20} />
            <span className="font-medium">Inventario Sync</span>
          </button>

          <button 
            onClick={() => setVistaActiva('legal')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${vistaActiva === 'legal' ? 'bg-blue-600/10 text-blue-400 border border-blue-900/50' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <FileText size={20} />
            <span className="font-medium">Docs Legales</span>
          </button>
        </nav>
        
        <div className="mt-auto p-4 bg-slate-950 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-500 mb-1">Agencia Fundadora</p>
          <p className="text-sm font-bold text-slate-300">Alliatus</p>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-auto">
        {vistaActiva === 'crm' && <ModuloCRM />}
        {vistaActiva === 'inventario' && <ModuloInventario />}
        {vistaActiva === 'legal' && <ModuloLegal prospectos={prospectosIniciales} inventario={inventarioInicial} />}
      </main>
    </div>
  );
}

// --- MÓDULO 1: CRM KANBAN ---
function ModuloCRM() {
  const [prospectos, setProspectos] = useState(prospectosIniciales);

  const moverProspecto = (id, nuevaEtapa) => {
    setProspectos(prospectos.map(p => p.id === id ? { ...p, etapa: nuevaEtapa } : p));
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Tablero de Ventas</h2>
          <p className="text-slate-400 text-sm">Gestiona tus prospectos y acelera el cierre.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
          + Nuevo Prospecto
        </button>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
        {etapasCRM.map(etapa => (
          <div key={etapa} className="min-w-[300px] w-[300px] bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-semibold text-slate-300">{etapa}</h3>
              <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">
                {prospectos.filter(p => p.etapa === etapa).length}
              </span>
            </div>
            
            <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto">
              {prospectos.filter(p => p.etapa === etapa).map(prospecto => (
                <div 
                  key={prospecto.id}
                  draggable
                  onDragEnd={() => {
                    const idxActual = etapasCRM.indexOf(prospecto.etapa);
                    if (idxActual < etapasCRM.length - 1) moverProspecto(prospecto.id, etapasCRM[idxActual + 1]);
                  }}
                  className="bg-slate-800 border border-slate-700 p-4 rounded-lg cursor-grab active:cursor-grabbing hover:border-slate-600 transition-colors group relative"
                >
                  {prospecto.alerta && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                  
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${prospecto.operacion === 'Venta' ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50' : 'bg-amber-900/50 text-amber-300 border border-amber-700/50'}`}>
                      {prospecto.operacion}
                    </span>
                    {prospecto.match && (
                      <div className="flex items-center text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-800/50">
                        <Zap size={10} className="mr-1" />
                        +10% MATCH
                      </div>
                    )}
                  </div>
                  
                  <h4 className="font-bold text-slate-200 mb-1">{prospecto.nombre}</h4>
                  <p className="text-emerald-400 font-medium text-sm">
                    ${prospecto.presupuesto.toLocaleString('es-MX')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MÓDULO 2: INVENTARIO ---
function ModuloInventario() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div className="p-8 h-full">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Inventario Híbrido</h2>
          <p className="text-slate-400 text-sm">Tus propiedades sincronizadas con EasyBroker.</p>
        </div>
        <button 
          onClick={handleSync}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <RefreshCw size={18} className={syncing ? 'animate-spin text-blue-400' : ''} />
          {syncing ? 'Sincronizando...' : 'Sincronizar EasyBroker'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventarioInicial.map(prop => (
          <div key={prop.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
            <div className="h-40 bg-slate-800 flex items-center justify-center relative">
              <Building2 size={40} className="text-slate-700" />
              <div className="absolute top-3 left-3">
                <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded shadow-lg ${prop.tipo === 'Venta' ? 'bg-indigo-600 text-white' : 'bg-amber-500 text-black'}`}>
                  {prop.tipo}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-200 leading-tight">{prop.titulo}</h3>
              </div>
              <p className="text-xl font-bold text-emerald-400 mb-4">
                ${prop.precio.toLocaleString('es-MX')} {prop.tipo === 'Renta' && <span className="text-sm font-normal text-slate-500">/mes</span>}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-500">Estatus: <span className="text-slate-300">{prop.estatus}</span></span>
                {prop.sync ? (
                  <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                    <CheckCircle2 size={12} className="mr-1" />
                    {prop.id}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-500 bg-slate-800 px-2 py-1 rounded">No sincronizado</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MÓDULO 3: DOCS LEGALES ---
function ModuloLegal({ prospectos, inventario }) {
  const [clienteSel, setClienteSel] = useState('');
  const [propSel, setPropSel] = useState('');
  const [tipoDoc, setTipoDoc] = useState('');
  const [generado, setGenerado] = useState(false);

  return (
    <div className="p-8 h-full max-w-5xl mx-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Cerebro Legal</h2>
        <p className="text-slate-400 text-sm">Genera contratos y actas blindadas sin errores de captura.</p>
      </header>

      <div className="grid grid-cols-3 gap-8">
        {/* Panel de Configuración */}
        <div className="col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <h3 className="font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-400" />
              1. Selecciona Cliente
            </h3>
            <select 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={clienteSel}
              onChange={(e) => setClienteSel(e.target.value)}
            >
              <option value="">-- Elige del CRM --</option>
              {prospectos.map(p => <option key={p.id} value={p.nombre}>{p.nombre} ({p.etapa})</option>)}
            </select>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <h3 className="font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <Home size={18} className="text-blue-400" />
              2. Selecciona Propiedad
            </h3>
            <select 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={propSel}
              onChange={(e) => setPropSel(e.target.value)}
            >
              <option value="">-- Elige del Inventario --</option>
              {inventario.map(p => <option key={p.id} value={p.titulo}>{p.titulo}</option>)}
            </select>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <h3 className="font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-blue-400" />
              3. Tipo de Documento
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors">
                <input type="radio" name="doc" value="promesa" onChange={(e) => setTipoDoc(e.target.value)} className="text-blue-600 bg-slate-900 border-slate-700" />
                <span className="text-sm font-medium">Promesa de Compraventa</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-800 transition-colors">
                <input type="radio" name="doc" value="entrega" onChange={(e) => setTipoDoc(e.target.value)} className="text-blue-600 bg-slate-900 border-slate-700" />
                <span className="text-sm font-medium">Acta de Entrega-Recepción</span>
              </label>
            </div>
          </div>

          <button 
            onClick={() => setGenerado(true)}
            disabled={!clienteSel || !propSel || !tipoDoc}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 rounded-lg font-bold transition-colors"
          >
            Generar Documento Blindado
          </button>
        </div>

        {/* Panel de Previsualización */}
        <div className="col-span-2 bg-slate-100 rounded-xl p-8 text-slate-900 shadow-inner overflow-y-auto h-[600px] font-serif">
          {!generado ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <FileText size={64} className="mb-4 opacity-20" />
              <p>Configura las opciones a la izquierda para previsualizar el documento.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-center border-b-2 border-slate-300 pb-4 uppercase">
                {tipoDoc === 'promesa' ? 'Contrato de Promesa de Compraventa' : 'Acta de Entrega - Recepción de Inmueble'}
              </h1>
              
              <p className="text-justify leading-relaxed">
                Conste por el presente documento, el acuerdo celebrado entre la agencia <strong>Alliatus</strong>, en adelante "EL CORREDOR", y por la otra parte <strong>{clienteSel}</strong>, en adelante "EL CLIENTE", respecto al inmueble ubicado en <strong>{propSel}</strong>.
              </p>
              
              {tipoDoc === 'entrega' && (
                <div className="bg-white border border-slate-300 p-5 rounded my-6">
                  <h4 className="font-bold mb-3 border-b border-slate-200 pb-2">Checklist de Entrega Física</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b border-slate-100 pb-1">
                      <span>Juegos de llaves entregados:</span> <span className="font-bold">2 juegos completos</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-1">
                      <span>Lectura actual de CFE:</span> <span className="font-bold border-b border-dashed border-slate-400 w-32"></span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-1">
                      <span>Bomba de agua probada y funcional:</span> <span className="font-bold">Sí [X] No [ ]</span>
                    </li>
                  </ul>
                </div>
              )}

              <p className="text-justify leading-relaxed">
                Ambas partes declaran su entera conformidad con las cláusulas aquí descritas, firmando de manera autógrafa al calce para constancia legal en la fecha de su expedición. Este documento ha sido generado automáticamente de manera blindada para asegurar la integridad de los datos de la operación.
              </p>

              <div className="mt-20 flex justify-between px-10">
                <div className="text-center w-48">
                  <div className="border-b border-slate-900 h-8 mb-2"></div>
                  <p className="font-bold text-sm">Firma del Asesor</p>
                </div>
                <div className="text-center w-48">
                  <div className="border-b border-slate-900 h-8 mb-2"></div>
                  <p className="font-bold text-sm">{clienteSel}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
