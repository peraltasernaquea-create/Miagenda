import { CourseClass, CourseNote, CourseTask } from '../types';
import { getRelativeDateISO, getTodayISO } from '../utils/dateUtils';

export function buildInitialClasses(): CourseClass[] {
  const today = getTodayISO();
  return [
    {
      id: 'cls-1',
      title: 'Introducción a Google AI Studio y modelos Gemini',
      module: 'Fundamentos de AI Studio',
      date: getRelativeDateISO(-2, today),
      time: '18:00',
      durationMinutes: 60,
      modality: 'Clase en vivo · Sala 1',
      notes: 'Configuración del espacio de trabajo, creación de claves API y prueba inicial con Gemini 2.5 Flash.',
    },
    {
      id: 'cls-2',
      title: 'System Instructions y parámetros de generación',
      module: 'Ingeniería de Prompts',
      date: today,
      time: '18:30',
      durationMinutes: 75,
      modality: 'Clase en vivo · Sala 1',
      notes: 'Cómo controlar el tono y la precisión usando instrucciones de sistema, temperatura y límite de tokens.',
    },
    {
      id: 'cls-3',
      title: 'Salidas estructuradas con JSON Schema',
      module: 'Salida Estructurada',
      date: getRelativeDateISO(1, today),
      time: '19:00',
      durationMinutes: 60,
      modality: 'Taller práctico',
      notes: 'Definición de esquemas con responseSchema para recibir respuestas predecibles en aplicaciones web.',
    },
    {
      id: 'cls-4',
      title: 'Integración de herramientas con Function Calling',
      module: 'Function Calling',
      date: getRelativeDateISO(3, today),
      time: '18:30',
      durationMinutes: 90,
      modality: 'Clase en vivo · Sala 2',
      notes: 'Declaración de funciones externas para consultar inventarios, calendarios o bases de datos.',
    },
    {
      id: 'cls-5',
      title: 'Procesamiento multimodal: imágenes, PDF y audio',
      module: 'Multimodalidad y Audio',
      date: getRelativeDateISO(5, today),
      time: '10:00',
      durationMinutes: 90,
      modality: 'Sesión grabada + tutoría',
      notes: 'Envío de archivos adjuntos al modelo para extraer tablas, resumir documentos y analizar notas de voz.',
    },
  ];
}

export function buildInitialTasks(): CourseTask[] {
  const today = getTodayISO();
  return [
    {
      id: 'tsk-1',
      title: 'Crear cuenta y generar primera clave API',
      description: 'Ingresar a Google AI Studio, crear un proyecto de prueba y verificar la cuota gratuita disponible.',
      dueDate: getRelativeDateISO(-2, today),
      module: 'Fundamentos de AI Studio',
      status: 'completada',
      priority: 'alta',
    },
    {
      id: 'tsk-2',
      title: 'Diseñar 3 prompts con ejemplos few-shot',
      description: 'Redactar un prompt para clasificar correos de soporte con al menos 3 ejemplos de entrada y salida esperada.',
      dueDate: getRelativeDateISO(-1, today),
      module: 'Ingeniería de Prompts',
      status: 'completada',
      priority: 'media',
    },
    {
      id: 'tsk-3',
      title: 'Ajustar System Instructions para tutor de estudio',
      description: 'Probar en el panel de Google AI Studio cómo cambia la respuesta al definir reglas estrictas de formato y tono.',
      dueDate: today,
      module: 'Ingeniería de Prompts',
      status: 'pendiente',
      priority: 'alta',
    },
    {
      id: 'tsk-4',
      title: 'Definir esquema JSON para ficha de productos',
      description: 'Configurar Structured Outputs para devolver nombre, categoría, precio y lista de características sin texto extra.',
      dueDate: getRelativeDateISO(1, today),
      module: 'Salida Estructurada',
      status: 'pendiente',
      priority: 'alta',
    },
    {
      id: 'tsk-5',
      title: 'Exportar código TypeScript con el SDK @google/genai',
      description: 'Usar el botón "Get code" de AI Studio y probar la llamada desde un script local de Node.js.',
      dueDate: getRelativeDateISO(2, today),
      module: 'Fundamentos de AI Studio',
      status: 'pendiente',
      priority: 'media',
    },
    {
      id: 'tsk-6',
      title: 'Implementar función simulada de consulta de clima',
      description: 'Declarar una herramienta getWeather con parámetros de ciudad y unidad, y manejar la respuesta del modelo.',
      dueDate: getRelativeDateISO(4, today),
      module: 'Function Calling',
      status: 'pendiente',
      priority: 'media',
    },
    {
      id: 'tsk-7',
      title: 'Extraer datos de un recibo en imagen',
      description: 'Subir una fotografía de prueba en AI Studio y validar que el modelo identifique fecha, comercio y total.',
      dueDate: getRelativeDateISO(6, today),
      module: 'Multimodalidad y Audio',
      status: 'pendiente',
      priority: 'baja',
    },
    {
      id: 'tsk-8',
      title: 'Repasar buenas prácticas de seguridad de claves',
      description: 'Revisar la guía del curso sobre cómo guardar GEMINI_API_KEY en variables de entorno del servidor.',
      dueDate: getRelativeDateISO(-3, today),
      module: 'Fundamentos de AI Studio',
      status: 'completada',
      priority: 'baja',
    },
  ];
}

