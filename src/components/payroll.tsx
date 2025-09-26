// src/components/PayrollPlatform.jsx (Archivo modificado)

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
  Building2,
  HelpCircle,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Clock,
  DollarSign,
  Users,
  FileText,
  BarChart3,
  Menu,
  X,
  CheckSquare,
  Square,
  AlertCircle,
  Timer,
  Activity
} from 'lucide-react';

// =================================================================
//                     1. DEFINICIÓN DE MOCK DATA
// =================================================================

// Tipos base para el mock data
interface Period {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    pay_date: string;
    status: 'completed' | 'processing' | 'pending' | 'draft';
    days: number;
    type: string;
}

interface Analytics {
    total_employees: number;
    total_earnings: number;
    total_deductions: number;
    total_obligations: number;
    net_payroll: number;
}

const MOCK_DATA = {
    employees: [
        { id: '3406', name: 'Juan Pérez', department: 'Ventas' },
        { id: '3407', name: 'Maria López', department: 'Recursos Humanos' },
    ],
    periods: [
        { id: 37, name: 'Semana 37', start_date: '2025-09-08', end_date: '2025-09-14', pay_date: '2025-09-15', status: 'completed', days: 7, type: 'Ordinaria' },
        { id: 38, name: 'Semana 38', start_date: '2025-09-15', end_date: '2025-09-21', pay_date: '2025-09-22', status: 'completed', days: 7, type: 'Ordinaria' },
        { id: 39, name: 'Semana 39', start_date: '2025-09-22', end_date: '2025-09-28', pay_date: '2025-09-29', status: 'processing', days: 7, type: 'Ordinaria' },
        { id: 40, name: 'Semana 40', start_date: '2025-09-29', end_date: '2025-10-05', pay_date: '2025-10-06', status: 'pending', days: 7, type: 'Ordinaria' },
    ] as Period[],
    concepts: [
        { id: 1, name: 'Sueldo Base', type: 'Percepción' },
        { id: 2, name: 'Horas Extra', type: 'Percepción' },
        { id: 3, name: 'ISR', type: 'Deducción' },
        { id: 4, name: 'Seguro Social', type: 'Deducción' },
    ],
    timeEntries: [
        { day: '2025-09-22', hours: 8, status: 'Completed' },
        { day: '2025-09-23', hours: 8, status: 'Completed' },
        // ... más entradas
    ],
    analytics: {
        total_employees: 145,
        total_earnings: 1_250_000.50,
        total_deductions: 350_000.75,
        total_obligations: 120_000.00,
        net_payroll: 779_999.75,
    } as Analytics,
};

// =================================================================
//                     2. COMPONENTE PRINCIPAL
// =================================================================

// Simulación de entorno para usar Mock Data
// En un entorno real, usarías: process.env.NODE_ENV !== 'production'
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || true; 

