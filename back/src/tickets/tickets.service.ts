// backend/src/tickets/tickets.service.ts

import { InjectRepository } from '@nestjs/typeorm'; 
import { Ticket } from './entities/ticket.entity'; 
import { WorkerService } from '../worker/worker.service'; 
import { CreateTicketDto } from './dto/create-ticket.dto';
import { v4 as uuidv4 } from 'uuid'; 
import { Injectable, Inject } from '@nestjs/common'; 
import { CACHE_MANAGER } from '@nestjs/cache-manager'; 
import { Like, Repository } from 'typeorm'; 
import type { Cache } from 'cache-manager'; 

// ¡AVISO! Tienes que instalar la librería 'uuid'
// Corre esto en tu terminal (en la carpeta 'backend'):
// npm install uuid @types/uuid

@Injectable()
export class TicketsService {

  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    private readonly workerService: WorkerService, 
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  
  async createTicket(createTicketDto: CreateTicketDto): Promise<{ id: string }> {

    // 1. 🏗️ Creamos una nueva ficha con el ID y los datos del pedido 
    const newTicket = this.ticketsRepository.create({
      id: uuidv4(), 
      title: createTicketDto.title,
      content: createTicketDto.content,
      status: 'PENDIENTE', 
    });

    // 2. 💾 Guardamos la ficha en la Caja Fuerte 
    const savedTicket = await this.ticketsRepository.save(newTicket);

    // 3. 📣 ¡LLAMADA AL WORKER!
     this.workerService.enqueueTicket(savedTicket); 

    // 4. ✅ Devolvemos la promesa
    return { id: savedTicket.id };
  }

  async findAllTickets(page: number, limit: number, search: string) {
    // 1. 🔑 Crear la clave del caché (depende de la página, límite y búsqueda)
    const cacheKey = `tickets_p${page}_l${limit}_s${search}`;
    
    // 2. 💨 Buscar en el caché de Redis
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      console.log(`[Redis Cache] Devolviendo datos INSTANTÁNEOS para ${cacheKey}`);
      return cachedData; // ¡Velocidad de la luz!
    }

    // 3. 🐌 Si no está en caché, consultar MySQL
    const skip = (page - 1) * limit;
    
    // Construir la condición de búsqueda
    const whereCondition = search
      ? [
          { title: Like(`%${search}%`) }, // Buscar en título
          { content: Like(`%${search}%`) }, // Buscar en contenido
        ]
      : {};

    const [data, total] = await this.ticketsRepository.findAndCount({
      where: whereCondition,
      order: { createdAt: 'DESC' }, // Los más nuevos primero
      take: limit,
      skip: skip,
    });
    
    const result = {
      data,
      total,
      page,
      last_page: Math.ceil(total / limit),
    };
    
    // 4. 💾 Guardar el resultado en el caché por 60 segundos
    await this.cacheManager.set(cacheKey, result, 60 * 1000); 

    console.log(`[MySQL DB] Datos consultados y guardados en caché.`);
    return result;
  }

}