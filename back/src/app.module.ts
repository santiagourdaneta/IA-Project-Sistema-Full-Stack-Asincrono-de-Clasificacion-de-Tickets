// backend/src/app.module.ts 

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsModule } from './tickets/tickets.module';
import { CacheModule } from '@nestjs/cache-manager'; 
import { WorkerModule } from './worker/worker.module';
import * as redisStore from 'cache-manager-redis-store'; 


@Module({
  imports: [
    // 🔗 CONFIGURACIÓN DE CONEXIÓN A LA CAJA FUERTE (MYSQL)
    TypeOrmModule.forRoot({
      type: 'mysql',        // 👈 CAMBIO CLAVE: Cambia a 'mysql'
      host: 'localhost',    // 🖥️ La base de datos está en tu computadora
      port: 3306,           // 🚪 El puerto estándar de MySQL/MariaDB
      username: 'root',     // 👤 Tu usuario de MySQL (a menudo es 'root')
      password: '', // 🔑 ¡IMPORTANTE! Cámbialo por tu contraseña de MySQL
      database: 'ia_project_db', // 🗃️ El nombre de tu base de datos
      
      entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      synchronize: true, 
      // Si usas MariaDB, la configuración es idéntica
    }),
    // 💨 Configuración del Caché con Redis
        CacheModule.register({
          store: redisStore,
          host: 'localhost', // 📍 Dirección de tu servidor Redis
          port: 6379,        // 🚪 Puerto por defecto de Redis
          isGlobal: true,    // 🌍 Accesible desde cualquier parte del Chef
        }),
    TicketsModule,
    WorkerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}