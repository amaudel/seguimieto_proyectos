-- Datos Seed de Prueba - Seguimiento de Proyectos Cooperativa

-- 0. Limpieza segura de datos demo previos (respetando llaves foráneas)
truncate table project_evidence restart identity cascade;
truncate table project_risks restart identity cascade;
truncate table time_logs restart identity cascade;
truncate table meeting_commitments restart identity cascade;
truncate table meeting_attendees restart identity cascade;
truncate table project_meetings restart identity cascade;
truncate table project_items restart identity cascade;
truncate table project_advances restart identity cascade;
truncate table projects restart identity cascade;
truncate table profiles restart identity cascade;
truncate table roles restart identity cascade;

-- 1. Insertar Catálogo de Roles
insert into roles (id, name, description) values
('00000000-0000-0000-0000-000000000001', 'admin', 'Administrador del sistema con acceso total.'),
('00000000-0000-0000-0000-000000000002', 'leader', 'Líder técnico de proyectos de la cooperativa.'),
('00000000-0000-0000-0000-000000000003', 'viewer', 'Sponsors y visualizadores funcionales de áreas solicitantes.');

-- 2. Insertar Perfiles MOCK Controlados
insert into profiles (id, email, first_name, last_name, role_id) values
('11111111-1111-1111-1111-111111111101', 'carlos.mendoza@coopac.fin.ec', 'Carlos', 'Mendoza', '00000000-0000-0000-0000-000000000002'),
('11111111-1111-1111-1111-111111111102', 'sofia.vega@coopac.fin.ec', 'Sofía', 'Vega', '00000000-0000-0000-0000-000000000002'),
('11111111-1111-1111-1111-111111111103', 'patricia.silva@coopac.fin.ec', 'Patricia', 'Silva', '00000000-0000-0000-0000-000000000002'),
('11111111-1111-1111-1111-111111111104', 'roberto.ortiz@coopac.fin.ec', 'Roberto', 'Ortiz', '00000000-0000-0000-0000-000000000003'),
('11111111-1111-1111-1111-111111111105', 'laura.flores@coopac.fin.ec', 'Laura', 'Flores', '00000000-0000-0000-0000-000000000003'),
('11111111-1111-1111-1111-111111111106', 'diana.paredes@coopac.fin.ec', 'Diana', 'Paredes', '00000000-0000-0000-0000-000000000003'),
('11111111-1111-1111-1111-111111111107', 'santiago.paz@coopac.fin.ec', 'Santiago', 'Paz', '00000000-0000-0000-0000-000000000003'),
('11111111-1111-1111-1111-111111111108', 'mario.gomez@coopac.fin.ec', 'Mario', 'Gómez', '00000000-0000-0000-0000-000000000003'),
('11111111-1111-1111-1111-111111111109', 'alex.castro@coopac.fin.ec', 'Alex', 'Castro', '00000000-0000-0000-0000-000000000003'),
('11111111-1111-1111-1111-111111111110', 'valeria.lopez@coopac.fin.ec', 'Valeria', 'López', '00000000-0000-0000-0000-000000000003'),
('11111111-1111-1111-1111-111111111111', 'roberto.franco@coopac.fin.ec', 'Roberto', 'Franco', '00000000-0000-0000-0000-000000000003'),
('11111111-1111-1111-1111-111111111112', 'diana.cardenas@coopac.fin.ec', 'Diana', 'Cárdenas', '00000000-0000-0000-0000-000000000003');

