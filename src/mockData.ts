import type { Project, ProjectAdvance, ProjectActivity, ProjectMeeting, ProjectCommitment, TimeLog, ProjectRisk } from './types';


export const mockProjects: Project[] = [
  {
    id: 1,
    code: 'PRJ-2026-001',
    name: 'Migración del Core Financiero v4',
    description: 'Actualización integral de la plataforma transaccional principal de la cooperativa para mejorar la velocidad de procesamiento, la seguridad de las transacciones y habilitar APIs abiertas.',
    estimatedEffortHours: 450000,
    status: 'En curso',
    leader_id: 1,
    leader_name: 'Ing. Carlos Mendoza',
    sponsor: 'Dr. Roberto Ortiz (Gerente General)',
    responsible_func: 'Diana Paredes (Subgerenta de Operaciones)',
    responsible_exec: 'Ing. Carlos Mendoza (Jefe de TI)',
    area_solicitante: 'Operaciones y Tecnología',
    start_date: '2026-01-15',
    end_date: '2026-10-30',
    objective: 'Migrar el 100% de las cuentas de ahorro, créditos y plazos fijos al nuevo Core Financiero v4 reduciendo el tiempo de inactividad programado a menos de 6 horas.',
    scope: 'Migración de base de datos Oracle a PostgreSQL, rediseño de flujos transaccionales de ventanilla, habilitación de bus de integración (ESB) y capacitación al 100% del personal operativo.',
    expected_result: 'Sistema central moderno con capacidad de procesar 500 transacciones por segundo (tps), integración directa con canales digitales y reducción del costo de mantenimiento anual en 25%.',
    execution_style: 'Híbrido'
  },
  {
    id: 2,
    code: 'PRJ-2026-002',
    name: 'Nueva App Móvil Cooperativa (iOS/Android)',
    description: 'Desarrollo de una nueva aplicación móvil nativa con autenticación biométrica, simulación de créditos en línea y transferencias interbancarias inmediatas en tiempo real.',
    estimatedEffortHours: 180000,
    status: 'En curso',
    leader_id: 2,
    leader_name: 'Lic. Sofía Vega',
    sponsor: 'Ing. Laura Flores (Directora de Negocios)',
    responsible_func: 'Lic. Sofía Vega (Jefa de Canales Digitales)',
    responsible_exec: 'Alex Castro (Líder Técnico Mobile)',
    area_solicitante: 'Negocios y Marketing',
    start_date: '2026-03-01',
    end_date: '2026-08-15',
    objective: 'Lanzar una aplicación móvil moderna calificada con más de 4.5 estrellas en las tiendas de aplicaciones, logrando la afiliación de 15,000 socios activos en los primeros 6 meses.',
    scope: 'Diseño UX/UI, integraciones con APIs del Core Financiero, desarrollo nativo Flutter, autenticación por huella/rostro, módulo de pago de servicios y pasarela de transferencias inmediatas.',
    expected_result: 'App móvil publicada en App Store y Google Play con servicios transaccionales 24/7 y capacidad de enrolamiento digital automático mediante validación facial de cédula.',
    execution_style: 'Ágil'
  },
  {
    id: 3,
    code: 'PRJ-2026-003',
    name: 'Implementación BPMO y Gobernanza de Proyectos',
    description: 'Establecimiento de la Oficina de Gestión de Proyectos y Procesos (BPMO) para estandarizar metodologías, herramientas de seguimiento y gobernanza estratégica en la cooperativa.',
    estimatedEffortHours: 65000,
    status: 'Borrador',
    leader_id: 3,
    leader_name: 'Dra. Patricia Silva',
    sponsor: 'Dr. Roberto Ortiz (Gerente General)',
    responsible_func: 'Dra. Patricia Silva (Jefa de Planificación)',
    responsible_exec: 'Marcos Rivas (Consultor Organizacional)',
    area_solicitante: 'Gerencia General / Planificación',
    start_date: '2026-07-01',
    end_date: '2026-12-15',
    objective: 'Implementar el marco de gobernanza y control de proyectos corporativos, reduciendo las desviaciones en tiempos y costos de proyectos en al menos un 15%.',
    scope: 'Creación de plantillas estándar (Brief, MVP, Modelo), capacitación a jefaturas, definición del flujo de aprobación del portafolio y puesta en marcha de la herramienta institucional de seguimiento.',
    expected_result: 'Metodología BPMO formalizada y aprobada por el Consejo de Administración, y tablero ejecutivo operativo para el 100% de los proyectos institucionales.',
    execution_style: 'Cascada'
  },
  {
    id: 4,
    code: 'PRJ-2026-004',
    name: 'Automatización de Crédito de Consumo Web',
    description: 'Desarrollo del flujo digital para la aprobación y desembolso automático de créditos de consumo preaprobados en menos de 5 minutos a través del portal transaccional Banca Web.',
    estimatedEffortHours: 95000,
    status: 'Con retraso',
    leader_id: 2,
    leader_name: 'Lic. Sofía Vega',
    sponsor: 'Ing. Laura Flores (Directora de Negocios)',
    responsible_func: 'Santiago Paz (Jefe de Crédito y Cobranzas)',
    responsible_exec: 'Lic. Sofía Vega (Jefa de Canales Digitales)',
    area_solicitante: 'Crédito / Negocios',
    start_date: '2026-02-01',
    end_date: '2026-07-30',
    objective: 'Permitir a los socios calificados obtener el desembolso de su crédito preaprobado de forma 100% autogestionada sin acudir a una oficina física.',
    scope: 'Motor de reglas de crédito parametrizado, firma electrónica avanzada, integración con buró de crédito en tiempo real y flujo de desembolso automático en la cuenta del socio.',
    expected_result: 'Colocación de créditos digitales por un valor de $2 millones en el año 2026, con tiempo promedio de desembolso de 3 minutos y cero papel.',
    execution_style: 'Híbrido'
  }
];

