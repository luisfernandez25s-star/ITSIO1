-- ============================================================
-- ITSIO - Datos de ejemplo (seed)
-- Ejecutar DESPUES de schema.sql:
--   psql "$DATABASE_URL" -f database/seed.sql
-- ============================================================

-- Limpia datos previos (respeta dependencias)
TRUNCATE incident_notes, incident_units, incident_personnel, incidents,
         dispatch_queue, course_attendees, courses, certifications,
         fuel_logs, notifications, personnel, vehicles, vehicle_types
         RESTART IDENTITY CASCADE;

-- ------------------------------------------------------------
-- Tipos de vehiculo
-- ------------------------------------------------------------
INSERT INTO vehicle_types (type, img) VALUES
  ('Motobomba', 'motobomba'),
  ('Escala', 'escala'),
  ('Rapida', 'pick-up'),
  ('Sedan', 'sedan'),
  ('Pipa-Motobomba', 'pipa-motobomba');

-- ------------------------------------------------------------
-- Vehiculos
-- ------------------------------------------------------------
INSERT INTO vehicles (number_unit, type, img, status, model, car_brand, placas, kilometraje) VALUES
  ('67', 'Motobomba', 'motobomba',          'operativa',    'dumie', 'Ford',       'biuuiu',    180408),
  ('66', 'Motobomba', 'motobomba',          'operativa',    'dumie', 'Ford',       'biuuiu',    175300),
  ('65', 'Escala',    'escala',             'operativa',    'dumie', 'Ford',       'biuuiu',    180408),
  ('69', 'Escala',    'escala',             'in-operativa', 'dumie', 'Ford',       'biuuiu',    180408),
  ('72', 'Escala',    'escala',             'in-operativa', 'dumie', 'Ford',       'biuuiu',    180408),
  ('78', 'Rapida',    'reaction/u78/u-78right', 'taller',   '2024',  'Cheyene',    'CFL-124-M', 5200),
  ('37', 'Rapida',    'reaction/u37/u-37right', 'operativa','2014',  'Mitsubishi', 'biuuiu',    49850),
  ('14', 'Rapida',    'reaction/dumie',     'operativa',    'dumie', 'Ford',       'biuuiu',    180408),
  ('28', 'Rapida',    'reaction/dumie',     'operativa',    'dumie', 'Ford',       'biuuiu',    62400),
  ('45', 'Rapida',    'reaction/dumie',     'in-operativa', 'dumie', 'Ford',       'biuuiu',    180408),
  ('56', 'Sedan',     'pick-up',            'in-operativa', 'dumie', 'Ford',       'biuuiu',    180408);

-- ------------------------------------------------------------
-- Personal (con matriz de habilidades y horas de capacitacion)
-- ------------------------------------------------------------
INSERT INTO personnel (name, rank, guard, initials, avatar_color, hours_training,
                       skill_combate_incendio, skill_rescate, skill_hazmat, skill_medica, skill_conduccion) VALUES
  ('Cap. Jorge Garcia',     'Capitan',  'A', 'JG', '#dc2626', 240, 5,4,3,4,4),
  ('Tte. Roberto Sanchez',  'Teniente', 'A', 'RS', '#2563eb', 180, 4,5,4,3,5),
  ('Bro. Carlos Mendez',    'Bombero',  'B', 'CM', '#16a34a', 120, 3,4,2,4,3),
  ('Bro. Luis Hernandez',   'Bombero',  'B', 'LH', '#9333ea', 90,  2,3,1,2,3),
  ('Bro. Pedro Ramirez',    'Bombero',  'C', 'PR', '#ea580c', 150, 4,5,3,3,4),
  ('Bro. Ana Lopez',        'Bombero',  'C', 'AL', '#0891b2', 110, 3,3,2,4,3),
  ('Bro. Miguel Torres',    'Bombero',  'D', 'MT', '#4f46e5', 100, 3,3,2,3,3),
  ('Bro. Sofia Ruiz',       'Bombero',  'D', 'SR', '#be185d', 80,  2,2,1,3,2),
  ('Tte. Andres Molina',    'Teniente', 'A', 'AM', '#0d9488', 160, 4,4,3,3,4),
  ('Bro. Ivan Reyes',       'Bombero',  'A', 'IR', '#65a30d', 95,  3,3,2,3,3),
  ('Bro. Gabriel Moreno',   'Bombero',  'B', 'GM', '#c026d3', 130, 3,4,2,3,4),
  ('Bro. Hector Vargas',    'Bombero',  'B', 'HV', '#0284c7', 105, 3,3,2,3,3),
  ('Bro. Eduardo Diaz',     'Bombero',  'C', 'ED', '#d97706', 125, 3,4,3,3,4),
  ('Bro. Fernando Castro',  'Bombero',  'C', 'FC', '#7c3aed', 100, 3,3,2,3,3),
  ('Bro. Leonardo Ruiz',    'Bombero',  'D', 'LR', '#059669', 90,  2,3,2,3,3),
  ('Bro. Manuel Santos',    'Bombero',  'D', 'MS', '#dc2626', 115, 3,3,2,3,4);