-- 3. Insertar Proyectos (Datos Equivalentes a Fase 1 con Esfuerzo en Horas en lugar de Presupuesto)
insert into projects (id, project_code, name, description, estimated_effort_hours, status, leader_id, sponsor, responsible_func, responsible_exec, area_solicitante, start_date, end_date, objective, scope, expected_result, execution_style, created_by, updated_by) values
(
    '22222222-2222-2222-2222-222222222201',
    'PRJ-2026-001',
    'Migración del Core Financiero v4',
    'Actualización integral de la plataforma transaccional principal de la cooperativa para mejorar la velocidad de procesamiento, la seguridad de las transacciones y habilitar APIs abiertas.',
    450000, -- esfuerzo estimado (anteriormente expresado como 450000.00 en budget)
    'En curso',
    '11111111-1111-1111-1111-111111111101', -- Carlos Mendoza
    'Dr. Roberto Ortiz (Gerente General)',
    'Diana Paredes (Subgerenta de Operaciones)',
    'Ing. Carlos Mendoza (Jefe de TI)',
    'Operaciones y Tecnología',
    '2026-01-15',
    '2026-10-30',
    'Migrar el 100% de las cuentas de ahorro, créditos y plazos fijos al nuevo Core Financiero v4 reduciendo el tiempo de inactividad programado a menos de 6 horas.',
    'Migración de base de datos Oracle a PostgreSQL, rediseño de flujos transaccionales de ventanilla, habilitación de bus de integración (ESB) y capacitación al 100% del personal operativo.',
    'Sistema central moderno con capacidad de procesar 500 transacciones por segundo (tps), integración directa con canales digitales y reducción del costo de mantenimiento anual en 25%.',
    'Híbrido',
    '11111111-1111-1111-1111-111111111101',
    '11111111-1111-1111-1111-111111111101'
),
(
    '22222222-2222-2222-2222-222222222202',
    'PRJ-2026-002',
    'Nueva App Móvil Cooperativa (iOS/Android)',
    'Desarrollo de una nueva aplicación móvil nativa con autenticación biométrica, simulación de créditos en línea y transferencias interbancarias inmediatas en tiempo real.',
    180000, -- h
    'En curso',
    '11111111-1111-1111-1111-111111111102', -- Sofía Vega
    'Ing. Laura Flores (Directora de Negocios)',
    'Lic. Sofía Vega (Jefa de Canales Digitales)',
    'Alex Castro (Líder Técnico Mobile)',
    'Negocios y Marketing',
    '2026-03-01',
    '2026-08-15',
    'Lanzar una aplicación móvil moderna calificada con más de 4.5 estrellas en las tiendas de aplicaciones, logrando la afiliación de 15,000 socios activos en los primeros 6 meses.',
    'Diseño UX/UI, integraciones con APIs del Core Financiero, desarrollo nativo Flutter, autenticación por huella/rostro, módulo de pago de servicios y pasarela de transferencias inmediatas.',
    'App móvil publicada en App Store y Google Play con servicios transaccionales 24/7 y capacidad de enrolamiento digital automático mediante validación facial de cédula.',
    'Ágil',
    '11111111-1111-1111-1111-111111111102',
    '11111111-1111-1111-1111-111111111102'
),
(
    '22222222-2222-2222-2222-222222222203',
    'PRJ-2026-003',
    'Implementación BPMO y Gobernanza de Proyectos',
    'Establecimiento de la Oficina de Gestión de Proyectos y Procesos (BPMO) para estandarizar metodologías, herramientas de seguimiento y gobernanza estratégica en la cooperativa.',
    65000, -- h
    'Borrador',
    '11111111-1111-1111-1111-111111111103', -- Patricia Silva
    'Dr. Roberto Ortiz (Gerente General)',
    'Dra. Patricia Silva (Jefa de Planificación)',
    'Marcos Rivas (Consultor Organizacional)',
    'Gerencia General / Planificación',
    '2026-07-01',
    '2026-12-15',
    'Implementar el marco de gobernanza y control de proyectos corporativos, reduciendo las desviaciones en tiempos y costos de proyectos en al menos un 15%.',
    'Creación de plantillas estándar (Brief, MVP, Modelo), capacitación a jefaturas, definición del flujo de aprobación del portafolio y puesta en marcha de la herramienta institucional de seguimiento.',
    'Metodología BPMO formalizada y aprobada por el Consejo de Administración, y tablero ejecutivo operativo para el 100% de los proyectos institucionales.',
    'Cascada',
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111103'
),
(
    '22222222-2222-2222-2222-222222222204',
    'PRJ-2026-004',
    'Automatización de Crédito de Consumo Web',
    'Desarrollo del flujo digital para la aprobación y desembolso automático de créditos de consumo preaprobados en menos de 5 minutos a través del portal transaccional Banca Web.',
    95000, -- h
    'Con retraso',
    '11111111-1111-1111-1111-111111111102', -- Sofía Vega
    'Ing. Laura Flores (Directora de Negocios)',
    'Santiago Paz (Jefe de Crédito y Cobranzas)',
    'Lic. Sofía Vega (Jefa de Canales Digitales)',
    'Crédito / Negocios',
    '2026-02-01',
    '2026-07-30',
    'Permitir a los socios calificados obtener el desembolso de su crédito preaprobado de forma 100% autogestionada sin acudir a una oficina física.',
    'Motor de reglas de crédito parametrizado, firma electrónica avanzada, integración con buró de crédito en tiempo real y flujo de desembolso automático en la cuenta del socio.',
    'Colocación de créditos digitales por un valor de $2 millones en el año 2026, con tiempo promedio de desembolso de 3 minutos y cero papel.',
    'Híbrido',
    '11111111-1111-1111-1111-111111111102',
    '11111111-1111-1111-1111-111111111102'
);

