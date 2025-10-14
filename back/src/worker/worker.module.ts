// backend/src/worker/worker.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkerService } from './worker.service';
import { Ticket } from '../tickets/entities/ticket.entity'; // Necesita acceso a la Ficha Ticket

@Module({
  imports: [
    // 🧩 Le damos acceso a la ficha Ticket para poder actualizarlo.
    TypeOrmModule.forFeature([Ticket]),
  ],
  providers: [WorkerService],
  // 📢 El Worker debe empezar a escuchar cuando la aplicación inicia
  exports: [WorkerService], 
})
export class WorkerModule {}