const PayrollPlatform = () => {
    // ... (Mantener todos tus estados originales)
    const [selectedEmployee, setSelectedEmployee] = useState('3406');
    const [selectedWeek, setSelectedWeek] = useState('38');
    const [activeTab, setActiveTab] = useState('conceptos');
    const [showPeriodModal, setShowPeriodModal] = useState(false);
    const [showPayslipModal, setShowPayslipModal] = useState(false);
    const [showActionsDropdown, setShowActionsDropdown] = useState(false);
    const [showPayFrequencyDropdown, setShowPayFrequencyDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [payFrequency, setPayFrequency] = useState('Semanal');
    const [year, setYear] = useState('2025');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Data states
    const [employees, setEmployees] = useState(MOCK_DATA.employees); // Inicializamos con mock
    const [periods, setPeriods] = useState(MOCK_DATA.periods); // Inicializamos con mock
    const [concepts, setConcepts] = useState(MOCK_DATA.concepts); // Inicializamos con mock
    const [payslips, setPayslips] = useState([]);
    const [timeEntries, setTimeEntries] = useState(MOCK_DATA.timeEntries); // Inicializamos con mock
    const [analytics, setAnalytics] = useState<Analytics | null>(MOCK_DATA.analytics); // Inicializamos con mock

    // API Base URL
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

    // Función para simular un retraso en la red
    const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 800));

    // =================================================================
    //         3. FUNCIÓN CENTRAL DE OBTENCIÓN DE DATOS CON LÓGICA
    // =================================================================

    const fetchInitialData = async () => {
        setLoading(true);
        setError(null);

        // Bloque Try...Catch para toda la operación de carga inicial
        try {
            await simulateDelay(); // Simula el tiempo de carga

            // Condicional IF para usar MOCK DATA
            if (USE_MOCK_DATA) {
                console.log("Modo de Desarrollo: Usando MOCK DATA para inicialización.");
                setEmployees(MOCK_DATA.employees);
                setPeriods(MOCK_DATA.periods);
                setConcepts(MOCK_DATA.concepts);
                setTimeEntries(MOCK_DATA.timeEntries);
                setAnalytics(MOCK_DATA.analytics);
                
            } else {
                console.log("Modo de Producción: Conectando a la API Backend.");
                
                // Lógica de FETCH REAL (Versión simplificada)
                
                const fetchEndpoint = async (endpoint: string, setter: (data: any) => void, dataName: string) => {
                    const res = await fetch(`${API_BASE}${endpoint}`);
                    if (!res.ok) {
                        // Lanzamos un error que será capturado por el try...catch externo
                        throw new Error(`Failed to fetch ${dataName}: ${res.statusText}`); 
                    }
                    const data = await res.json();
                    setter(data);
                };

                // Ejecutamos todos los fetches
                await Promise.all([
                    fetchEndpoint('/employees', setEmployees, 'employees'),
                    fetchEndpoint(`/payroll/periods?year=${year}`, setPeriods, 'periods'),
                    fetchEndpoint('/payroll/concepts', setConcepts, 'concepts'),
                    fetchEndpoint(`/payroll/time-entries?employee_id=${selectedEmployee}`, setTimeEntries, 'time entries'),
                    fetchEndpoint('/payroll/analytics', setAnalytics, 'analytics'),
                ]);
            }
        
        } catch (err) {
            // Manejo de Fallas: Captura el error de la API o del mock
            const errorMessage = (err instanceof Error) ? err.message : 'Error desconocido al cargar datos iniciales.';
            console.error('Error fetching data:', errorMessage);
            setError(`Fallo al cargar la plataforma de nómina. ${errorMessage}`);
            
            // Opcional: Limpiar datos si falla
            setEmployees([]);
            setPeriods([]);
            setConcepts([]);
            setTimeEntries([]);
            setAnalytics(null);
        
        } finally {
            setLoading(false);
        }
    };

    // Llamada inicial
    useEffect(() => {
        fetchInitialData();
    }, [selectedEmployee, year]); // Dependencias para re-fetch

    // ... (Mantener la función processPayroll original, ya contiene try/catch)
    const processPayroll = async (periodId: number, processType: string) => {
        try {
            setLoading(true);
            
            if (USE_MOCK_DATA) {
                 await simulateDelay();
                 alert(`Simulación: Nómina procesada para el período ${periodId} (${processType}).`);
                 setShowPeriodModal(false);
                 // Actualizamos el estado del mock data (simulación)
                 setPeriods(prev => prev.map(p => 
                     p.id === periodId ? { ...p, status: 'completed' } : p
                 ));
                 return;
            }

            const response = await fetch(`${API_BASE}/payroll/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    period_id: periodId,
                    process_type: processType,
                    parameters: JSON.stringify({
                        allow_exceptions: true,
                        allow_employee_movements: true,
                        allow_attendance_adjustments: true,
                        allow_vacations_and_permits: true,
                    }),
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Payroll processing started: ${result.message}`);
                setShowPeriodModal(false);
                fetchInitialData(); // Refresh data
            } else {
                throw new Error('Failed to process payroll');
            }
        } catch (err) {
            console.error('Error processing payroll:', err);
            alert('Error processing payroll');
        } finally {
            setLoading(false);
        }
    };
    
    // ... (Resto del código del componente original, incluyendo PeriodModal)
    
    const menuItems = [
      { id: 'nomina', label: 'Nómina', icon: DollarSign, active: true },
      { id: 'resumen', label: 'Resumen de Nómina', icon: FileText },
      { id: 'diario', label: 'Resumen Diario de Asistencia', icon: Clock },
      { id: 'prenomina', label: 'Resumen de Prenómina', icon: Activity },
      { id: 'empleado', label: 'Prenómina por Empleado', icon: User },
      { id: 'incidencias', label: 'Resumen de Incidencias', icon: AlertCircle },
      { id: 'faltas', label: 'Faltas y Extras', icon: Timer },
      { id: 'vacaciones', label: 'Resumen de Vacaciones', icon: Calendar },
      { id: 'conceptos', label: 'Totales de Conceptos', icon: BarChart3 },
      { id: 'periodos', label: 'Períodos', icon: Calendar },
      { id: 'polizas', label: 'Pólizas', icon: FileText },
      { id: 'empleados', label: 'Empleado Activo', icon: Users },
      { id: 'recursos', label: 'Recursos Humanos', icon: Building2 }
    ];

    const actionMenuItems = [
      'Procesar Nómina',
      'Agregar Período', 
      'Modificar Período',
      'Borrar Período',
      'Importar Períodos',
      'Crear Períodos del Año',
      'Recalcular Períodos del Año', 
      'Borrar Períodos del Año',
      'Validar Timbrado de Nómina',
      'Afectar Nómina',
      'Timbrar Recibos de Nómina',
      'Preparar Póliza',
      'Desafectar Nómina',
      'Inicializar Período',
      'Reclasificar Nómina',
      'Cancelar Timbrado'
    ];

    const PeriodModal = () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Afectar Nómina</h2>
            <button onClick={() => setShowPeriodModal(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <div className="bg-green-100 p-4 rounded mb-4">
            <div className="text-center mb-4">
              <div className="bg-green-500 text-white px-4 py-2 rounded">Avance 100%</div>
              <div className="bg-green-600 text-white px-4 py-2 rounded mt-2">Parámetros</div>
            </div>
            <div className="space-y-2 text-sm">
              <div><strong>Período:</strong> Semana 39 de 2025</div>
              <div><strong>Mes:</strong> Octubre</div>
              <div><strong>Del:</strong> Lunes, 22 de Septiembre de 2025</div>
              <div><strong>Al:</strong> Domingo, 28 de Septiembre de 2025</div>
              <div><strong>Estatus:</strong> Nómina total</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Permitir</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Bloquear</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Capturar Excepciones:</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2">
                  <option>Permitir</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Movimientos de Empleados:</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2">
                  <option>Permitir</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ajustes de Asistencia:</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2">
                  <option>Permitir</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vacaciones, Incapacidades y Permisos:</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2">
                  <option>Permitir</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowPeriodModal(false)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
            >
              Anterior
            </button>
            <button
              onClick={() => setShowPeriodModal(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Siguiente
            </button>
            <button
              onClick={() => processPayroll(39, 'affect')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Ejecutar'}
            </button>
            <button
              onClick={() => setShowPeriodModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    );

    if (loading && !analytics) {
      return (
        <div className="h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando sistema de nómina...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-lg">{error}</p>
            <button 
              onClick={fetchInitialData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30`}>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800 text-sm">REVOLUTION</span>
                <span className="text-xs text-gray-500">en la nube</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4">
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Buscar en menú..." 
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-2">
                <option>Operación</option>
              </select>
            </div>
            
            <nav className="space-y-1">
              <div className="bg-orange-100 text-orange-800 border-l-4 border-orange-500 px-3 py-2 text-sm font-medium">
                Nómina
              </div>
              {menuItems.slice(1).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-6 py-2 rounded text-sm flex items-center space-x-2 ${
                      activeTab === item.id 
                        ? 'bg-orange-100 text-orange-800 border-l-4 border-orange-500' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <Menu size={20} />
                </button>
                <h1 className="text-xl font-semibold text-gray-800">Sistema de Nómina</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Frecuencia de Pago:</span>
                  <div className="relative">
                    <button
                      onClick={() => setShowPayFrequencyDropdown(!showPayFrequencyDropdown)}
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                    >
                      <span>{payFrequency}</span>
                      <ChevronDown size={16} />
                    </button>
                    {showPayFrequencyDropdown && (
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-300 rounded shadow-lg z-10">
                        {['Semanal', 'Quincenal', 'Mensual'].map((freq) => (
                          <button
                            key={freq}
                            onClick={() => {
                              setPayFrequency(freq);
                              setShowPayFrequencyDropdown(false);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            {freq}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    <span>Acciones</span>
                    <ChevronDown size={16} />
                  </button>
                  {showActionsDropdown && (
                    <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-64 overflow-y-auto">
                      {actionMenuItems.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (action === 'Afectar Nómina') {
                              setShowPeriodModal(true);
                            }
                            setShowActionsDropdown(false);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-6 overflow-y-auto">
            {/* Analytics Summary */}
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-600">Total Empleados</div>
                  <div className="text-2xl font-bold text-gray-800">{analytics.total_employees}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-600">Percepciones</div>
                  <div className="text-2xl font-bold text-green-600">${analytics.total_earnings?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-600">Deducciones</div>
                  <div className="text-2xl font-bold text-red-600">${analytics.total_deductions?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-600">Obligaciones</div>
                  <div className="text-2xl font-bold text-blue-600">${analytics.total_obligations?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-600">Nómina Neta</div>
                  <div className="text-2xl font-bold text-gray-800">${analytics.net_payroll?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
            )}

            {/* Periods Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Períodos de Nómina</h2>
                <span className="text-xs text-blue-500">{USE_MOCK_DATA ? 'MODO DE PRUEBA: Datos simulados' : 'MODO PRODUCCIÓN: Datos de API'}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Período</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Inicio</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Fin</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Pago</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Días</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tipo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {periods.map((period) => (
                      <tr key={period.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">{period.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(period.start_date).toLocaleDateString('es-MX')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(period.end_date).toLocaleDateString('es-MX')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(period.pay_date).toLocaleDateString('es-MX')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            period.status === 'completed' ? 'bg-green-100 text-green-800' :
                            period.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {period.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{period.days}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{period.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>

        {/* Modals */}
        {showPeriodModal && <PeriodModal />}
      </div>
    );
};

export default PayrollPlatform;