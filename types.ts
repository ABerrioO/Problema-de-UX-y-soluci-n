
export enum ExperienceLevel {
  PRINCIPIANTE = 'Principiante',
  INTERMEDIO = 'Intermedio',
  AVANZADO = 'Avanzado',
}

export interface LearningStep {
  step: number;
  title: string;
  type: 'Curso' | 'Proyecto';
  description: string;
  duration: string;
}