export const mockAdvances: ProjectAdvance[] = [
  // PRJ-2026-001 - Core
  {
    id: 1,
    project_id: 1,
    date: '2026-05-15',
    progress_pct: 35,
    summary: 'Completada la fase de diseño del esquema de base de datos migrada en PostgreSQL.',
    completed_tasks: 'Diseño de tablas lógicas, mapeo de tipos de datos Oracle a PostgreSQL, y pruebas iniciales de rendimiento de consultas.',
    value_delivered: 'Esquema de datos optimizado que reduce los tiempos de respuesta de consulta de saldos en un 40% en ambiente de pruebas.',
    evidence: 'script_esquema_db_v4.sql',
    reporter: 'Carlos Mendoza',
    next_steps: 'Iniciar el proceso de migración de datos históricos (extracciones de prueba) y configurar el ambiente de pruebas pre-producción (Staging).',
    notes: 'Se requiere coordinación con el área de operaciones para programar la ventana de inactividad de las extracciones de datos históricos.'
  },
  {
    id: 2,
    project_id: 1,
    date: '2026-06-10',
    progress_pct: 48,
    summary: 'Primer piloto de migración de datos históricos ejecutado con éxito en ambiente de QA.',
    completed_tasks: 'Migración del 10% de cuentas activas de socios (15,000 cuentas de prueba) con conciliación de saldos al centavo.',
    value_delivered: 'Script de migración optimizado y validado por auditoría interna sin inconsistencias financieras detectadas.',
    evidence: 'acta_auditoria_migracion_piloto1.pdf',
    reporter: 'Carlos Mendoza',
    next_steps: 'Iniciar el desarrollo de las APIs de integración con ventanillas (cajas).',
    notes: 'Auditoría aprobó formalmente el cuadre financiero del piloto.'
  },
  // PRJ-2026-002 - App Movil
  {
    id: 3,
    project_id: 2,
    date: '2026-05-20',
    progress_pct: 45,
    summary: 'Sprint 3 finalizado: Completado el diseño UX/UI y el flujo de Autenticación Biométrica.',
    completed_tasks: 'Diseño en Figma aprobado, maquetación de pantallas de Login y Posición Consolidada, integración con FaceID y TouchID nativos.',
    value_delivered: 'Prototipo interactivo en Figma aprobado por Negocios e interfaz de login funcional.',
    evidence: 'figma_prototipo_app_v2',
    reporter: 'Sofía Vega',
    next_steps: 'Comenzar con el desarrollo del módulo de Transferencias Internas e Interbancarias (SPI).',
    notes: 'El flujo biométrico fue testeado con un grupo focal de 20 socios con excelentes comentarios sobre velocidad.'
  },
  {
    id: 4,
    project_id: 2,
    date: '2026-06-18',
    progress_pct: 62,
    summary: 'Sprint 5 finalizado: Módulo de transferencias entre cuentas de la cooperativa completado.',
    completed_tasks: 'Desarrollo de lógica de débito y crédito inmediato, envío de notificaciones push de confirmación y pantalla de comprobante digital.',
    value_delivered: 'Funcionalidad de transferencia entre socios operativa en entorno de pruebas conectada al Core.',
    evidence: 'demo_video_transferencias.mp4',
    reporter: 'Sofía Vega',
    next_steps: 'Integrar las transferencias interbancarias SPI inmediatas.',
    notes: 'Se reporta bloqueo con el API del Banco Central para pruebas del módulo interbancario SPI.'
  },
  // PRJ-2026-004 - Automatizacion credito
  {
    id: 5,
    project_id: 4,
    date: '2026-05-02',
    progress_pct: 20,
    summary: 'Parametrización básica del motor de reglas terminada.',
    completed_tasks: 'Configuración de políticas de crédito (score mínimo, capacidad de pago, niveles de endeudamiento) en la herramienta de análisis.',
    value_delivered: 'Matriz lógica de decisión de crédito automatizada.',
    evidence: 'matriz_reglas_credito_v1.xlsx',
    reporter: 'Sofía Vega',
    next_steps: 'Desarrollo de la API de integración con el Buró de Crédito externo.',
    notes: 'El buró de crédito está demorando en entregar las credenciales definitivas para el ambiente de pruebas.'
  }
];

