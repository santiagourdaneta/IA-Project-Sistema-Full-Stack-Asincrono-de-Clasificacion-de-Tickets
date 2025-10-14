// backend/src/tickets/entities/ticket.entity.ts

import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

/**
 * 🎫 Entidad Ticket: Mapa de la tabla 'tickets' en MySQL.
 * Contiene la información del cliente y los resultados de la automatización por IA.
 */
@Entity('tickets') 
export class Ticket {
  
  /**
   * 🔑 ID Principal (UUID)
   * Se almacena como VARCHAR(36) para compatibilidad con UUIDs en MySQL.
   */
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  /**
   * 📜 Título del ticket
   */
  @Column({ type: 'varchar', length: 255 })
  title: string;

  /**
   * 📝 Contenido/Descripción del ticket
   * Usamos 'text' para permitir mensajes largos.
   */
  @Column({ type: 'text' })
  content: string;

  // --- Campos de Automatización con IA ---

  /**
   * 🏷️ Clasificación de IA (Ej: Soporte, Bug, Venta)
   * Nullable: TRUE. Lo llena el Worker de Clasificación Asíncrono.
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  classification: string | null; 

  /**
   * 📉 Puntuación de Anomalía/Riesgo (0.0 a 1.0)
   * Útil para la Detección de Anomalías.
   * Nullable: TRUE.
   */
  @Column({ 
    type: 'decimal', 
    precision: 5, // Total de dígitos (ej: 1.0000)
    scale: 4,     // Decimales (ej: .0000)
    nullable: true 
  })
  anomalyScore: number | null;
  
  /**
   * 💡 Resumen Generado por IA (Para el caso de uso de documentos o resúmenes de hilo)
   * Aunque este es un ticket, lo incluimos para ser flexible con la IA.
   * Nullable: TRUE.
   */
  @Column({ type: 'text', nullable: true })
  summary: string | null;

  // --- Campos de Estado y Tiempo ---

  /**
   * ⏳ Estado del procesamiento
   * Valores: 'PENDIENTE', 'CLASIFICADO', 'PROCESADO', 'ERROR'.
   */
  @Column({ type: 'varchar', length: 50, default: 'PENDIENTE' })
  status: string;
  
  /**
   * ⏱️ Fecha de creación
   * Se registra automáticamente al guardarse por primera vez.
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  /**
   * 🔄 Fecha de última actualización
   * Se actualiza automáticamente cada vez que un Worker de IA modifica el ticket.
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}