-- 4. Insertar Avances (project_advances)
insert into project_advances (id, project_id, date, progress_pct, summary, completed_tasks, value_delivered, reporter_id, next_steps, notes) values
(
    '33333333-3333-3333-3333-333333333301',
    '22222222-2222-2222-2222-222222222201',
    '2026-05-15',
    35,
    'Completada la fase de diseño del esquema de base de datos migrada en PostgreSQL.',
    'Diseño de tablas lógicas, mapeo de tipos de datos Oracle a PostgreSQL, y pruebas iniciales de rendimiento de consultas.',
    'Esquema de datos optimizado que reduce los tiempos de respuesta de consulta de saldos en un 40% en ambiente de pruebas.',
    '11111111-1111-1111-1111-111111111101', -- Carlos Mendoza
    'Iniciar el proceso de migración de datos históricos (extracciones de prueba) y configurar el ambiente de pruebas pre-producción (Staging).',
    'Se requiere coordinación con el área de operaciones para programar la ventana de inactividad de las extracciones de datos históricos.'
),
(
    '33333333-3333-3333-3333-333333333302',
    '22222222-2222-2222-2222-222222222201',
    '2026-06-10',
    48,
    'Primer piloto de migración de datos históricos ejecutado con éxito en ambiente de QA.',
    'Migración del 10% de cuentas activas de socios (15,000 cuentas de prueba) con conciliación de saldos al centavo.',
    'Migración aprobada y validada por auditoría sin inconsistencias detectadas.',
    '11111111-1111-1111-1111-111111111101',
    'Iniciar el desarrollo de las APIs de integración con ventanillas (cajas).',
    'Auditoría aprobó formalmente el cuadre financiero del piloto.'
),
(
    '33333333-3333-3333-3333-333333333303',
    '22222222-2222-2222-2222-222222222202',
    '2026-05-20',
    45,
    'Sprint 3 finalizado: Completado el diseño UX/UI y el flujo de Autenticación Biométrica.',
    'Diseño en Figma aprobado, maquetación de pantallas de Login y Posición Consolidada, integración con FaceID y TouchID nativos.',
    'Prototipo interactivo en Figma aprobado por Negocios e interfaz de login funcional.',
    '11111111-1111-1111-1111-111111111102', -- Sofía Vega
    'Comenzar con el desarrollo del módulo de Transferencias Internas e Interbancarias (SPI).',
    'El flujo biométrico fue testeado con un grupo focal de 20 socios con excelentes comentarios sobre velocidad.'
),
(
    '33333333-3333-3333-3333-333333333304',
    '22222222-2222-2222-2222-222222222202',
    '2026-06-18',
    62,
    'Sprint 5 finalizado: Módulo de transferencias entre cuentas de la cooperativa completado.',
    'Desarrollo de lógica de débito y crédito inmediato, envío de notificaciones push de confirmación y pantalla de comprobante digital.',
    'Funcionalidad de transferencia entre socios operativa en entorno de pruebas conectada al Core.',
    '11111111-1111-1111-1111-111111111102',
    'Integrar las transferencias interbancarias SPI inmediatas.',
    'Se reporta bloqueo con el API del Banco Central para pruebas del módulo interbancario SPI.'
),
(
    '33333333-3333-3333-3333-333333333305',
    '22222222-2222-2222-2222-222222222204',
    '2026-05-02',
    20,
    'Parametrización básica del motor de reglas terminada.',
    'Configuración de políticas de crédito (score mínimo, capacidad de pago, niveles de endeudamiento) en la herramienta de análisis.',
    'Matriz lógica de decisión de crédito automatizada.',
    '11111111-1111-1111-1111-111111111102',
    'Desarrollo de la API de integración con el Buró de Crédito externo.',
    'El buró de crédito está demorando en entregar las credenciales definitivas para el ambiente de pruebas.'
);