export const mockActivities: ProjectActivity[] = [
  // PRJ-2026-001 - Core
  {
    id: 101,
    project_id: 1,
    name: 'Modelado y diseño de base de datos PostgreSQL',
    description: 'Migrar y optimizar el esquema relacional desde Oracle para adaptarlo a PostgreSQL, creando índices y triggers de auditoría.',
    type: 'Base de Datos',
    assignee: 'Ing. Carlos Mendoza',
    priority: 'Alta',
    kanban_status: 'Terminado',
    start_date: '2026-01-20',
    due_date: '2026-03-15',
    end_date: '2026-03-10',
    estimated_hours: 120,
    actual_hours: 110,
    progress_pct: 100,
    acceptance_criteria: 'Esquema de base de datos sin errores de compilación, cargado en el servidor local de base de datos con cuadre relacional.',
    notes: 'Se optimizaron 15 triggers críticos.'
  },
  {
    id: 102,
    project_id: 1,
    name: 'Desarrollo de scripts de extracción de datos históricos',
    description: 'Creación de procesos ETL para extraer, transformar y cargar la información de socios, cuentas y créditos históricos de los últimos 5 años.',
    type: 'ETL / Migración',
    assignee: 'Mario Gómez (DBA)',
    priority: 'Alta',
    kanban_status: 'Terminado',
    start_date: '2026-03-16',
    due_date: '2026-05-30',
    end_date: '2026-06-02',
    estimated_hours: 180,
    actual_hours: 195,
    progress_pct: 100,
    acceptance_criteria: 'Carga completa de datos históricos de prueba en QA que coincida al 100% con los saldos consolidados de contabilidad.',
    notes: 'Tomó 3 días más de lo previsto por problemas de limpieza de datos de direcciones antiguas.'
  },
  {
    id: 103,
    project_id: 1,
    name: 'Desarrollo de APIs de integración de Cajas / Ventanillas',
    description: 'Desarrollo de servicios web REST para que el sistema de cajas interactúe con el nuevo Core Financiero v4 en tiempo real.',
    type: 'Desarrollo Backend',
    assignee: 'Ing. Carlos Mendoza',
    priority: 'Crítica',
    kanban_status: 'En progreso',
    start_date: '2026-06-03',
    due_date: '2026-08-15',
    estimated_hours: 240,
    actual_hours: 90,
    progress_pct: 40,
    acceptance_criteria: 'APIs documentadas en Swagger, con pruebas de rendimiento unitarias ejecutadas que toleren un delay máximo de 200ms.',
    notes: 'Avance normal. Se integró el módulo de depósitos básicos.'
  },
  {
    id: 104,
    project_id: 1,
    name: 'Pruebas Integrales de Estrés y Concurrencia',
    description: 'Ejecución de simulaciones de carga transaccional simulando el flujo de fin de mes con 200 cajeros y 20,000 transacciones simultáneas.',
    type: 'Control de Calidad (QA)',
    assignee: 'Valeria López (QA)',
    priority: 'Alta',
    kanban_status: 'Por hacer',
    start_date: '2026-08-16',
    due_date: '2026-09-20',
    estimated_hours: 80,
    actual_hours: 0,
    progress_pct: 0,
    acceptance_criteria: 'El sistema debe resistir la carga de 500 tps sin registrar caídas y con uso de CPU en servidores por debajo del 80%.',
    notes: 'Pendiente hasta tener las APIs integradas.'
  },

  // PRJ-2026-002 - App Movil
  {
    id: 201,
    project_id: 2,
    name: 'Diseño UX/UI de las interfaces de la App',
    description: 'Creación del diseño interactivo en Figma de todos los flujos de pantallas para móviles iOS y Android respetando el manual de marca.',
    type: 'Diseño',
    assignee: 'Diana Cárdenas (UX Designer)',
    priority: 'Media',
    kanban_status: 'Terminado',
    start_date: '2026-03-01',
    due_date: '2026-04-15',
    end_date: '2026-04-12',
    estimated_hours: 90,
    actual_hours: 85,
    progress_pct: 100,
    acceptance_criteria: 'Interfaces de usuario aprobadas formalmente por el comité de Negocios y Marketing de la cooperativa.',
    notes: 'El diseño es limpio y usa la paleta azul institucional.'
  },
  {
    id: 202,
    project_id: 2,
    name: 'Desarrollo de Autenticación Biométrica y Posición Consolidada',
    description: 'Maquetación e implementación del inicio de sesión por biometría y la pantalla principal de saldos generales del socio.',
    type: 'Desarrollo Mobile',
    assignee: 'Alex Castro (Líder Técnico Mobile)',
    priority: 'Alta',
    kanban_status: 'Terminado',
    start_date: '2026-04-13',
    due_date: '2026-05-20',
    end_date: '2026-05-20',
    estimated_hours: 100,
    actual_hours: 105,
    progress_pct: 100,
    acceptance_criteria: 'Acceso seguro validado en emuladores y dispositivos físicos con huella y reconocimiento facial.',
    notes: 'Integración biométrica exitosa.'
  },
  {
    id: 203,
    project_id: 2,
    name: 'Desarrollo de transferencias internas inmediatas',
    description: 'Implementación del flujo de selección de cuenta origen, cuenta destino interna (otro socio), ingreso de monto y envío inmediato.',
    type: 'Desarrollo Mobile',
    assignee: 'Alex Castro (Líder Técnico Mobile)',
    priority: 'Alta',
    kanban_status: 'Terminado',
    start_date: '2026-05-21',
    due_date: '2026-06-20',
    end_date: '2026-06-18',
    estimated_hours: 110,
    actual_hours: 98,
    progress_pct: 100,
    acceptance_criteria: 'Transacciones registradas en el Core en tiempo real con actualización inmediata del saldo y recibo de transacción descargable.',
    notes: 'Funcionalidad completa en ambiente de pruebas.'
  },
  {
    id: 204,
    project_id: 2,
    name: 'Integración del canal SPI (Transferencias Interbancarias)',
    description: 'Conectar el módulo de transferencias externas con la pasarela SPI del Banco Central en tiempo real.',
    type: 'Desarrollo Mobile',
    assignee: 'Alex Castro (Líder Técnico Mobile)',
    priority: 'Crítica',
    kanban_status: 'Bloqueado',
    start_date: '2026-06-19',
    due_date: '2026-07-15',
    estimated_hours: 120,
    actual_hours: 15,
    progress_pct: 15,
    acceptance_criteria: 'Transferencia realizada con éxito a cuentas de otras instituciones bancarias nacionales acreditada en menos de 10 segundos.',
    notes: 'Bloqueado por falta de credenciales de red privada virtual (VPN) del Banco Central para pruebas de desarrollo.'
  },

  // PRJ-2026-004 - Credito Web
  {
    id: 401,
    project_id: 4,
    name: 'Desarrollo de API de integración con Buró de Crédito',
    description: 'Conexión vía Web Service seguro para consultar el puntaje e historial crediticio del socio de forma instantánea al iniciar la solicitud.',
    type: 'Desarrollo Backend',
    assignee: 'Roberto Franco',
    priority: 'Alta',
    kanban_status: 'En progreso',
    start_date: '2026-03-01',
    due_date: '2026-04-15',
    estimated_hours: 80,
    actual_hours: 75,
    progress_pct: 80,
    acceptance_criteria: 'Obtención de JSON estructurado del score del socio en menos de 2 segundos garantizando confidencialidad.',
    notes: 'Demoras por cambios en el contrato de API del proveedor externo de Buró. Vencido respecto a la fecha objetivo inicial.'
  },
  {
    id: 402,
    project_id: 4,
    name: 'Desarrollo del flujo de Firma Electrónica del contrato',
    description: 'Integrar API de firma digital para que el socio firme el pagaré electrónico y el contrato de crédito usando código OTP enviado a su celular.',
    type: 'Desarrollo Backend',
    assignee: 'Roberto Franco',
    priority: 'Alta',
    kanban_status: 'Bloqueado',
    start_date: '2026-04-16',
    due_date: '2026-05-30',
    estimated_hours: 90,
    actual_hours: 20,
    progress_pct: 22,
    acceptance_criteria: 'Contratos firmados digitalmente que cumplan con la Ley de Comercio Electrónico nacional.',
    notes: 'Bloqueado porque no se ha firmado el contrato comercial con la entidad proveedora de firmas OTP electrónicas.'
  }
];

