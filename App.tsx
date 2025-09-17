
import React, { useState, useCallback } from 'react';
import { ExperienceLevel, LearningStep } from './types';
import { generateLearningPath } from './services/geminiService';
import { BookOpenIcon, CodeBracketIcon, SparklesIcon } from './components/icons';
import LoadingSpinner from './components/LoadingSpinner';

// Reusable Card component defined in the same file for simplicity
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg ${className}`}>
    {children}
  </div>
);

const App: React.FC = () => {
  const [goal, setGoal] = useState<string>('Desarrollador Web Frontend');
  const [level, setLevel] = useState<ExperienceLevel>(ExperienceLevel.PRINCIPIANTE);
  const [learningPath, setLearningPath] = useState<LearningStep[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePath = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      setError('Por favor, ingresa un objetivo de aprendizaje.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setLearningPath(null);

    try {
      const path = await generateLearningPath(goal, level);
      setLearningPath(path);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  }, [goal, level]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <header className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-500">
            Análisis UX de Sololearn
          </h1>
          <p className="text-lg text-slate-400">Propuesta de mejora con un Generador de Rutas de Aprendizaje AI</p>
        </header>

        <main className="space-y-12">
          
          <section id="analysis">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">1. Identificación del Problema</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-bold text-lg mb-2 text-slate-100">Problema: Falta de una Ruta Guiada</h3>
                <p className="text-slate-300">
                  Sololearn ofrece una vasta biblioteca de cursos, pero carece de una estructura clara que guíe a los usuarios desde cero hasta un objetivo profesional concreto. Los usuarios, especialmente los principiantes, a menudo se sienten abrumados y no saben qué curso tomar a continuación.
                </p>
              </Card>
              <Card>
                <h3 className="font-bold text-lg mb-2 text-slate-100">Dificultad del Usuario: Parálisis por Análisis</h3>
                <p className="text-slate-300">
                  Un usuario que aspira a ser "Analista de Datos" se enfrenta a cursos de Python, SQL, R y Machine Learning sin un orden sugerido. Esta falta de dirección puede llevar a la frustración, a elegir un camino de aprendizaje ineficiente o, en el peor de los casos, a abandonar la aplicación.
                </p>
              </Card>
            </div>
          </section>

          <section id="solution">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">2. Propuesta de Solución UX</h2>
            <Card>
              <h3 className="font-bold text-lg mb-2 text-slate-100">Solución: Generador de Rutas de Aprendizaje Personalizadas</h3>
              <p className="text-slate-300">
                Proponemos implementar una nueva funcionalidad impulsada por IA que genere una "ruta de aprendizaje" personalizada. El usuario ingresaría su objetivo profesional (ej. "Desarrollador de Videojuegos") y su nivel de experiencia. La IA, utilizando un modelo como Gemini, crearía un plan de estudios paso a paso, combinando cursos teóricos de Sololearn con sugerencias de mini-proyectos prácticos para solidificar el conocimiento.
              </p>
            </Card>
          </section>

          <section id="demo">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">3. Demo: Generador de Rutas con Gemini</h2>
            <Card>
              <form onSubmit={handleGeneratePath} className="space-y-4">
                <div>
                  <label htmlFor="goal" className="block text-sm font-medium text-slate-300 mb-1">Tu Objetivo Profesional</label>
                  <input
                    type="text"
                    id="goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Ej: Ingeniero de Machine Learning"
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                  />
                </div>
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-slate-300 mb-1">Tu Nivel de Experiencia</label>
                  <select
                    id="level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value as ExperienceLevel)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                  >
                    {Object.values(ExperienceLevel).map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-600 hover:from-cyan-600 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SparklesIcon className="w-5 h-5" />
                  {isLoading ? 'Generando...' : 'Generar mi Ruta de Aprendizaje'}
                </button>
              </form>
            </Card>
            
            <div className="mt-6">
              {isLoading && <LoadingSpinner />}
              {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md text-center">{error}</div>}
              {learningPath && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-xl font-bold text-center text-slate-100">Tu Ruta de Aprendizaje Personalizada</h3>
                  {learningPath.map((step, index) => (
                    <div key={step.step} className="flex items-start gap-4 p-4 bg-slate-800/60 rounded-lg border border-slate-700 transition-transform hover:scale-[1.02] hover:border-cyan-500">
                      <div className="flex flex-col items-center">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${step.type === 'Curso' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {step.type === 'Curso' ? <BookOpenIcon className="w-6 h-6"/> : <CodeBracketIcon className="w-6 h-6"/>}
                        </div>
                        {index < learningPath.length - 1 && <div className="w-px h-8 bg-slate-600 mt-2"></div>}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{step.type} • {step.duration}</p>
                        <h4 className="font-bold text-lg text-slate-100 mt-1">{step.step}. {step.title}</h4>
                        <p className="text-slate-300 mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </section>
        </main>
        
        <footer className="text-center text-slate-500 text-sm pt-8 border-t border-slate-800">
          <p>&copy; {new Date().getFullYear()} Análisis de UX y Propuesta de Solución. Creado como un proyecto de demostración.</p>
        </footer>

      </div>
    </div>
  );
};

export default App;