-- 5. Insertar Actividades (project_items)
insert into project_items (id, project_id, name, description, type, assignee_id, priority, kanban_status, start_date, due_date, end_date, estimated_hours, actual_hours, progress_pct, acceptance_criteria, notes) values
(
    '44444444-4444-4444-4444-444444444401',
    '22222222-2222-2222-2222-222222222201',
    'Modelado y diseño de base de datos PostgreSQL',
    'Migrar y optimizar el esquema relacional desde Oracle para adaptarlo a PostgreSQL, creando índices y triggers de auditoría.',
    'Base de Datos',
    '11111111-1111-1111-1111-111111111101', -- Carlos Mendoza
    'Alta',
    'Terminado',
    '2026-01-20',
    '2026-03-15',
    '2026-03-10',
    120,
    110,
    100,
    'Esquema de base de datos sin errores de compilación, cargado en el servidor local de base de datos con cuadre relacional.',
    'Se optimizaron 15 triggers críticos.'
),
(
    '44444444-4444-4444-4444-444444444402',
    '22222222-2222-2222-2222-222222222201',
    'Desarrollo de scripts de extracción de datos históricos',
    'Creación de procesos ETL para extraer, transformar y cargar la información de socios, cuentas y créditos históricos de los últimos 5 años.',
    'ETL / Migración',
    '11111111-1111-1111-1111-111111111108', -- Mario Gómez
    'Alta',
    'Terminado',
    '2026-03-16',
    '2026-05-30',
    '2026-06-02',
    180,
    195,
    100,
    'Carga completa de datos históricos de prueba en QA que coincida al 100% con los saldos consolidados de contabilidad.',
    'Tomó 3 días más de lo previsto por problemas de limpieza de datos de direcciones antiguas.'
),
(
    '44444444-4444-4444-4444-444444444403',
    '22222222-2222-2222-2222-222222222201',
    'Desarrollo de APIs de integración de Cajas / Ventanillas',
    'Desarrollo de servicios web REST para que el sistema de cajas interactúe con el nuevo Core Financiero v4 en tiempo real.',
    'Desarrollo Backend',
    '11111111-1111-1111-1111-111111111101',
    'Crítica',
    'En progreso',
    '2026-06-03',
    '2026-08-15',
    null,
    240,
    90,
    40,
    'APIs documentadas en Swagger, con pruebas de rendimiento unitarias ejecutadas que toleren un delay máximo de 200ms.',
    'Avance normal. Se integró el módulo de depósitos básicos.'
),
(
    '44444444-4444-4444-4444-444444444404',
    '22222222-2222-2222-2222-222222222201',
    'Pruebas Integrales de Estrés y Concurrencia',
    'Ejecución de simulaciones de carga transaccional simulando el flujo de fin de mes con 200 cajeros y 20,000 transacciones simultáneas.',
    'Control de Calidad (QA)',
    '11111111-1111-1111-1111-111111111110', -- Valeria López
    'Alta',
    'Por hacer',
    '2026-08-16',
    '2026-09-20',
    null,
    80,
    0,
    0,
    'El sistema debe resistir la carga de 500 tps sin registrar caídas y con uso de CPU en servidores por debajo del 80%.',
    'Pendiente hasta tener las APIs integradas.'
),
(
    '44444444-4444-4444-4444-444444444405',
    '22222222-2222-2222-2222-222222222202',
    'Diseño UX/UI de las interfaces de la App',
    'Creación del diseño interactivo en Figma de todos los flujos de pantallas para móviles iOS y Android respetando el manual de marca.',
    'Diseño',
    '11111111-1111-1111-1111-111111111112', -- Diana Cárdenas
    'Media',
    'Terminado',
    '2026-03-01',
    '2026-04-15',
    '2026-04-12',
    90,
    85,
    100,
    'Interfaces de usuario aprobadas formalmente por el comité de Negocios y Marketing de la cooperativa.',
    'El diseño es limpio y usa la paleta azul institucional.'
),
(
    '44444444-4444-4444-4444-444444444406',
    '22222222-2222-2222-2222-222222222202',
    'Desarrollo de Autenticación Biométrica y Posición Consolidada',
    'Maquetación e implementación del inicio de sesión por biometría y la pantalla principal de saldos generales del socio.',
    'Desarrollo Mobile',
    '11111111-1111-1111-1111-111111111109', -- Alex Castro
    'Alta',
    'Terminado',
    '2026-04-13',
    '2026-05-20',
    '2026-05-20',
    100,
    105,
    100,
    'Acceso seguro validado en emuladores y dispositivos físicos con huella y reconocimiento facial.',
    'Integración biométrica exitosa.'
),
(
    '44444444-4444-4444-4444-444444444407',
    '22222222-2222-2222-2222-222222222202',
    'Desarrollo de transferencias internas inmediatas',
    'Implementación del flujo de selección de cuenta origen, cuenta destino interna (otro socio), ingreso de monto y envío inmediato.',
    'Desarrollo Mobile',
    '11111111-1111-1111-1111-111111111109',
    'Alta',
    'Terminado',
    '2026-05-21',
    '2026-06-20',
    '2026-06-18',
    110,
    98,
    100,
    'Transacciones registradas en el Core en tiempo real con actualización inmediata del saldo y recibo de transacción descargable.',
    'Funcionalidad completa en ambiente de pruebas.'
),
(
    '44444444-4444-4444-4444-444444444408',
    '22222222-2222-2222-2222-222222222202',
    'Integración del canal SPI (Transferencias Interbancarias)',
    'Conectar el módulo de transferencias externas con la pasarela SPI del Banco Central en tiempo real.',
    'Desarrollo Mobile',
    '11111111-1111-1111-1111-111111111109',
    'Crítica',
    'Bloqueado',
    '2026-06-19',
    '2026-07-15',
    null,
    120,
    15,
    15,
    'Transferencia realizada con éxito a cuentas de otras instituciones bancarias nacionales acreditada en menos de 10 segundos.',
    'Bloqueado por falta de credenciales de red privada virtual (VPN) del Banco Central para pruebas de desarrollo.'
),
(
    '44444444-4444-4444-4444-444444444409',
    '22222222-2222-2222-2222-222222222204',
    'Desarrollo de API de integración con Buró de Crédito',
    'Conexión vía Web Service seguro para consultar el puntaje e historial crediticio del socio de forma instantánea al iniciar la solicitud.',
    'Desarrollo Backend',
    '11111111-1111-1111-1111-111111111111', -- Roberto Franco
    'Alta',
    'En progreso',
    '2026-03-01',
    '2026-04-15',
    null,
    80,
    75,
    80,
    'Obtención de JSON estructurado del score del socio en menos de 2 segundos garantizando confidencialidad.',
    'Demoras por cambios en el contrato de API del proveedor externo de Buró. Vencido respecto a la fecha objetivo inicial.'
),
(
    '44444444-4444-4444-4444-444444444410',
    '22222222-2222-2222-2222-222222222204',
    'Desarrollo del flujo de Firma Electrónica del contrato',
    'Integrar API de firma digital para que el socio firme el pagaré electrónico y el contrato de crédito usando código OTP enviado a su celular.',
    'Desarrollo Backend',
    '11111111-1111-1111-1111-111111111111',
    'Alta',
    'Bloqueado',
    '2026-04-16',
    '2026-05-30',
    null,
    90,
    20,
    22,
    'Contratos firmados digitalmente que cumplan con la Ley de Comercio Electrónico nacional.',
    'Bloqueado porque no se ha firmado el contrato comercial con la entidad proveedora de firmas OTP electrónicas.'
);