export const mockMeetings: ProjectMeeting[] = [
  // PRJ-2026-001 - Core
  {
    id: 301,
    project_id: 1,
    date_time: '2026-05-12 10:00',
    type: 'Comité',
    attendees: ['Carlos Mendoza', 'Diana Paredes', 'Roberto Ortiz', 'Auditores Externos'],
    topics: 'Aprobación del esquema de datos PostgreSQL y plan de migración piloto.',
    decisions: 'Se aprueba formalmente el esquema de base de datos y se autoriza iniciar el Piloto 1 con el 10% de cuentas de socios.',
    agreements: 'El equipo de TI preparará la base de QA para el piloto. Auditoría supervisará los cuadres transaccionales el día de la ejecución.',
    impediments: 'Ninguno reportado.',
    notes: 'La reunión duró 1.5 horas. El ambiente de pruebas se declaró listo.'
  },
  {
    id: 302,
    project_id: 1,
    date_time: '2026-06-08 14:30',
    type: 'Seguimiento ejecutivo',
    attendees: ['Carlos Mendoza', 'Diana Paredes', 'Valeria López'],
    topics: 'Revisión de resultados del Piloto 1 de migración e inicio de APIs de Cajas.',
    decisions: 'Se da por exitoso el Piloto 1 con cero diferencias monetarias. Se autoriza el inicio del desarrollo del API de Cajas.',
    agreements: 'Carlos Mendoza asignará a Mario Gómez el desarrollo de las APIs críticas. Valeria preparará el plan de pruebas integrales.',
    impediments: 'Se identificó que el equipo de soporte de cajas tiene dudas funcionales sobre el flujo de depósitos especiales.',
    notes: 'Se agendará una sesión funcional aclaratoria.'
  },
  // PRJ-2026-002 - App Movil
  {
    id: 303,
    project_id: 2,
    date_time: '2026-06-15 09:30',
    type: 'Planning',
    attendees: ['Sofía Vega', 'Alex Castro', 'Diana Cárdenas'],
    topics: 'Planificación de Sprint 6: Integración SPI interbancaria y transferencias inmediatas.',
    decisions: 'El Sprint 6 se centrará en el canal SPI inmediato interbancario.',
    agreements: 'Alex Castro solicitará accesos de VPN del Banco Central. Sofía Vega gestionará con la gerencia de Negocios el token de pruebas del BCE.',
    impediments: 'El Banco Central no ha enviado el correo con los certificados de VPN para el ambiente Sandbox de la cooperativa.',
    notes: 'Impedimento crítico que pone en riesgo el cumplimiento del sprint.'
  }
];

