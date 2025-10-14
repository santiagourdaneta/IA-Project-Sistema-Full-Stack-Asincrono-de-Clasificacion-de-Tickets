// frontend/app/layout.tsx

import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // SEO Básico
  title: 'IA Project: Clasificación de Tickets y Resúmenes Asíncronos',
  description: 'Sistema Full Stack SSR para automatización de tickets de soporte y documentos. Rápido, seguro y accesible.',
  keywords: ['IA', 'NextJS', 'NestJS', 'Automatización', 'Soporte', 'Tickets'],
  
  // 📢 Open Graph (OG) para Facebook, WhatsApp, LinkedIn
  openGraph: {
    title: 'Automatización Inteligente 🤖',
    description: 'Sistema Full Stack escalable y seguro para la gestión de soporte.',
    url: 'https://tu-dominio-final.com',
    siteName: 'IA Project Full Stack',
    type: 'website',
    images: [{
      url: 'https://tu-dominio-final.com/opengraph-ai.png', // URL de tu imagen
      width: 1200,
      height: 630,
    }],
  },
  
  // 🐦 Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Máxima Eficiencia con IA',
    description: 'Sistema optimizado para rendimiento en dispositivos viejos.',
    creator: '@tu_usuario',
    images: ['https://tu-dominio-final.com/twitter-ai.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* Usamos el contenedor de Pico.css para que todo el contenido esté ordenado y centrado */}
        <main className="container"> 
          {children}
        </main>
      </body>
    </html>
  );
}