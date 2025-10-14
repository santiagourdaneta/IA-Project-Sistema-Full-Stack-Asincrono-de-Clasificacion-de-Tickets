// backend/src/tickets/dto/create-ticket.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

// El contrato que define cómo debe ser un ticket nuevo
export class CreateTicketDto {
  
  // 📜 El título del ticket (Obligatorio y debe ser texto)
  @IsString()
  @IsNotEmpty()
  title: string;

  // 📝 El contenido/descripción del ticket (Obligatorio y debe ser texto)
  @IsString()
  @IsNotEmpty()
  content: string;
}