export const mockCommitments: ProjectCommitment[] = [
  // PRJ-2026-001 - Core
  {
    id: 401,
    project_id: 1,
    meeting_id: 301,
    description: 'Entregar informe de conciliación financiera y cuadre de saldos del Piloto 1.',
    assignee: 'Carlos Mendoza',
    due_date: '2026-05-20',
    status: 'Cumplido',
    evidence: 'informe_cuadre_saldos_piloto1.pdf',
    notes: 'Informe entregado a tiempo y aprobado por el área de auditoría interna.'
  },
  {
    id: 402,
    project_id: 1,
    meeting_id: 302,
    description: 'Coordinar con la subgerencia de Operaciones la reunión aclaratoria sobre flujo de depósitos especiales.',
    assignee: 'Diana Paredes',
    due_date: '2026-06-15',
    status: 'Cumplido',
    evidence: 'correo_invitacion_reunion_deposito_especial.msg',
    notes: 'Reunión realizada el 12 de Junio con éxito.'
  },
  {
    id: 403,
    project_id: 1,
    meeting_id: 302,
    description: 'Entregar primer borrador de la matriz de pruebas integrales QA para APIs de Cajas.',
    assignee: 'Valeria López',
    due_date: '2026-07-10',
    status: 'En proceso',
    evidence: '',
    notes: 'En desarrollo, avance al 50%.'
  },
  // PRJ-2026-002 - App Movil
  {
    id: 404,
    project_id: 2,
    meeting_id: 303,
    description: 'Conseguir el set de credenciales de red VPN y certificados sandbox del Banco Central para pruebas del SPI.',
    assignee: 'Sofía Vega',
    due_date: '2026-06-22',
    status: 'Vencido',
    evidence: '',
    notes: 'Vencido. La solicitud fue ingresada en el Banco Central el 10 de Junio, pero no hemos tenido respuesta del área de TI del BCE.'
  },
  {
    id: 405,
    project_id: 2,
    meeting_id: 303,
    description: 'Preparar casos de prueba de carga móvil simulada para transferencias de socios.',
    assignee: 'Alex Castro',
    due_date: '2026-06-30',
    status: 'Pendiente',
    evidence: '',
    notes: 'Programado para iniciar una vez terminada la maquetación SPI.'
  }
];