-- 6. Insertar Reuniones (project_meetings)
insert into project_meetings (id, project_id, date_time, type, topics, decisions, agreements, impediments, notes) values
(
    '55555555-5555-5555-5555-555555555501',
    '22222222-2222-2222-2222-222222222201',
    '2026-05-12 10:00:00+00',
    'Comité',
    'Aprobación del esquema de datos PostgreSQL y plan de migración piloto.',
    'Se aprueba formalmente el esquema de base de datos y se autoriza iniciar el Piloto 1 con el 10% de cuentas de socios.',
    'El equipo de TI preparará la base de QA para el piloto. Auditoría supervisará los cuadres transaccionales el día de la ejecución.',
    'Ninguno reportado.',
    'La reunión duró 1.5 horas. El ambiente de pruebas se declaró listo.'
),
(
    '55555555-5555-5555-5555-555555555502',
    '22222222-2222-2222-2222-222222222201',
    '2026-06-08 14:30:00+00',
    'Seguimiento ejecutivo',
    'Revisión de resultados del Piloto 1 de migración e inicio de APIs de Cajas.',
    'Se da por exitoso el Piloto 1 con cero diferencias monetarias. Se autoriza el inicio del desarrollo del API de Cajas.',
    'Carlos Mendoza asignará a Mario Gómez el desarrollo de las APIs críticas. Valeria preparará el plan de pruebas integrales.',
    'Se identificó que el equipo de cajas tiene dudas funcionales sobre el flujo de depósitos especiales.',
    'Se agendará una sesión funcional aclaratoria.'
),
(
    '55555555-5555-5555-5555-555555555503',
    '22222222-2222-2222-2222-222222222202',
    '2026-06-15 09:30:00+00',
    'Planning',
    'Planificación de Sprint 6: Integración SPI interbancaria y transferencias inmediatas.',
    'El Sprint 6 se centrará en el canal SPI inmediato interbancario.',
    'Alex Castro solicitará accesos de VPN del Banco Central. Sofía Vega gestionará con la gerencia de Negocios el token de pruebas del BCE.',
    'El Banco Central no ha enviado el correo con los certificados de VPN para el ambiente Sandbox de la cooperativa.',
    'Impedimento crítico que pone en riesgo el cumplimiento del sprint.'
);