-- ------------------------------------------------------------
-- Certificaciones
-- ------------------------------------------------------------
INSERT INTO certifications (personnel_id, name, category, status, issued_date, expiry_date, institution) VALUES
  (1, 'Primeros Auxilios Avanzados',          'obligatorio',   'active',   '2024-03-15', '2026-03-15', 'Cruz Roja Mexicana'),
  (1, 'Combate de Incendios Estructurales',   'obligatorio',   'active',   '2023-08-20', '2025-08-20', 'Academia de Bomberos'),
  (1, 'Manejo de Materiales Peligrosos',      'especialidad',  'expiring', '2024-01-10', '2026-07-10', 'CENAPRED'),
  (1, 'Rescate Vehicular',                    'especialidad',  'active',   '2024-01-25', '2026-07-15', 'Academia de Bomberos'),
  (2, 'Primeros Auxilios Basicos',            'obligatorio',   'active',   '2023-11-15', '2025-11-15', 'Cruz Roja Mexicana'),
  (2, 'HAZMAT Nivel Operaciones',             'especialidad',  'expired',  '2022-05-10', '2024-05-10', 'CENAPRED'),
  (2, 'Rescate en Alturas',                   'especialidad',  'active',   '2024-06-01', '2026-06-01', 'STPS'),
  (3, 'Combate de Incendios',                 'obligatorio',   'expiring', '2023-07-20', '2026-07-05', 'Academia de Bomberos'),
  (3, 'Primeros Auxilios',                    'obligatorio',   'active',   '2024-02-10', '2026-02-10', 'Cruz Roja Mexicana'),
  (4, 'Conduccion de Emergencia',             'complementario','expired',  '2022-09-01', '2024-09-01', 'Secretaria de Movilidad'),
  (5, 'Rescate en Alturas',                   'especialidad',  'active',   '2024-06-01', '2026-06-01', 'STPS'),
  (6, 'Primeros Auxilios Basicos',            'obligatorio',   'expiring', '2023-11-15', '2026-06-30', 'Cruz Roja Mexicana'),
  (7, 'Uso de SCBA',                          'obligatorio',   'active',   '2023-09-10', '2025-09-10', 'Academia de Bomberos'),
  (8, 'Combate de Incendios Basico',          'obligatorio',   'expired',  '2022-03-15', '2024-03-15', 'Academia de Bomberos');

-- ------------------------------------------------------------
-- Cursos
-- ------------------------------------------------------------
INSERT INTO courses (title, type, scheduled_date, duration_hours, instructor, max_capacity, status, location) VALUES
  ('Actualizacion en Rescate Vehicular',  'curso',    now() + interval '3 days',  16, 'Instructor Ext. Manuel Vega', 12, 'programado', 'Estacion Central'),
  ('Simulacro de Incendio Estructural',   'simulacro',now() + interval '7 days',  4,  'Cap. Jorge Garcia',           20, 'programado', 'Campo de Practicas Norte'),
  ('Mantenimiento de Equipo Hidraulico',  'practica', now() - interval '2 days',  8,  'Tte. Roberto Sanchez',        8,  'completado', 'Taller de Equipo'),
  ('Curso HAZMAT Nivel Operaciones',      'curso',    now() + interval '14 days', 40, 'CENAPRED',                    10, 'programado', 'Centro de Capacitacion CENAPRED'),
  ('Practica de Conduccion de Emergencia','practica', now(),                      6,  'Tte. Roberto Sanchez',        6,  'en_curso',   'Circuito de Practicas');

