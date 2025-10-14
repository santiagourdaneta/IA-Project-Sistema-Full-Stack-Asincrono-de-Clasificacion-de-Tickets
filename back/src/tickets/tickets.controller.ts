// backend/src/tickets/tickets.controller.ts

import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Controller, Post, Body, Get, Query } from '@nestjs/common'; 

// La ruta para llegar a esta ventana será: /tickets
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // 🚪 Recibe un pedido POST en la ruta /tickets
  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    // 1. El controlador recibe el pedido (DTO)
    // 2. Llama al servicio (la cocina) para que lo procese
    const result = await this.ticketsService.createTicket(createTicketDto);

    // 3. Envía una confirmación al Mesero
    return {
      message: 'Ticket recibido y puesto en la cola de procesamiento de IA.',
      ticketId: result.id,
    };
  }

  // 🚪 Recibe pedidos GET en /tickets (para listar)
  @Get()
  async findAll(
    @Query('page') page: string = '1',       // ❓ Parámetro de paginación
    @Query('limit') limit: string = '10',    // ❓ Parámetro de límite
    @Query('search') search: string = '',    // ❓ Parámetro de búsqueda
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    // Llama al servicio para obtener la lista, aplicando caché.
    return this.ticketsService.findAllTickets(pageNum, limitNum, search);
  }
  
}