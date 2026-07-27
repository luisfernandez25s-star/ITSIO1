-- ============================================================
-- ITSIO - Sistema de Gestion Operativa de Bomberos
-- Esquema de base de datos (PostgreSQL)
-- ============================================================
-- Ejecutar con:  psql "$DATABASE_URL" -f database/schema.sql
-- ============================================================

-- Limpieza (orden inverso por dependencias)
DROP TABLE IF EXISTS incident_notes CASCADE;
DROP TABLE IF EXISTS incident_units CASCADE;
DROP TABLE IF EXISTS incident_personnel CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS dispatch_queue CASCADE;
DROP TABLE IF EXISTS course_attendees CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS fuel_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS personnel CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS vehicle_types CASCADE;

-- ============================================================
-- CATALOGO: Tipos de vehiculo
-- ============================================================
CREATE TABLE vehicle_types (
    id          SERIAL PRIMARY KEY,
    type        TEXT NOT NULL UNIQUE,          -- Motobomba, Escala, Rapida, Sedan, Pipa-Motobomba
    img         TEXT NOT NULL                  -- nombre base de la imagen
);

-- ============================================================
-- Vehiculos / Flota
-- ============================================================
CREATE TABLE vehicles (
    id           SERIAL PRIMARY KEY,
    number_unit  TEXT NOT NULL UNIQUE,         -- "37", "67", ...
    type         TEXT NOT NULL REFERENCES vehicle_types(type),
    img          TEXT,
    status       TEXT NOT NULL DEFAULT 'operativa'
                 CHECK (status IN ('operativa','in-operativa','taller')),
    model        TEXT,
    car_brand    TEXT,
    placas       TEXT,
    kilometraje  INTEGER DEFAULT 0,
    created_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_vehicles_type   ON vehicles(type);
CREATE INDEX idx_vehicles_status ON vehicles(status);

-- ============================================================
-- Personal (fuerza de estado)
-- ============================================================
CREATE TABLE personnel (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    rank          TEXT NOT NULL,               -- Capitan, Teniente, Bombero
    guard         CHAR(1) NOT NULL CHECK (guard IN ('A','B','C','D')),
    initials      TEXT,
    avatar_color  TEXT,
    hours_training INTEGER DEFAULT 0,
    -- matriz de habilidades 0-5
    skill_combate_incendio SMALLINT DEFAULT 0,
    skill_rescate          SMALLINT DEFAULT 0,
    skill_hazmat           SMALLINT DEFAULT 0,
    skill_medica           SMALLINT DEFAULT 0,
    skill_conduccion       SMALLINT DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_personnel_guard ON personnel(guard);

-- ============================================================
-- Certificaciones
-- ============================================================
CREATE TABLE certifications (
    id              SERIAL PRIMARY KEY,
    personnel_id    INTEGER NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    category        TEXT,                      -- obligatorio, especialidad, complementario / medica, etc
    status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','expiring','expired')),
    issued_date     DATE,
    expiry_date     DATE,
    institution     TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_cert_personnel ON certifications(personnel_id);
CREATE INDEX idx_cert_status    ON certifications(status);

-- ============================================================
-- Cursos / Capacitacion
-- ============================================================
CREATE TABLE courses (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    type            TEXT NOT NULL DEFAULT 'curso'  -- curso, practica, simulacro
                    CHECK (type IN ('curso','practica','simulacro')),
    scheduled_date  TIMESTAMPTZ,
    duration_hours  INTEGER DEFAULT 0,
    instructor      TEXT,
    max_capacity    INTEGER DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'programado'
                    CHECK (status IN ('programado','en_curso','completado','cancelado')),
    location        TEXT
);

CREATE TABLE course_attendees (
    course_id    INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    personnel_id INTEGER NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, personnel_id)
);

-- ============================================================
-- Incidentes
-- ============================================================
CREATE TABLE incidents (
    id            SERIAL PRIMARY KEY,
    type          TEXT NOT NULL,               -- incendio, rescate, emergencia_medica, hazmat, servicio
    subtype       TEXT,
    priority      TEXT NOT NULL DEFAULT 'media' CHECK (priority IN ('alta','media','baja')),
    status        TEXT NOT NULL DEFAULT 'activo'
                  CHECK (status IN ('activo','en_ruta','atendiendo','cerrado')),
    address       TEXT,
    lat           DOUBLE PRECISION,
    lng           DOUBLE PRECISION,
    reported_at   TIMESTAMPTZ DEFAULT now(),
    dispatched_at TIMESTAMPTZ,
    arrived_at    TIMESTAMPTZ,
    closed_at     TIMESTAMPTZ,
    description   TEXT,
    water_used    INTEGER DEFAULT 0,
    foam_used     INTEGER DEFAULT 0,
    equipment_used TEXT[],                      -- arreglo de strings
    response_time INTEGER                       -- minutos
);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_type   ON incidents(type);

-- Unidades asignadas a un incidente (por numero de unidad)
CREATE TABLE incident_units (
    incident_id  INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    unit_label   TEXT NOT NULL,                -- "U-37"
    PRIMARY KEY (incident_id, unit_label)
);

-- Personal asignado a un incidente
CREATE TABLE incident_personnel (
    incident_id  INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    personnel_id INTEGER NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
    PRIMARY KEY (incident_id, personnel_id)
);

-- Notas / bitacora de un incidente
CREATE TABLE incident_notes (
    id           SERIAL PRIMARY KEY,
    incident_id  INTEGER NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    note_time    TIMESTAMPTZ DEFAULT now(),
    author       TEXT,
    text         TEXT NOT NULL
);
CREATE INDEX idx_inotes_incident ON incident_notes(incident_id);

-- ============================================================
-- Cola de despacho
-- ============================================================
CREATE TABLE dispatch_queue (
    id           SERIAL PRIMARY KEY,
    incident_id  INTEGER REFERENCES incidents(id) ON DELETE SET NULL,
    priority     TEXT NOT NULL DEFAULT 'media' CHECK (priority IN ('alta','media','baja')),
    location     TEXT,
    type         TEXT,
    received_at  TIMESTAMPTZ DEFAULT now(),
    status       TEXT NOT NULL DEFAULT 'pendiente'
                 CHECK (status IN ('pendiente','asignado','en_ruta')),
    caller       TEXT,
    phone        TEXT
);

-- ============================================================
-- Bitacora de combustible
-- ============================================================
CREATE TABLE fuel_logs (
    id          SERIAL PRIMARY KEY,
    unit        TEXT NOT NULL,                 -- numero de unidad
    log_date    TIMESTAMPTZ DEFAULT now(),
    liters      NUMERIC(10,2) NOT NULL,
    cost        NUMERIC(12,2) NOT NULL,
    km          INTEGER,
    operator    TEXT
);
CREATE INDEX idx_fuel_unit ON fuel_logs(unit);

-- ============================================================
-- Notificaciones
-- ============================================================
CREATE TABLE notifications (
    id                SERIAL PRIMARY KEY,
    type              TEXT NOT NULL,           -- mantenimiento, certificacion, guardia, inventario, sistema, incidente
    priority          TEXT NOT NULL DEFAULT 'normal'
                      CHECK (priority IN ('critica','alta','normal','baja')),
    title             TEXT NOT NULL,
    message           TEXT,
    related_entity_type TEXT,
    related_entity_id   TEXT,
    action_url        TEXT,
    created_at        TIMESTAMPTZ DEFAULT now(),
    read_at           TIMESTAMPTZ
);
CREATE INDEX idx_notif_read ON notifications(read_at);
