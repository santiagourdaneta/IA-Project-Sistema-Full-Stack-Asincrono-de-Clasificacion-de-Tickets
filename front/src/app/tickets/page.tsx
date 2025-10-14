// frontend/src/app/tickets/page.tsx

"use client"; 

import React, { useState } from 'react';
import Link from 'next/link'; // 👈 Importamos Link para navegación sin recarga

// ⚙️ Dirección del Chef (Backend)
const API_URL = 'http://localhost:3001/tickets';

// --- VALIDACIÓN DE CARACTERES MÁXIMOS ---
const MAX_TITLE = 100;
const MAX_CONTENT = 2000;

export default function CreateTicketPage() {
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 🛡️ CSRF: Si usáramos cookies, el token iría aquí. Con API pura/JWT, el JWT cumple una función similar.
        },
        body: JSON.stringify({ title, content }), 
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(`Ticket ${data.ticketId} recibido. La IA está clasificando.`);
        setTitle('');
        setContent('');
      } else {
        setStatus('error');
        // El Chef nos devuelve el error de validación (ej. límite de caracteres)
        setMessage(`Error: ${data.message || 'Error desconocido del servidor.'}`); 
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error de conexión con el backend. Revisa la URL.');
    }
  };

  return (
    <article>
      <h1>📝 Nuevo Ticket de Soporte</h1>
      
      {/* 📣 Mensajes de estado y accesibilidad */}
      {status === 'loading' && <progress aria-label="Enviando petición"></progress>}
      {status === 'success' && <mark className="success">{message}</mark>}
      {status === 'error' && <mark className="error">{message}</mark>}

      <form onSubmit={handleSubmit}>
        
        <label htmlFor="title">Título del Problema ({title.length}/{MAX_TITLE})</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Asunto breve"
          maxLength={MAX_TITLE} // 👈 Máxima cantidad de caracteres
          required
          disabled={status === 'loading'}
        />

        <label htmlFor="content">Descripción Detallada ({content.length}/{MAX_CONTENT})</label>
        <textarea
          id="content"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Detalles del problema. Sé lo más específico posible."
          maxLength={MAX_CONTENT} // 👈 Máxima cantidad de caracteres
          required
          disabled={status === 'loading'}
        />

        {/* 🚀 Botón con feedback visual */}
        <button 
          type="submit" 
          aria-busy={status === 'loading'} 
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar a Clasificación de IA'}
        </button>
      </form>
      
      {/* 🧭 Navegación: Requisito de "no recarga de página" */}
      <nav>
         {/* Usar Link de Next.js garantiza transiciones sin recarga (SPA-like) */}
        <p>Volver a la <Link href="/" role="button" className="secondary outline">Página Principal</Link></p>
      </nav>
    </article>
  );
}