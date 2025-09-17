
import { GoogleGenAI, Type } from "@google/genai";
import { LearningStep, ExperienceLevel } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder for environments where the key is missing.
  // In a real deployed app, the key would be set in the environment.
  console.warn("API_KEY environment variable not set. Using a mock response.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "mock-key" });

const learningPathSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      step: {
        type: Type.INTEGER,
        description: 'El número secuencial del paso, comenzando en 1.'
      },
      title: {
        type: Type.STRING,
        description: 'El nombre conciso del curso o proyecto.'
      },
      type: {
        type: Type.STRING,
        description: 'El tipo de actividad: "Curso" o "Proyecto".'
      },
      description: {
        type: Type.STRING,
        description: 'Una breve descripción de una oración de lo que se aprenderá o construirá.'
      },
      duration: {
        type: Type.STRING,
        description: 'Una estimación de tiempo para completar el paso. Por ejemplo: "2 semanas", "30 horas".'
      },
    },
    required: ['step', 'title', 'type', 'description', 'duration']
  },
};

const MOCK_RESPONSE: LearningStep[] = [
    { step: 1, title: "Fundamentos de HTML", type: "Curso", description: "Aprende la estructura básica de las páginas web y las etiquetas semánticas.", duration: "1 Semana" },
    { step: 2, title: "Estilismo con CSS", type: "Curso", description: "Domina selectores, el modelo de caja y flexbox para diseñar sitios atractivos.", duration: "2 Semanas" },
    { step: 3, title: "Proyecto: Página de Portafolio Personal", type: "Proyecto", description: "Crea tu primera página web estática para mostrar tus habilidades.", duration: "1 Semana" },
    { step: 4, title: "JavaScript Básico", type: "Curso", description: "Introduce la interactividad con variables, funciones y manipulación del DOM.", duration: "3 Semanas" },
    { step: 5, title: "Proyecto: Calculadora Interactiva", type: "Proyecto", description: "Aplica tus conocimientos de JavaScript para construir una calculadora funcional.", duration: "1 Semana" }
];


export const generateLearningPath = async (goal: string, level: ExperienceLevel): Promise<LearningStep[]> => {
  if (!process.env.API_KEY) {
      console.log("Using mock data because API_KEY is not available.");
      return new Promise(resolve => setTimeout(() => resolve(MOCK_RESPONSE), 1500));
  }

  try {
    const prompt = `
      Basado en el objetivo de carrera de un usuario de "${goal}" y su nivel de experiencia "${level}", 
      genera una ruta de aprendizaje paso a paso. La ruta debe ser clara, lógica y progresiva.
      Incluye una mezcla de cursos teóricos para aprender conceptos y proyectos prácticos para aplicar el conocimiento.
      La ruta completa debe tener entre 5 y 8 pasos.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: learningPathSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    if (Array.isArray(parsedData)) {
      // Sort by step number just in case the model doesn't return them in order
      return parsedData.sort((a, b) => a.step - b.step);
    }
    
    throw new Error("La respuesta de la API no tiene el formato esperado.");

  } catch (error) {
    console.error("Error al generar la ruta de aprendizaje:", error);
    throw new Error("No se pudo generar la ruta de aprendizaje. Por favor, intenta de nuevo.");
  }
};