-- 7. Insertar Asistentes a Reuniones (meeting_attendees)
insert into meeting_attendees (meeting_id, profile_id) values
('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111101'), -- Carlos
('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111104'), -- Roberto (Gerente)
('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111106'), -- Diana Paredes
('55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111101'), -- Carlos
('55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111106'), -- Diana
('55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111110'), -- Valeria
('55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111102'), -- Sofía
('55555555-5555-5555-5555-555555555503', '11111111-1111-1111-1111-111111111102'), -- Sofía
('55555555-5555-5555-5555-555555555503', '11111111-1111-1111-1111-111111111109'); -- Alex Castro

-- 8. Insertar Compromisos (meeting_commitments)
insert into meeting_commitments (id, project_id, meeting_id, description, assignee_id, due_date, status, notes) values
(
    '66666666-6666-6666-6666-666666666601',
    '22222222-2222-2222-2222-222222222201',
    '55555555-5555-5555-5555-555555555501',
    'Entregar informe de conciliación financiera y cuadre de saldos del Piloto 1.',
    '11111111-1111-1111-1111-111111111101', -- Carlos Mendoza
    '2026-05-20',
    'Cumplido',
    'Informe entregado a tiempo y aprobado por el área de auditoría interna.'
),
(
    '66666666-6666-6666-6666-666666666602',
    '22222222-2222-2222-2222-222222222201',
    '55555555-5555-5555-5555-555555555502',
    'Coordinar con la subgerencia de Operaciones la reunión aclaratoria sobre flujo de depósitos especiales.',
    '11111111-1111-1111-1111-111111111106', -- Diana Paredes
    '2026-06-15',
    'Cumplido',
    'Reunión realizada el 12 de Junio con éxito.'
),
(
    '66666666-6666-6666-6666-666666666603',
    '22222222-2222-2222-2222-222222222201',
    '55555555-5555-5555-5555-555555555502',
    'Entregar primer borrador de la matriz de pruebas integrales QA para APIs de Cajas.',
    '11111111-1111-1111-1111-111111111110', -- Valeria López
    '2026-07-10',
    'En proceso',
    'En desarrollo, avance al 50%.'
),
(
    '66666666-6666-6666-6666-666666666604',
    '22222222-2222-2222-2222-222222222202',
    '55555555-5555-5555-5555-555555555503',
    'Conseguir el set de credenciales de red VPN y certificados sandbox del Banco Central para pruebas del SPI.',
    '11111111-1111-1111-1111-111111111102', -- Sofía Vega
    '2026-06-22',
    'Vencido',
    'Vencido. La solicitud fue ingresada en el Banco Central el 10 de Junio, pero no hemos tenido respuesta del área de TI del BCE.'
),
(
    '66666666-6666-6666-6666-666666666605',
    '22222222-2222-2222-2222-222222222202',
    '55555555-5555-5555-5555-555555555503',
    'Preparar casos de prueba de carga móvil simulada para transferencias de socios.',
    '11111111-1111-1111-1111-111111111109', -- Alex Castro
    '2026-06-30',
    'Pendiente',
    'Programado para iniciar una vez terminada la maquetación SPI.'
);

