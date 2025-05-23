// ===============================================
// FUNCIONES DE CONTROL DE INTERFAZ
// ===============================================

/**
 * Controla la visibilidad de las secciones colapsables y actualiza el texto del botón
 * @param {string} contentId - ID del contenedor a mostrar/ocultar
 * @param {string} buttonId - ID del botón que controla la visibilidad
 */
function toggleTable(contentId, buttonId) {
    const content = document.getElementById(contentId);
    const button = document.getElementById(buttonId);
    const originalText = button.getAttribute('data-original-text') || button.textContent.split('(')[0].trim();
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        if (buttonId === 'toggleButton') {
            const count = contarElementosTabla();
            button.textContent = 'Ocultar ' + originalText.toLowerCase() + ` (${count})`;
        } else {
            button.textContent = 'Ocultar ' + originalText.toLowerCase();
        }
    } else {
        content.style.display = 'none';
        if (buttonId === 'toggleButton') {
            const count = contarElementosTabla();
            button.textContent = originalText + ` (${count})`;
        } else {
            button.textContent = originalText;
        }
    }
    
    if (!button.getAttribute('data-original-text')) {
        button.setAttribute('data-original-text', originalText);
    }
}

// ===============================================
// FUNCIONES DE CONTEO Y FORMATEO
// ===============================================

/**
 * Cuenta el número de elementos en la tabla de confirmaciones pendientes
 * @returns {number} Número de filas en la tabla
 */
function contarElementosTabla() {
    const tbody = document.querySelector('#tableContent tbody');
    return tbody ? tbody.getElementsByTagName('tr').length : 0;
}

/**
 * Formatea un número como moneda chilena sin decimales
 * @param {number|string} monto - Monto a formatear
 * @returns {string} Monto formateado
 */
function formatearMonto(monto) {
    if (monto === '-' || !monto) return '-';
    return new Intl.NumberFormat('es-CL', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }).format(monto);
}

// ===============================================
// FUNCIONES DE CÁLCULO DE FECHAS
// ===============================================

/**
 * Calcula los días pendientes y formatea los montos en la tabla
 */
function calcularDiasPendientes() {
    const rows = document.querySelectorAll('#tableContent tbody tr');
    const hoy = new Date();

    rows.forEach(row => {
        const fechaSolicitudCell = row.querySelector('td:nth-child(2)');
        const montoCell = row.querySelector('td:nth-child(10)');
        const diasPendientesCell = row.querySelector('td:nth-child(11)');
        
        // Formatear monto
        if (montoCell) {
            const montoTexto = montoCell.textContent;
            if (montoTexto !== '-') {
                const monto = parseInt(montoTexto.replace(/\D/g, ''));
                montoCell.textContent = formatearMonto(monto);
            }
        }
        
        // Calcular días pendientes
        if (fechaSolicitudCell && diasPendientesCell) {
            const fechaSolicitud = parseFecha(fechaSolicitudCell.textContent);
            // Agregar 3 días a la fecha de solicitud
            fechaSolicitud.setDate(fechaSolicitud.getDate() + 3);
            const diferenciaDias = Math.ceil((fechaSolicitud-hoy) / (1000 * 60 * 60 * 24));
            
            // Mostrar "Vencido" si es negativo, sino mostrar el número de días
            if (diferenciaDias < 0) {
                diasPendientesCell.textContent = "Vencido";
                diasPendientesCell.classList.add('dias-vencidos');
            } else {
                diasPendientesCell.textContent = diferenciaDias;
            }
        }
    });
}

/**
 * Convierte una fecha en formato DD-MM-YYYY a objeto Date
 * @param {string} fechaStr - Fecha en formato DD-MM-YYYY
 * @returns {Date} Objeto Date
 */
function parseFecha(fechaStr) {
    const [dia, mes, anio] = fechaStr.split('-');
    return new Date(anio, mes - 1, dia);
}

// ===============================================
// INICIALIZACIÓN
// ===============================================

// Configuración inicial cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar contador en el botón
    const button = document.getElementById('toggleButton');
    const count = contarElementosTabla();
    const originalText = button.textContent;
    button.textContent = originalText + ` (${count})`;
    
    // Configurar cálculo de días pendientes al mostrar la tabla
    document.getElementById('toggleButton').addEventListener('click', function() {
        setTimeout(calcularDiasPendientes, 100);
    });
});