INSERT INTO course_attendees (course_id, personnel_id) VALUES
  (1,1),(1,2),(1,3),(1,5),
  (2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),
  (3,3),(3,4),(3,6),
  (4,2),(4,5),
  (5,4),(5,7),(5,8);

-- ------------------------------------------------------------
-- Incidentes
-- ------------------------------------------------------------
INSERT INTO incidents (type, subtype, priority, status, address, lat, lng,
                       reported_at, dispatched_at, arrived_at, closed_at,
                       description, water_used, foam_used, equipment_used, response_time) VALUES
  ('incendio','estructural','alta','cerrado',
   'Av. Revolucion 1234, Col. Centro', 19.4326, -99.1332,
   now() - interval '2 hours', now() - interval '117 minutes', now() - interval '112 minutes', now() - interval '30 minutes',
   'Incendio en bodega de productos quimicos. Se reporta humo negro visible.',
   8500, 200, ARRAY['Escalera','Hacha','Mangueras 2.5"'], 8),
  ('rescate','vehicular','alta','atendiendo',
   'Periferico Sur km 15.5', 19.3034, -99.1954,
   now() - interval '25 minutes', now() - interval '23 minutes', now() - interval '15 minutes', NULL,
   'Colision multiple. 2 vehiculos involucrados, persona atrapada.',
   0, 0, ARRAY['Equipo Hidraulico','Camilla','Collarin'], 10),
  ('emergencia_medica','paro_cardiaco','alta','en_ruta',
   'Plaza Comercial Norte, Local 45', 19.4523, -99.0876,
   now() - interval '5 minutes', now() - interval '4 minutes', NULL, NULL,
   'Hombre de aproximadamente 60 anios con posible paro cardiaco.',
   0, 0, ARRAY['DEA','Equipo de RCP'], NULL),
  ('hazmat','derrame','media','cerrado',
   'Zona Industrial Vallejo, Nave 8', 19.4856, -99.1432,
   now() - interval '24 hours', now() - interval '1435 minutes', now() - interval '1428 minutes', now() - interval '20 hours',
   'Derrame de solvente industrial. Area acordonada por PROFEPA.',
   500, 0, ARRAY['Traje HAZMAT','Kit de contencion','Detector de gases'], 12),
  ('servicio','retiro_enjambre','baja','activo',
   'Escuela Primaria Benito Juarez', 19.3987, -99.1654,
   now() - interval '45 minutes', now() - interval '40 minutes', now() - interval '30 minutes', NULL,
   'Enjambre de abejas en area de juegos infantiles.',
   0, 0, ARRAY['Traje apicultor','Fumigador'], 15),
  ('incendio','vehicular','media','cerrado',
   'Estacionamiento Centro Comercial Sur', 19.3234, -99.1876,
   now() - interval '48 hours', now() - interval '2878 minutes', now() - interval '2873 minutes', now() - interval '47 hours',
   'Vehiculo sedan en llamas. Sin personas en el interior.',
   1200, 50, ARRAY['Mangueras 1.5"','Extintor PQS'], 7);

INSERT INTO incident_units (incident_id, unit_label) VALUES
  (1,'U-37'),(1,'U-67'),
  (2,'U-78'),(2,'U-14'),
  (3,'U-28'),
  (4,'U-67'),(4,'U-66'),
  (5,'U-45'),
  (6,'U-37');

INSERT INTO incident_personnel (incident_id, personnel_id) VALUES
  (1,1),(1,2),(1,5),(1,8),(1,12),
  (2,3),(2,6),(2,9),(2,11),
  (3,4),(3,7),
  (4,1),(4,2),(4,3),(4,5),(4,8),(4,10),
  (5,13),(5,14),
  (6,1),(6,5);

