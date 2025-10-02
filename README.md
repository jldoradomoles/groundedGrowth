# 🌱 GroundedGrowth

**Tu asistente de crecimiento personal con IA**

GroundedGrowth es una aplicación web moderna construida con Angular que te ayuda a realizar un seguimiento de tu crecimiento personal mediante la reflexión diaria y análisis inteligente con IA.

## ✨ Características

- 🎯 **Gestión de Metas**: Define y rastrea tus objetivos de crecimiento personal
- 📝 **Diario Reflexivo**: Escribe entradas de diario para documentar tu progreso
- 🤖 **Análisis con IA**: Obtén insights personalizados usando OpenAI GPT o Google Gemini
- 📊 **Historial Completo**: Revisa todas tus reflexiones y análisis anteriores
- ⚙️ **Configuración Flexible**: Elige entre diferentes proveedores de IA o modo automático
- 🎨 **Diseño Moderno**: Interfaz limpia y responsiva con Tailwind CSS

## 🚀 Tecnologías

- **Angular 20.x** - Framework principal con componentes standalone
- **TypeScript** - Tipado estático y características avanzadas
- **Tailwind CSS** - Framework de CSS utility-first
- **OpenAI API** - Integración con GPT para análisis de IA
- **Google Generative AI** - Integración con Gemini como alternativa
- **Angular Signals** - Gestión de estado reactiva moderna

## 🛠️ Configuración del Proyecto

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## 🔧 Configuración de APIs

Para usar las funciones de IA, necesitas configurar al menos una API key:

1. Copia `src/app/config/environment.example.ts` a `src/app/config/environment.ts`
2. Añade tu API key:

```typescript
export const environment = {
  production: false,
  geminiApiKey: 'tu-gemini-api-key-aqui', // Opcional
  openaiApiKey: 'tu-openai-api-key-aqui', // Opcional
};
```

### 🔑 Obtener API Keys

- **OpenAI**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Google Gemini**: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

## 📦 Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## 🧪 Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes modulares
│   │   ├── metas/          # Gestión de objetivos
│   │   ├── nueva-entrada/  # Formulario de entrada
│   │   ├── analisis-ia/    # Resultados de IA
│   │   ├── historial/      # Historial de entradas
│   │   └── ai-settings/    # Configuración de IA
│   ├── services/           # Servicios de la aplicación
│   │   ├── ai-analysis.service.ts    # Servicio principal de IA
│   │   ├── gemini.service.ts         # Integración con Gemini
│   │   └── openai.service.ts         # Integración con OpenAI
│   └── config/             # Configuración
│       └── environment.ts  # Variables de entorno
└── styles.scss            # Estilos globales con Tailwind
```

## 🚀 Características Técnicas

- **Componentes Standalone**: Arquitectura moderna de Angular sin NgModules
- **Angular Signals**: Sistema de reactividad de nueva generación
- **Inyección de Dependencias**: Patrón moderno con `inject()`
- **Detección de Cambios OnPush**: Optimización de rendimiento
- **Control Flow Sintaxis**: Nuevas directivas `@if`, `@for`
- **TypeScript Strict**: Tipado estricto para mayor seguridad

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📚 Additional Resources

Para más información sobre Angular CLI, visita la [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
