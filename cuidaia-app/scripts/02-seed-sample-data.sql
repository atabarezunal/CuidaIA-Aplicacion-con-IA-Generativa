-- CuidaIA - Datos de ejemplo para desarrollo y pruebas

-- Insertar usuario de ejemplo
INSERT INTO users (id, email, password_hash, first_name, last_name, date_of_birth, phone, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'maria.gonzalez@email.com',
    '$2b$10$example_hash_here', -- En producción, usar bcrypt real
    'María',
    'González',
    '1955-03-15',
    '+52 555 123 4567',
    'Ana González',
    '+52 555 987 6543',
    'Hija'
) ON CONFLICT (email) DO NOTHING;

-- Insertar perfil médico
INSERT INTO medical_profiles (user_id, blood_type, allergies, chronic_conditions, current_medications, medical_notes, primary_doctor_name, primary_doctor_phone, insurance_provider, insurance_number)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'O+',
    'Penicilina, Mariscos',
    'Hipertensión arterial, Diabetes tipo 2',
    'Metformina 500mg, Losartán 50mg',
    'Paciente estable, requiere monitoreo regular de glucosa y presión arterial',
    'Dr. Carlos García',
    '+52 555 234 5678',
    'IMSS',
    '12345678901'
) ON CONFLICT DO NOTHING;

-- Insertar medicamentos
INSERT INTO medications (user_id, name, dosage, frequency, instructions, start_date, is_active)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Metformina', '500mg', 'Cada 12 horas', 'Tomar con alimentos', '2024-01-01', true),
    ('550e8400-e29b-41d4-a716-446655440000', 'Losartán', '50mg', 'Una vez al día', 'Tomar en la mañana', '2024-01-01', true),
    ('550e8400-e29b-41d4-a716-446655440000', 'Aspirina', '100mg', 'Una vez al día', 'Tomar después del desayuno', '2024-01-01', true)
ON CONFLICT DO NOTHING;

-- Insertar recordatorios
INSERT INTO reminders (user_id, medication_id, title, description, reminder_type, scheduled_time, scheduled_days, is_active)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000',
    m.id,
    'Tomar ' || m.name,
    'Recordatorio para tomar ' || m.name || ' - ' || m.dosage,
    'medication',
    '08:00:00',
    'daily',
    true
FROM medications m 
WHERE m.user_id = '550e8400-e29b-41d4-a716-446655440000' AND m.name = 'Metformina'
ON CONFLICT DO NOTHING;

INSERT INTO reminders (user_id, title, description, reminder_type, scheduled_time, scheduled_days, is_active)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Cita con Dr. García', 'Consulta de seguimiento - Cardiología', 'appointment', '16:30:00', 'friday', true),
    ('550e8400-e29b-41d4-a716-446655440000', 'Llamar a María', 'Llamada semanal con la nieta', 'social', '18:00:00', 'sunday', true),
    ('550e8400-e29b-41d4-a716-446655440000', 'Ejercicio matutino', 'Caminata de 15 minutos', 'exercise', '07:00:00', 'daily', true)
ON CONFLICT DO NOTHING;

-- Insertar métricas de salud de ejemplo
INSERT INTO health_metrics (user_id, metric_type, value, unit, notes)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'blood_pressure', '120/80', 'mmHg', 'Presión normal'),
    ('550e8400-e29b-41d4-a716-446655440000', 'heart_rate', '72', 'bpm', 'Frecuencia cardíaca normal'),
    ('550e8400-e29b-41d4-a716-446655440000', 'weight', '68.5', 'kg', 'Peso estable'),
    ('550e8400-e29b-41d4-a716-446655440000', 'mood', 'Positivo', '', 'Estado de ánimo bueno'),
    ('550e8400-e29b-41d4-a716-446655440000', 'glucose', '110', 'mg/dL', 'Glucosa en ayunas normal')
ON CONFLICT DO NOTHING;

-- Insertar citas médicas
INSERT INTO appointments (user_id, doctor_name, specialty, appointment_date, appointment_time, location, notes, status)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Dr. Carlos García', 'Cardiología', '2024-12-20', '16:30:00', 'Hospital General - Consultorio 205', 'Revisión mensual de presión arterial', 'scheduled'),
    ('550e8400-e29b-41d4-a716-446655440000', 'Dra. Ana Martínez', 'Endocrinología', '2024-12-25', '10:00:00', 'Clínica Diabetes - Piso 3', 'Control de diabetes', 'scheduled')
ON CONFLICT DO NOTHING;

-- Insertar contactos de emergencia adicionales
INSERT INTO emergency_contacts (user_id, name, phone, relationship, is_primary, notes)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Ana González', '+52 555 987 6543', 'Hija', true, 'Contacto principal - Vive cerca'),
    ('550e8400-e29b-41d4-a716-446655440000', 'Dr. Carlos García', '+52 555 234 5678', 'Médico', false, 'Cardiólogo de cabecera'),
    ('550e8400-e29b-41d4-a716-446655440000', 'Farmacia San José', '+52 555 456 7890', 'Farmacia', false, 'Farmacia de confianza - Entrega a domicilio'),
    ('550e8400-e29b-41d4-a716-446655440000', 'Pedro González', '+52 555 111 2222', 'Hijo', false, 'Contacto secundario')
ON CONFLICT DO NOTHING;

-- Insertar configuraciones de usuario
INSERT INTO user_settings (user_id, notification_preferences, language, timezone, font_size, high_contrast)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    '{"email": true, "sms": true, "push": true, "medication_reminders": true, "appointment_reminders": true}',
    'es',
    'America/Mexico_City',
    'large',
    false
) ON CONFLICT DO NOTHING;

-- Insertar algunas conversaciones de ejemplo
INSERT INTO ai_conversations (user_id, message, response, conversation_type)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', '¿Cómo me siento hoy?', 'Me alegra que preguntes. Basándome en tus métricas recientes, tu presión arterial y frecuencia cardíaca están en rangos normales. ¿Hay algo específico que te preocupe sobre cómo te sientes?', 'health'),
    ('550e8400-e29b-41d4-a716-446655440000', 'Recordar tomar medicamento', 'Por supuesto, María. Tienes programado tomar Metformina 500mg cada 12 horas. Tu próxima dosis es a las 8:00 PM. ¿Te gustaría que configure un recordatorio adicional?', 'medication'),
    ('550e8400-e29b-41d4-a716-446655440000', '¿Qué ejercicios puedo hacer?', 'Excelente pregunta. Considerando tu condición de hipertensión, te recomiendo caminatas suaves de 15-20 minutos, ejercicios de respiración y estiramientos ligeros. Siempre consulta con el Dr. García antes de iniciar nuevas rutinas.', 'health')
ON CONFLICT DO NOTHING;
