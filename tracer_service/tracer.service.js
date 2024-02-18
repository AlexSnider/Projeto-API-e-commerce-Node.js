const { NodeTracerProvider } = require("@opentelemetry/node");
const { SimpleSpanProcessor, ConsoleSpanExporter } = require("@opentelemetry/tracing");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");

const tracerProvider = new NodeTracerProvider();

registerInstrumentations({
  instrumentations: [new HttpInstrumentation()],
});

const consoleExporterSimple = new ConsoleSpanExporter();
tracerProvider.addSpanProcessor(new SimpleSpanProcessor(consoleExporterSimple));

const consoleExporter = new JaegerExporter({
  serviceName: "tracer",
  host: "jaeger-collector",
  port: 4137,
});

tracerProvider.addSpanProcessor(new SimpleSpanProcessor(consoleExporter));
tracerProvider.addSpanProcessor(new SimpleSpanProcessor(consoleExporterSimple));

tracerProvider.register();
