// backend/src/worker/worker.service.ts

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../tickets/entities/ticket.entity';

@Injectable()
export class WorkerService implements OnModuleInit {
  private readonly logger = new Logger(WorkerService.name);
  private ticketQueue: any[] = []; // 📝 Cola de tickets simulada (en memoria)

  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  // 1. 👂 El Worker empieza a escuchar la cola cuando la app inicia
  onModuleInit() {
    this.logger.log('Worker de IA iniciado. Escuchando SQS simulado...');
    // Llamamos a un método que simula la escucha (polling)
    this.startPolling(); 
  }

  // 2. 📬 Método que el TicketsService llama para "enviar" el ticket
  enqueueTicket(ticketData: any) {
    this.ticketQueue.push(ticketData);
    this.logger.log(`Ticket ${ticketData.id} encolado. Tamaño de cola: ${this.ticketQueue.length}`);
  }

  // 3. 🧠 Simulación del Motor de Procesamiento de IA
  private async processTicket(ticketId: string, title: string, content: string): Promise<void> {
    this.logger.log(`Procesando ticket ${ticketId} con IA...`);
    
    // --- SIMULACIÓN DEL MODELO DE IA ---
    // En un proyecto real, aquí harías una llamada HTTP a OpenAI, Gemini, o tu modelo ML.
    
    // Simulación de clasificación y puntaje
    const classification = content.toLowerCase().includes('lento') ? 'Performance' : 'Bug/Error';
    const anomalyScore = Math.random() * 0.5; // Entre 0.0 y 0.5 (bajo riesgo)

    // Simulación de tiempo de procesamiento (para hacerlo asíncrono)
    await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5 segundos

    // --- 💾 Actualizar la Base de Datos ---
    await this.ticketsRepository.update(ticketId, {
      classification: classification,
      anomalyScore: anomalyScore,
      status: 'CLASIFICADO', // Nuevo estado
    });
    
    this.logger.log(`✅ Ticket ${ticketId} PROCESADO. Clasificación: ${classification}`);
  }

  // 4. 🔄 Simulación de Polling (Escucha constante de la cola)
  private startPolling() {
    setInterval(async () => {
      // Si hay tickets en la cola simulada...
      if (this.ticketQueue.length > 0) {
        // Sacamos el ticket más viejo de la cola
        const ticket = this.ticketQueue.shift(); 
        
        // Ejecutamos el procesamiento sin esperar el resultado (asíncrono)
        this.processTicket(ticket.id, ticket.title, ticket.content).catch(error => {
            this.logger.error(`Error procesando ticket ${ticket.id}:`, error.stack);
            // Manejo de errores: actualizar el status a 'ERROR' si falla
            this.ticketsRepository.update(ticket.id, { status: 'ERROR' });
        });
      }
    }, 1000); // Revisa la cola cada 1 segundo
  }
}