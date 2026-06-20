import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PreguntaCard from '../components/PreguntaCard';
import BarraProgreso from '../components/BarraProgreso';
import Cronometro from '../components/Cronometro';
import Boton from '../components/Boton';

// Datos de prueba — esto se reemplazará por la respuesta real de la API (evento "QuizGenerado")
const PREGUNTAS_MOCK = [
  {
    tema: 'Derivadas',
    dificultad: 'Dificultad media',
    texto: '¿Cuál es la derivada de f(x) = 3x² − 5x + 2?',
    alternativas: ['f\'(x) = 6x − 5', 'f\'(x) = 3x − 5', 'f\'(x) = 6x + 2', 'f\'(x) = 3x² − 5'],
    correcta: 0,
  },
  {
    tema: 'Límites',
    dificultad: 'Dificultad alta',
    texto: '¿Cuál es el límite de (x² − 1)/(x − 1) cuando x tiende a 1?',
    alternativas: ['El límite no existe', '2', '1', '0'],
    correcta: 1,
  },
  {
    tema: 'Integrales',
    dificultad: 'Dificultad media',
    texto: '¿Cuál es la integral de f(x) = 2x respecto a x?',
    alternativas: ['x² + C', '2x² + C', 'x + C', 'x²/2 + C'],
    correcta: 0,
  },
];

const TIEMPO_INICIAL_SEGUNDOS = 300; // 5 minutos — vendrá de la config del usuario al generar el quiz

export default function Quiz() {
  const navigate = useNavigate();
  const [indiceActual, setIndiceActual] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [calificada, setCalificada] = useState(false);
  const [respuestas, setRespuestas] = useState([]);
  const [segundosRestantes, setSegundosRestantes] = useState(TIEMPO_INICIAL_SEGUNDOS);

  const pregunta = PREGUNTAS_MOCK[indiceActual];
  const esUltima = indiceActual === PREGUNTAS_MOCK.length - 1;

  function manejarSeleccion(index) {
    if (calificada) return;
    setSeleccionada(index);
  }

  function manejarSiguiente() {
    if (!calificada) {
      // Primer click: calificar la pregunta actual (feedback visual inmediato)
      setCalificada(true);
      setRespuestas((prev) => [...prev, { indice: indiceActual, seleccionada, correcta: pregunta.correcta }]);
      return;
    }

    if (esUltima) {
      // Aquí se dispararía la llamada a calificarQuiz → evento "QuizCompletado"
      console.log('Quiz terminado', respuestas);
      navigate('/resultado');
      return;
    }

    setIndiceActual((prev) => prev + 1);
    setSeleccionada(null);
    setCalificada(false);
  }

  // NOTA: este interval es solo para visualizar el cronómetro en el mock.
  // En la versión conectada, el backend valida el tiempo real al recibir las respuestas.

  return (
    <div className="flex min-h-screen flex-col items-center gap-7 bg-bg px-5 py-10">
      <div className="flex w-full max-w-xl items-center gap-4">
        <BarraProgreso actual={indiceActual + 1} total={PREGUNTAS_MOCK.length} />
        <Cronometro
          segundosRestantes={segundosRestantes}
          onTiempoAgotado={() => console.log('Tiempo agotado — enviar respuestas actuales')}
        />
      </div>

      <PreguntaCard
        tema={pregunta.tema}
        dificultad={pregunta.dificultad}
        texto={pregunta.texto}
        alternativas={pregunta.alternativas}
        seleccionada={seleccionada}
        correcta={pregunta.correcta}
        calificada={calificada}
        onSeleccionar={manejarSeleccion}
      />

      <div className="flex w-full max-w-xl justify-end">
        <Boton onClick={manejarSiguiente} disabled={seleccionada === null}>
          {!calificada ? 'Calificar' : esUltima ? 'Ver resultado' : 'Siguiente pregunta'}
        </Boton>
      </div>
    </div>
  );
}