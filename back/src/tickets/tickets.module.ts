import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity'; 
import { WorkerModule } from '../worker/worker.module'; 
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // 📦 Aquí metemos todas las "cajas" de las que necesitamos cosas:
  imports: [
    TypeOrmModule.forFeature([Ticket]), // Para la DB
    WorkerModule,                       // Para el WorkerService
  ], 
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}