INSERT INTO incident_notes (incident_id, note_time, author, text) VALUES
  (1, now() - interval '90 minutes', 'TTE. Sanchez', 'Fuego controlado en primer nivel.'),
  (1, now() - interval '60 minutes', 'CAP. Garcia',  'Liquidacion completada. Sin victimas.'),
  (2, now() - interval '10 minutes', 'BRO. Mendez',  'Iniciando corte con equipo hidraulico.'),
  (4, now() - interval '22 hours',   'CAP. Garcia',  'Material identificado como acetona. Aplicando protocolo HAZMAT.'),
  (4, now() - interval '21 hours',   'TTE. Sanchez', 'Contencion completada. Entrega a empresa especializada.'),
  (5, now() - interval '25 minutes', 'BRO. Lopez',   'Area evacuada. Iniciando procedimiento de retiro.'),
  (6, now() - interval '47 hours',   'BRO. Ramirez', 'Incendio controlado en 10 minutos.');

-- ------------------------------------------------------------
-- Cola de despacho
-- ------------------------------------------------------------
INSERT INTO dispatch_queue (incident_id, priority, location, type, received_at, status, caller, phone) VALUES
  (3, 'alta', 'Plaza Comercial Norte, Local 45', 'emergencia_medica', now() - interval '5 minutes',  'asignado', 'Guardia de seguridad', '55-1234-5678'),
  (2, 'alta', 'Periferico Sur km 15.5',          'rescate',           now() - interval '25 minutes', 'asignado', 'Ciudadano',            '55-8765-4321'),
  (5, 'baja', 'Escuela Primaria Benito Juarez',  'servicio',          now() - interval '45 minutes', 'asignado', 'Director escolar',     '55-2468-1357');

-- ------------------------------------------------------------
-- Bitacora de combustible
-- ------------------------------------------------------------
INSERT INTO fuel_logs (unit, log_date, liters, cost, km, operator) VALUES
  ('37', now() - interval '1 day',  85,  2030.65, 49850,  'Bro. Carlos Mendez'),
  ('67', now() - interval '2 days', 180, 4347.00, 180500, 'Tte. Roberto Sanchez'),
  ('78', now() - interval '3 days', 75,  1791.75, 5200,   'Bro. Pedro Ramirez'),
  ('66', now() - interval '4 days', 165, 3984.75, 175300, 'Cap. Jorge Garcia'),
  ('37', now() - interval '7 days', 90,  2137.50, 49500,  'Bro. Carlos Mendez'),
  ('28', now() - interval '5 days', 70,  1672.30, 62400,  'Bro. Ana Lopez');

-- ------------------------------------------------------------
-- Notificaciones
-- ------------------------------------------------------------
INSERT INTO notifications (type, priority, title, message, related_entity_type, related_entity_id, action_url, created_at, read_at) VALUES
  ('mantenimiento','alta',   'Mantenimiento Programado U-37','La unidad U-37 requiere servicio de 50,000 km. Kilometraje actual: 49,850 km.','vehicle','37','/type-vehicle/description-u/37', now() - interval '30 minutes', NULL),
  ('certificacion','critica','Certificacion por Vencer','La certificacion "Primeros Auxilios Avanzados" del Bombero Carlos Mendez vence en 7 dias.','personnel','5','/training', now() - interval '2 hours', NULL),
  ('guardia','normal',       'Cambio de Guardia','El cambio de guardia A a guardia B sera en 4 horas (06:00 hrs).','shift','B','/', now() - interval '4 hours', now() - interval '3 hours'),
  ('inventario','alta',      'Stock Bajo - Mangueras','El inventario de mangueras de 2.5" esta por debajo del minimo requerido (3 unidades restantes).','tool','mangueras','/tools', now() - interval '6 hours', NULL),
  ('sistema','baja',         'Actualizacion del Sistema','Nueva version de ITSIO disponible (v1.2.0). Nuevas funciones de despacho incluidas.','system','update', NULL, now() - interval '24 hours', now() - interval '12 hours'),
  ('mantenimiento','normal', 'Verificacion de Equipo U-67','Recordatorio: Realizar verificacion mensual de bomba en unidad U-67.','vehicle','67','/type-vehicle/description-u/67', now() - interval '48 hours', NULL),
  ('certificacion','alta',   'Recertificacion Requerida','El Teniente Roberto Sanchez debe recertificarse en manejo de materiales peligrosos.','personnel','2','/training', now() - interval '72 hours', NULL),
  ('incidente','baja',       'Reporte Pendiente','El incidente #1247 requiere completar el reporte final.','incident','1247','/incidents', now() - interval '96 hours', now() - interval '90 hours');
