-- Creación de base de datos para CuidaIA
-- Sistema de gestión para adultos mayores con IA

-- Tabla de usuarios (adultos mayores)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    birth_date DATE,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    medical_conditions TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de medicamentos
CREATE TABLE IF NOT EXISTS medications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    frequency VARCHAR(50), -- 'daily', 'twice_daily', 'weekly', etc.
    times TIME[], -- Array de horarios específicos
    start_date DATE,
    end_date DATE,
    notes TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de recordatorios médicos
CREATE TABLE IF NOT EXISTS medical_reminders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    medication_id INTEGER REFERENCES medications(id) ON DELETE CASCADE,
    reminder_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'missed'
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de citas médicas
CREATE TABLE IF NOT EXISTS medical_appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    doctor_name VARCHAR(100),
    specialty VARCHAR(100),
    appointment_date TIMESTAMP,
    location VARCHAR(200),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de métricas de salud
CREATE TABLE IF NOT EXISTS health_metrics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    metric_type VARCHAR(50), -- 'blood_pressure', 'heart_rate', 'weight', 'mood'
    value VARCHAR(50),
    unit VARCHAR(20),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Tabla de conversaciones con IA
CREATE TABLE IF NOT EXISTS ai_conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    conversation_type VARCHAR(50), -- 'health', 'companionship', 'reminder', 'emergency'
    sentiment_score DECIMAL(3,2), -- -1.0 a 1.0 para análisis de sentimiento
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de contactos de emergencia
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_medications_user_active ON medications(user_id, active);
CREATE INDEX IF NOT EXISTS idx_reminders_user_time ON medical_reminders(user_id, reminder_time);
CREATE INDEX IF NOT EXISTS idx_appointments_user_date ON medical_appointments(user_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_type ON health_metrics(user_id, metric_type);
CREATE INDEX IF NOT EXISTS idx_conversations_user_date ON ai_conversations(user_id, created_at);

-- Insertar datos de ejemplo
INSERT INTO users (name, email, phone, birth_date, emergency_contact_name, emergency_contact_phone, medical_conditions) 
VALUES (
    'María González',
    'maria.gonzalez@email.com',
    '+34 612 345 678',
    '1955-03-15',
    'Ana González (Hija)',
    '+34 687 654 321',
    ARRAY['Hipertensión', 'Diabetes Tipo 2']
) ON CONFLICT (email) DO NOTHING;

-- Insertar medicamentos de ejemplo
INSERT INTO medications (user_id, name, dosage, frequency, times, start_date, notes)
VALUES 
    (1, 'Enalapril', '10mg', 'twice_daily', ARRAY['08:00:00', '20:00:00'], '2024-01-01', 'Para la presión arterial'),
    (1, 'Metformina', '500mg', 'twice_daily', ARRAY['09:00:00', '21:00:00'], '2024-01-01', 'Para la diabetes'),
    (1, 'Aspirina', '100mg', 'daily', ARRAY['08:00:00'], '2024-01-01', 'Cardioprotector');

-- Insertar citas médicas de ejemplo
INSERT INTO medical_appointments (user_id, doctor_name, specialty, appointment_date, location, notes)
VALUES 
    (1, 'Dr. García', 'Cardiología', '2024-12-20 16:30:00', 'Hospital Central - Consulta 205', 'Revisión trimestral'),
    (1, 'Dra. Martínez', 'Endocrinología', '2024-12-28 10:00:00', 'Clínica San José', 'Control de diabetes');

-- Insertar contactos de emergencia
INSERT INTO emergency_contacts (user_id, name, relationship, phone, email, is_primary)
VALUES 
    (1, 'Ana González', 'Hija', '+34 687 654 321', 'ana.gonzalez@email.com', true),
    (1, 'Carlos González', 'Hijo', '+34 698 765 432', 'carlos.gonzalez@email.com', false),
    (1, 'Dr. García', 'Médico de cabecera', '+34 915 123 456', 'dr.garcia@hospital.com', false);