export function buildInitialNotes(): CourseNote[] {
  const today = getTodayISO();
  return [
    {
      id: 'not-1',
      title: 'Diferencia entre Temperature, Top-K y Top-P',
      topic: 'Ingeniería de Prompts',
      content:
        '• Temperature baja (0.0 - 0.3): respuestas más deterministas y precisas, ideal para extracción de datos o clasificación.\n• Temperature media/alta (0.7 - 1.0): mayor variedad y creatividad en redacción.\n• Consejo de clase: empezar modificando solo Temperature antes de tocar Top-P.',
      updatedAt: today,
    },
    {
      id: 'not-2',
      title: 'Cómo usar System Instructions de forma efectiva',
      topic: 'Ingeniería de Prompts',
      content:
        'Las instrucciones del sistema definen el rol, las restricciones y el formato permanente de la conversación.\n\nEstructura recomendada:\n1. Rol y objetivo claro.\n2. Reglas de lo que NO debe hacer.\n3. Formato de salida esperado.\n4. Idioma y nivel de detalle.',
      updatedAt: getRelativeDateISO(-1, today),
    },
    {
      id: 'not-3',
      title: 'Ventajas de Structured Outputs (JSON Schema)',
      topic: 'Salida Estructurada',
      content:
        'En lugar de pedirle en texto "por favor responde en JSON", activar Structured Outputs obliga al modelo a respetar exactamente las propiedades, tipos (string, number, array) y campos requeridos. Evita errores al hacer JSON.parse() en el código.',
      updatedAt: getRelativeDateISO(-1, today),
    },
    {
      id: 'not-4',
      title: 'Flujo completo de Function Calling',
      topic: 'Function Calling',
      content:
        '1. Enviamos el prompt + lista de funciones disponibles.\n2. El modelo no ejecuta código; devuelve qué función quiere llamar y con qué argumentos.\n3. Nuestra aplicación ejecuta la función real y devuelve el resultado al modelo.\n4. El modelo redacta la respuesta final para el usuario.',
      updatedAt: getRelativeDateISO(-2, today),
    },
    {
      id: 'not-5',
      title: 'Uso correcto del SDK @google/genai',
      topic: 'Fundamentos de AI Studio',
      content:
        'Importar siempre GoogleGenAI desde @google/genai.\nNunca exponer la clave API en el navegador; ejecutar las llamadas desde un servidor o ruta /api/* usando process.env.GEMINI_API_KEY.',
      updatedAt: getRelativeDateISO(-3, today),
    },
  ];
}
