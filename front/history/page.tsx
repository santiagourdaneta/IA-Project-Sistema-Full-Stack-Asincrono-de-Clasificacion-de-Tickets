// frontend/src/app/history/page.tsx

"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // 👈 Para paginación sin recarga

const API_URL = 'http://localhost:3001/tickets';

// --- Función para formatear el estado visualmente ---
const statusClass = (status: string) => {
    switch(status) {
        case 'CLASIFICADO': return 'success';
        case 'PENDIENTE': return 'warning';
        case 'ERROR': return 'error';
        default: return 'secondary';
    }
};

export default function TicketHistoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // ⚙️ Obtener parámetros de la URL
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const currentSearch = searchParams.get('search') || '';
    
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(currentSearch);
    
    // ----------------------------------------------------
    // 1. 🔄 Función para obtener los datos
    // ----------------------------------------------------
    const fetchTickets = useCallback(async (page: number, search: string) => {
        setLoading(true);
        try {
            const url = `${API_URL}?page=${page}&limit=10&search=${search}`;
            const response = await fetch(url);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error al cargar tickets:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Ejecutar la carga inicial o al cambiar la URL
        fetchTickets(currentPage, currentSearch);
    }, [currentPage, currentSearch, fetchTickets]); // Depende de los parámetros de la URL

    // ----------------------------------------------------
    // 2. 🔍 Manejo de Búsqueda (Velocidad de la luz + Debounce)
    // ----------------------------------------------------
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // 🚀 Cambia la URL y Next.js hace el resto (navegación sin recarga)
        router.push(`/history?page=1&search=${searchTerm}`, { scroll: false }); 
    };

    // ----------------------------------------------------
    // 3. 📄 Manejo de Paginación (Sin recarga de página)
    // ----------------------------------------------------
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= (data?.last_page || 1)) {
            // 🚀 Cambia la URL, Next.js actualiza los datos
            router.push(`/history?page=${newPage}&search=${currentSearch}`, { scroll: false }); 
        }
    };
    
    if (loading && !data) return <progress aria-label="Cargando tickets"></progress>;

    return (
        <article>
            <h1>📜 Historial de Tickets Procesados por IA</h1>
            <p>Estado de clasificación y resultados de la IA.</p>

            {/* 🔍 Barra de Búsqueda */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="Buscar por título o contenido..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Campo de búsqueda"
                />
                <button type="submit">Buscar</button>
            </form>

            {loading && <progress style={{ marginTop: '1rem' }} aria-label="Actualizando tabla"></progress>}

            {/* 📋 Tabla de Resultados */}
            <figure>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">ID (UUID)</th>
                            <th scope="col">Título</th>
                            <th scope="col">Clasificación IA</th>
                            <th scope="col">Riesgo</th>
                            <th scope="col">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data.length === 0 && (
                            <tr><td colSpan={5}>No hay tickets que coincidan con la búsqueda.</td></tr>
                        )}
                        {data?.data.map((ticket: any) => (
                            <tr key={ticket.id}>
                                <td>{ticket.id.substring(0, 8)}...</td>
                                <td>{ticket.title}</td>
                                <td><strong>{ticket.classification || 'N/A'}</strong></td>
                                <td>{ticket.anomalyScore ? (ticket.anomalyScore * 100).toFixed(2) + '%' : 'N/A'}</td>
                                <td><mark className={statusClass(ticket.status)}>{ticket.status}</mark></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </figure>

            {/* 📄 Paginación (Sin recarga) */}
            <nav aria-label="Paginación de Tickets">
                <ul className="pagination">
                    <li>
                        <button 
                            className="secondary outline"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                        >
                            &laquo; Anterior
                        </button>
                    </li>
                    <li className="page-item">
                        <mark>{currentPage} / {data?.last_page || 1}</mark>
                    </li>
                    <li>
                        <button 
                            className="secondary outline"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === (data?.last_page || 1) || loading}
                        >
                            Siguiente &raquo;
                        </button>
                    </li>
                </ul>
            </nav>
        </article>
    );
}