export const mockTimeLogs: TimeLog[] = [
  // PRJ-2026-001 - Core
  {
    id: 501,
    project_id: 1,
    activity_id: 101,
    activity_name: 'Modelado y diseño de base de datos PostgreSQL',
    date: '2026-02-15',
    user: 'Carlos Mendoza',
    description: 'Mapeo de tipos de datos complejos y triggers de conciliación.',
    type: 'Diseño Base de Datos',
    estimated_hours: 120,
    actual_hours: 110,
    notes: 'Completado antes de tiempo y optimizado.'
  },
  {
    id: 502,
    project_id: 1,
    activity_id: 102,
    activity_name: 'Desarrollo de scripts de extracción de datos históricos',
    date: '2026-04-10',
    user: 'Mario Gómez (DBA)',
    description: 'Depuración y migración de datos históricos de préstamos y depósitos.',
    type: 'Migración ETL',
    estimated_hours: 180,
    actual_hours: 195,
    notes: 'Se requirieron 15 horas adicionales para limpiar registros nulos de direcciones antiguas.'
  },
  {
    id: 503,
    project_id: 1,
    activity_id: 103,
    activity_name: 'Desarrollo de APIs de integración de Cajas / Ventanillas',
    date: '2026-06-20',
    user: 'Carlos Mendoza',
    description: 'Desarrollo de API de depósitos y retiros básicos y documentación Swagger.',
    type: 'Desarrollo Backend',
    estimated_hours: 240,
    actual_hours: 90,
    notes: 'Horas reales acumuladas hasta la fecha actual de desarrollo.'
  },
  // PRJ-2026-002 - App Movil
  {
    id: 504,
    project_id: 2,
    activity_id: 201,
    activity_name: 'Diseño UX/UI de las interfaces de la App',
    date: '2026-03-25',
    user: 'Diana Cárdenas (UX Designer)',
    description: 'Elaboración de wireframes y diseño de interfaz móvil corporativa.',
    type: 'Diseño UX/UI',
    estimated_hours: 90,
    actual_hours: 85,
    notes: 'Aprobado formalmente por Negocios.'
  },
  {
    id: 505,
    project_id: 2,
    activity_id: 202,
    activity_name: 'Desarrollo de Autenticación Biométrica y Posición Consolidada',
    date: '2026-05-10',
    user: 'Alex Castro',
    description: 'Integración biométrica con plugins Flutter e inicio de sesión seguro.',
    type: 'Desarrollo Mobile',
    estimated_hours: 100,
    actual_hours: 105,
    notes: 'Pruebas exitosas en dispositivos Android e iOS.'
  }
];

