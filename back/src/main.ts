// backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. 🛡️ Seguridad con Helmet: Protege contra ataques web comunes (Headers HTTP).
  app.use(helmet()); 
  
  // 2. ✅ Validaciones Globales: Asegura que todos los datos de entrada (pedidos) sean correctos.
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, // Remueve propiedades que no están definidas en el pedido (más seguro).
    transform: true,  // Transforma los datos de la red a los tipos que TypeScript espera.
  }));


 // 3. 🌐 CORS: Permite que el Mesero (Puerto 3000) hable con el Chef.


  // Lista de dónde permitimos que venga el Mesero (Frontend)
const allowedOrigins = [
  'http://localhost:3000', // El puerto de desarrollo estándar de Next.js
  'http://localhost:3002', // El puerto en el que Next.js se inició esta vez
  // Puedes añadir más si es necesario, como 'http://127.0.0.1:3000'
];

app.enableCors({
  origin: (origin, callback) => {
    // Si el origen del Mesero está en nuestra lista de permitidos O es un origen indefinido
    // (a veces pasa en peticiones del mismo servidor), lo permitimos.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});


  // 🛡️ Límite de Peticiones (Rate Limiting) - Protección DDoS/Fuerza Bruta
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100, // Límite de 100 peticiones por IP en 15 minutos
        message: 'Demasiadas peticiones. Inténtalo de nuevo más tarde.',
      }),
    );

  await app.listen(3001); // El Chef abre su cocina en el puerto 3001
}
bootstrap();