-- 9. Insertar Registro de Tiempos (time_logs)
insert into time_logs (id, project_id, activity_id, date, user_id, description, type, actual_hours, notes) values
(
    '77777777-7777-7777-7777-777777777701',
    '22222222-2222-2222-2222-222222222201',
    '44444444-4444-4444-4444-444444444401',
    '2026-02-15',
    '11111111-1111-1111-1111-111111111101', -- Carlos
    'Mapeo de tipos de datos complejos y triggers de conciliación.',
    'Diseño Base de Datos',
    110,
    'Completado antes de tiempo y optimizado.'
),
(
    '77777777-7777-7777-7777-777777777702',
    '22222222-2222-2222-2222-222222222201',
    '44444444-4444-4444-4444-444444444402',
    '2026-04-10',
    '11111111-1111-1111-1111-111111111108', -- Mario Gómez
    'Depuración y migración de datos históricos de préstamos y depósitos.',
    'Migración ETL',
    195,
    'Se requirieron 15 horas adicionales para limpiar registros nulos.'
),
(
    '77777777-7777-7777-7777-777777777703',
    '22222222-2222-2222-2222-222222222201',
    '44444444-4444-4444-4444-444444444403',
    '2026-06-20',
    '11111111-1111-1111-1111-111111111101',
    'Desarrollo de API de depósitos y retiros básicos y documentación Swagger.',
    'Desarrollo Backend',
    90,
    'Horas reales acumuladas hasta la fecha actual.'
),
(
    '77777777-7777-7777-7777-777777777704',
    '22222222-2222-2222-2222-222222222202',
    '44444444-4444-4444-4444-444444444405',
    '2026-03-25',
    '11111111-1111-1111-1111-111111111112', -- Diana Cárdenas
    'Elaboración de wireframes y diseño de interfaz móvil corporativa.',
    'Diseño UX/UI',
    85,
    'Aprobado formalmente por Negocios.'
),
(
    '77777777-7777-7777-7777-777777777705',
    '22222222-2222-2222-2222-222222222202',
    '44444444-4444-4444-4444-444444444406',
    '2026-05-10',
    '11111111-1111-1111-1111-111111111109', -- Alex
    'Integración biométrica con plugins Flutter e inicio de sesión seguro.',
    'Desarrollo Mobile',
    105,
    'Pruebas exitosas.'
);