export const mockRisks: ProjectRisk[] = [
  // PRJ-2026-001 - Core
  {
    id: 601,
    project_id: 1,
    type: 'Riesgo',
    description: 'Posible resistencia al cambio del personal de ventanilla al utilizar la nueva interfaz del Core v4.',
    impact: 'Medio',
    probability: 'Alta',
    assignee: 'Diana Paredes',
    date_identified: '2026-02-10',
    status: 'En tratamiento',
    mitigation_action: 'Realizar jornadas previas de capacitación intensiva práctica y lanzar un programa de embajadores de tecnología en agencias.',
    notes: 'Ya se iniciaron las capacitaciones virtuales.'
  },
  {
    id: 602,
    project_id: 1,
    type: 'Dependencia',
    description: 'Dependencia de la entrega del esquema de auditoría por parte del proveedor externo para terminar las APIs de cajas.',
    impact: 'Alto',
    probability: 'Media',
    assignee: 'Carlos Mendoza',
    date_identified: '2026-06-01',
    status: 'Abierto',
    mitigation_action: 'Escalar formalmente la solicitud al gerente del proyecto del proveedor externo con copia a Gerencia General.',
    notes: 'Pendiente de entrega de especificaciones.'
  },
  // PRJ-2026-002 - App Movil
  {
    id: 603,
    project_id: 2,
    type: 'Bloqueo',
    description: 'Ausencia de certificados y credenciales de acceso VPN por parte del Banco Central del Ecuador (BCE) para el SPI.',
    impact: 'Alto',
    probability: 'Alta',
    assignee: 'Sofía Vega',
    date_identified: '2026-06-12',
    status: 'Abierto',
    mitigation_action: 'Gerenta de Negocios solicitará una sesión de trabajo de emergencia con la dirección técnica de sistemas del BCE.',
    notes: 'Bloqueo crítico que detiene el desarrollo del Sprint 6. Se muestra destacado en color rojo.'
  },
  // PRJ-2026-004 - Credito Web
  {
    id: 604,
    project_id: 4,
    type: 'Bloqueo',
    description: 'Falta de firma de convenio comercial con el proveedor de firmas y tokens electrónicos OTP.',
    impact: 'Alto',
    probability: 'Alta',
    assignee: 'Santiago Paz',
    date_identified: '2026-04-10',
    status: 'Abierto',
    mitigation_action: 'Enviar el borrador del convenio legal y económico al Consejo de Administración para aprobación prioritaria en la sesión semanal.',
    notes: 'El trámite legal está retrasando el desarrollo del flujo de contratación digital de créditos.'
  }
];
