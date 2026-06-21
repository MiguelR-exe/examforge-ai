# Contexto de la problemática e impacto

## Problema real

Convertir material de estudio (PDFs, apuntes, diapositivas) en preguntas de autoevaluación es una tarea manual, lenta y que muchos estudiantes y docentes simplemente no realizan por falta de tiempo. Esto reduce el uso de técnicas de estudio activo (active recall / práctica de recuperación), que están entre las más efectivas según la evidencia en ciencias del aprendizaje, y deja a los estudiantes dependiendo de relectura pasiva, mucho menos efectiva para la retención a largo plazo.

Además, cuando se necesita evaluar a **muchas personas** con el **mismo contenido** (por ejemplo, un curso completo o un proceso de capacitación corporativa), generar manualmente preguntas variadas para cada participante o lote de contenido es impráctico.

## Casos de uso

1. **Estudiante individual**: sube sus apuntes de un tema y recibe un quiz de autoevaluación inmediato, con retroalimentación por pregunta.
2. **Docente**: sube el material de una unidad de su curso y genera baterías de preguntas para usarlas como tarea o repaso, sin tener que redactarlas manualmente.
3. **Centro de capacitación / empresa**: procesa de forma masiva varios documentos o módulos de entrenamiento, generando evaluaciones para múltiples participantes en paralelo, sin que el sistema se sature ni pierda datos ante límites de la API del LLM.

## Por qué una arquitectura basada en eventos

Generar preguntas con un LLM a partir de documentos largos implica:

- Tiempos de respuesta variables del LLM.
- Límites de tasa de peticiones (rate limits) cuando se procesan varios documentos o lotes de preguntas en paralelo.
- La necesidad de no bloquear al usuario mientras el documento se procesa.

Por eso el procesamiento se divide en eventos independientes (por lote de contenido), se encola, y se procesa de forma asíncrona con reintentos automáticos. El usuario sube su documento y puede seguir usando la plataforma mientras el quiz se genera en segundo plano; el dashboard refleja el estado en cuanto está listo.

## Impacto esperado

- Reducir drásticamente el tiempo que toma convertir material de estudio en evaluaciones prácticas.
- Aumentar el uso de prácticas de estudio activo, mejorando la retención.
- Permitir procesamiento masivo y resiliente, sin que errores temporales de la API del LLM se traduzcan en pérdida de información o en una mala experiencia de usuario.