-- 10. Insertar Riesgos (project_risks)
insert into project_risks (id, project_id, type, description, impact, probability, assignee_id, date_identified, resolution_date, status, mitigation_action, notes) values
(
    '88888888-8888-8888-8888-888888888801',
    '22222222-2222-2222-2222-222222222201',
    'Riesgo',
    'Posible resistencia al cambio del personal de ventanilla al utilizar la nueva interfaz del Core v4.',
    'Medio',
    'Alta',
    '11111111-1111-1111-1111-111111111106', -- Diana Paredes
    '2026-02-10',
    null,
    'En tratamiento',
    'Realizar jornadas previas de capacitación intensiva práctica y lanzar un programa de embajadores de tecnología en agencias.',
    'Ya se iniciaron las capacitaciones virtuales.'
),
(
    '88888888-8888-8888-8888-888888888802',
    '22222222-2222-2222-2222-222222222201',
    'Dependencia',
    'Dependencia de la entrega del esquema de auditoría por parte del proveedor externo para terminar las APIs de cajas.',
    'Alto',
    'Media',
    '11111111-1111-1111-1111-111111111101', -- Carlos Mendoza
    '2026-06-01',
    null,
    'Abierto',
    'Escalar formalmente la solicitud al gerente del proyecto del proveedor externo con copia a Gerencia General.',
    'Pendiente de entrega de especificaciones.'
),
(
    '88888888-8888-8888-8888-888888888803',
    '22222222-2222-2222-2222-222222222202',
    'Bloqueo',
    'Ausencia de certificados y credenciales de acceso VPN por parte del Banco Central del Ecuador (BCE) para el SPI.',
    'Alto',
    'Alta',
    '11111111-1111-1111-1111-111111111102', -- Sofía Vega
    '2026-06-12',
    null,
    'Abierto',
    'Gerenta de Negocios solicitará una sesión de trabajo de emergencia con la dirección técnica de sistemas del BCE.',
    'Bloqueo crítico que detiene el desarrollo del Sprint 6. Se muestra destacado en color rojo.'
),
(
    '88888888-8888-8888-8888-888888888804',
    '22222222-2222-2222-2222-222222222204',
    'Bloqueo',
    'Falta de firma de convenio comercial con el proveedor de firmas y tokens electrónicos OTP.',
    'Alto',
    'Alta',
    '11111111-1111-1111-1111-111111111107', -- Santiago Paz
    '2026-04-10',
    null,
    'Abierto',
    'Enviar el borrador del convenio legal y económico al Consejo de Administración para aprobación prioritaria en la sesión semanal.',
    'El trámite legal está retrasando el desarrollo del flujo de contratación digital.'
);

-- 11. Insertar Evidencias Simuladas (project_evidence con restricción check)
insert into project_evidence (id, project_id, file_name, file_url, advance_id, activity_id, meeting_id, commitment_id, risk_id, uploaded_by) values
(
    '99999999-9999-9999-9999-999999999901',
    '22222222-2222-2222-2222-222222222201',
    'acta_auditoria_migracion_piloto1.pdf',
    'https://coopac.storage/evidences/acta_auditoria_migracion_piloto1.pdf',
    '33333333-3333-3333-3333-333333333302', -- Vinculado a Avance 2
    null,
    null,
    null,
    null,
    '11111111-1111-1111-1111-111111111101'
),
(
    '99999999-9999-9999-9999-999999999902',
    '22222222-2222-2222-2222-222222222202',
    'figma_prototipo_app_v2',
    'https://figma.com/file/coopac_app_v2',
    '33333333-3333-3333-3333-333333333303', -- Vinculado a Avance 3
    null,
    null,
    null,
    null,
    '11111111-1111-1111-1111-111111111102'
),
(
    '99999999-9999-9999-9999-999999999903',
    '22222222-2222-2222-2222-222222222201',
    'informe_cuadre_saldos_piloto1.pdf',
    'https://coopac.storage/evidences/informe_cuadre_saldos_piloto1.pdf',
    null,
    null,
    null,
    '66666666-6666-6666-6666-666666666601', -- Vinculado a Compromiso 1
    null,
    '11111111-1111-1111-1111-111111111101'
),
(
    '99999999-9999-9999-9999-999999999904',
    '22222222-2222-2222-2222-222222222201',
    'acta_aprobacion_esquema_datos.pdf',
    'https://coopac.storage/evidences/acta_aprobacion_esquema_datos.pdf',
    null,
    null,
    '55555555-5555-5555-5555-555555555501', -- Vinculado a Reunión 1
    null,
    null,
    '11111111-1111-1111-1111-111111111101'
);
