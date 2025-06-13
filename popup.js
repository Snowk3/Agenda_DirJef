// ===============================================
// MÓDULO DE POPUPS: SISTEMA DE VISUALIZACIÓN DE DETALLES
// ===============================================

// -----------------------------------------------
// 1. FUNCIONES PRINCIPALES DE CONTROL DEL POPUP
// -----------------------------------------------

/**
 * Abre el popup de detalles y lo rellena con la información proporcionada
 * @param {string} tipoSolicitud - Tipo de solicitud
 * @param {string} accion - Acción relacionada con la solicitud
 * @param {string} fechaSolicitud - Fecha de la solicitud
 * @param {string} folio - Número de folio de la solicitud
 * @param {string} rutFuncionario - RUT del funcionario
 * @param {string} nombreFuncionario - Nombre del funcionario
 * @param {string} decision - Decisión tomada
 * @param {string} montoAutorizado - Monto autorizado
 * @param {string} comentarios - Comentarios adicionales (opcional)
 */
function openDetailPopup(tipoSolicitud, accion, fechaSolicitud, folio, rutFuncionario, nombreFuncionario, decision, montoAutorizado, comentarios = 'No hay comentarios registrados para esta solicitud.') {
    // Rellenar la información general
    document.getElementById('popupTipoSolicitud').textContent = tipoSolicitud;
    document.getElementById('popupAccion').textContent = accion;
    document.getElementById('popupFechaSolicitud').textContent = fechaSolicitud;
    document.getElementById('popupFolio').textContent = folio;
    document.getElementById('popupRutFuncionario').textContent = rutFuncionario;
    document.getElementById('popupNombreFuncionario').textContent = nombreFuncionario;
    
    // Rellenar la información de decisión
    document.getElementById('popupDecision').textContent = decision;
    
    // Formatear el monto adecuadamente
    try {
        // Intentar formatear como número
        const montoLimpio = montoAutorizado.toString().replace(/\D/g, '');
        document.getElementById('popupMontoAutorizado').textContent = formatearMonto(montoLimpio);
    } catch (error) {
        // Si hay algún error, mostrar el valor original
        document.getElementById('popupMontoAutorizado').textContent = montoAutorizado;
    }
    
    document.getElementById('popupComentarios').textContent = comentarios;
    
    // Personalizar el título del popup según el tipo de acción
    const popupTitle = document.querySelector('.popup-title');
    if (accion.includes('Decision 48 Horas')) {
        popupTitle.textContent = 'Detalle de Solicitud de Decisión';
    } else if (accion.includes('FEP')) {
        popupTitle.textContent = 'Detalle de Fiscalización';
    } else if (accion === 'Ver Resolución' || accion === 'Revisar Resolución') {
        popupTitle.textContent = 'Detalle de Resolución';
    } else {
        popupTitle.textContent = 'Detalle de Solicitud';
    }
    
    // Generar datos de historial (simulados para este ejemplo)
    generarHistorialSimulado(tipoSolicitud, accion, fechaSolicitud, folio, rutFuncionario, decision);
    
    // Mostrar el popup con una animación suave
    const popup = document.getElementById('detailPopup');
    popup.classList.add('show');
    
    // Enfocar el popup para navegación por teclado
    popup.querySelector('.popup-close').focus();
    
    // Prevenir el scroll del body mientras el popup está abierto
    document.body.style.overflow = 'hidden';
}

/**
 * Cierra el popup de detalles
 */
function closeDetailPopup() {
    const popup = document.getElementById('detailPopup');
    popup.classList.remove('show');
    
    // Restaurar el scroll del body
    document.body.style.overflow = '';
}

// -----------------------------------------------
// 2. GENERACIÓN DE DATOS PARA EL HISTORIAL
// -----------------------------------------------

/**
 * Genera datos de historial simulados para el popup
 * @param {string} tipoSolicitud - Tipo de solicitud
 * @param {string} accion - Acción relacionada con la solicitud
 * @param {string} fechaSolicitud - Fecha de la solicitud
 * @param {string} folio - Número de folio de la solicitud
 * @param {string} rutFuncionario - RUT del funcionario
 * @param {string} decision - Decisión tomada
 */
function generarHistorialSimulado(tipoSolicitud, accion, fechaSolicitud, folio, rutFuncionario, decision) {
    // Mostrar indicador de carga
    const loadingIndicator = document.getElementById('popupLoadingIndicator');
    loadingIndicator.classList.add('show');
    
    // Simular tiempo de carga (entre 0.5 y 1.5 segundos)
    const loadingTime = Math.random() * 1000 + 500;
    
    setTimeout(() => {
        const tbody = document.getElementById('popupHistorialBody');
        tbody.innerHTML = ''; // Limpiar historial existente
        
        // Crear una lista de eventos simulados basados en los datos proporcionados
        const eventos = [];
        
        // Evento de creación (siempre existe)
        const [dia, mes, anio] = fechaSolicitud.split('-');
        const fechaObj = new Date(anio, mes - 1, dia);
        const horaCreacion = `${String(Math.floor(Math.random() * 10) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
        
        eventos.push({
            evento: 'Solicitud Creada',
            fechaHora: `${fechaSolicitud} ${horaCreacion}`,
            funcionario: rutFuncionario,
            documento: `Solicitud ${tipoSolicitud} #${folio}`
        });
        
        // Evento de análisis (1 día después)
        const fechaAnalisis = new Date(fechaObj);
        fechaAnalisis.setDate(fechaAnalisis.getDate() + 1);
        const fechaAnalisisStr = `${String(fechaAnalisis.getDate()).padStart(2, '0')}-${String(fechaAnalisis.getMonth() + 1).padStart(2, '0')}-${fechaAnalisis.getFullYear()}`;
        const horaAnalisis = `${String(Math.floor(Math.random() * 10) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
        
        eventos.push({
            evento: 'Análisis Completado',
            fechaHora: `${fechaAnalisisStr} ${horaAnalisis}`,
            funcionario: rutFuncionario,
            documento: `Informe de Análisis #${Math.floor(Math.random() * 1000) + 1000}`
        });
        
        // Si es una solicitud con decisión, agregar evento de decisión
        if (accion.includes('Decision')) {
            const fechaDecision = new Date(fechaObj);
            fechaDecision.setDate(fechaDecision.getDate() + 2);
            const fechaDecisionStr = `${String(fechaDecision.getDate()).padStart(2, '0')}-${String(fechaDecision.getMonth() + 1).padStart(2, '0')}-${fechaDecision.getFullYear()}`;
            const horaDecision = `${String(Math.floor(Math.random() * 10) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
            
            eventos.push({
                evento: `Decisión: ${decision}`,
                fechaHora: `${fechaDecisionStr} ${horaDecision}`,
                funcionario: 'Director Regional',
                documento: `Resolución #DR-${Math.floor(Math.random() * 1000) + 5000}`
            });
        }
        
        // Si es una solicitud con FEP, agregar evento de fiscalización
        if (accion.includes('FEP')) {
            const fechaFEP = new Date(fechaObj);
            fechaFEP.setDate(fechaFEP.getDate() + 5);
            const fechaFEPStr = `${String(fechaFEP.getDate()).padStart(2, '0')}-${String(fechaFEP.getMonth() + 1).padStart(2, '0')}-${fechaFEP.getFullYear()}`;
            const horaFEP = `${String(Math.floor(Math.random() * 10) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
            
            eventos.push({
                evento: 'Fiscalización Programada',
                fechaHora: `${fechaFEPStr} ${horaFEP}`,
                funcionario: 'Jefe de Grupo',
                documento: `Plan Fiscalización #${Math.floor(Math.random() * 1000) + 3000}`
            });
        }
        
        // Agregar evento final según el tipo de acción
        const fechaFinal = new Date(fechaObj);
        fechaFinal.setDate(fechaFinal.getDate() + (accion.includes('FEP') ? 15 : 3));
        const fechaFinalStr = `${String(fechaFinal.getDate()).padStart(2, '0')}-${String(fechaFinal.getMonth() + 1).padStart(2, '0')}-${fechaFinal.getFullYear()}`;
        const horaFinal = `${String(Math.floor(Math.random() * 10) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
        
        let eventoFinal;
        if (decision.includes('Ha lugar')) {
            eventoFinal = 'Devolución Aprobada';
        } else if (decision.includes('No Ha lugar') || decision.includes('Denegatoria')) {
            eventoFinal = 'Devolución Rechazada';
        } else if (accion === 'Ver Resolución') {
            eventoFinal = 'Resolución Emitida';
        } else {
            eventoFinal = 'Resolución Emitida';
        }
        
        eventos.push({
            evento: eventoFinal,
            fechaHora: `${fechaFinalStr} ${horaFinal}`,
            funcionario: 'Sistema',
            documento: `Notificación #${Math.floor(Math.random() * 1000) + 7000}`
        });
        
        // Ordenar eventos por fecha (más reciente primero)
        eventos.sort((a, b) => {
            const fechaA = a.fechaHora.split(' ')[0].split('-').reverse().join('-') + ' ' + a.fechaHora.split(' ')[1];
            const fechaB = b.fechaHora.split(' ')[0].split('-').reverse().join('-') + ' ' + b.fechaHora.split(' ')[1];
            return new Date(fechaB) - new Date(fechaA);
        });
        
        // Ocultar indicador de carga
        loadingIndicator.classList.remove('show');
        
        // Agregar eventos al historial
        eventos.forEach(evento => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${evento.evento}</td>
                <td>${evento.fechaHora}</td>
                <td>${evento.funcionario}</td>
                <td>${evento.documento}</td>
            `;
            // Añadir con un ligero retraso para efecto visual
            setTimeout(() => {
                tbody.appendChild(tr);
                tr.style.animation = 'fadeIn 0.3s ease-out';
            }, Math.random() * 200);
        });
    }, loadingTime);
}

// -----------------------------------------------
// 3. INICIALIZACIÓN Y EVENTOS DEL DOCUMENTO
// -----------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('detailPopup');
    const popupContainer = popup.querySelector('.popup-container');
    
    // -----------------------------------------------
    // 3.1 EVENTOS DE INTERACCIÓN CON EL POPUP
    // -----------------------------------------------
    
    // Agregar evento para cerrar el popup al hacer clic en el fondo
    popup.addEventListener('click', function(e) {
        if (e.target === this) {
            closeDetailPopup();
        }
    });
    
    // -----------------------------------------------
    // 3.2 GESTIÓN DE ACCESIBILIDAD Y NAVEGACIÓN
    // -----------------------------------------------
    
    // Manejar la navegación por teclado para accesibilidad
    popup.addEventListener('keydown', function(e) {
        // Cerrar el popup con la tecla Escape
        if (e.key === 'Escape') {
            closeDetailPopup();
        }
        
        // Evitar que el foco salga del popup mientras está abierto
        if (e.key === 'Tab') {
            const focusableElements = popupContainer.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) { // shift+tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
    
    // -----------------------------------------------
    // 3.3 CONFIGURACIÓN DE BOTONES DE ACCIÓN
    // -----------------------------------------------
    
    // Agregar eventos a todos los botones de acción "Ver" y "Revisar"
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        // Solo agregar evento a los botones "Ver" o "Revisar" que no tengan ya un manejador onclick
        const buttonText = button.textContent.trim();
        if ((buttonText === 'Ver' || buttonText === 'Revisar') && !button.getAttribute('onclick')) {
            button.addEventListener('click', function() {
                // Obtener datos de la fila para este botón
                const row = this.closest('tr');
                const cells = row.querySelectorAll('td');
                
                let tipoSolicitud, accion, fechaSolicitud, folio, rutFuncionario, nombreFuncionario, decision, montoAutorizado;
                
                // -----------------------------------------------
                // 3.3.1 EXTRACCIÓN DE DATOS SEGÚN TIPO DE TABLA
                // -----------------------------------------------
                
                // Verificar en qué tabla estamos (cada tabla tiene diferente estructura)
                const tableId = this.closest('.sub-tab-content')?.id;
                
                if (tableId === 'contentConfirmacionesPendientes' || tableId === 'contentConfirmacionesRealizadas') {
                    // Tabla de confirmaciones
                    accion = cells[0].textContent.trim();
                    fechaSolicitud = cells[1].textContent.trim();
                    rutFuncionario = cells[2].textContent.trim();
                    nombreFuncionario = cells[3].textContent.trim();
                    tipoSolicitud = cells[4].textContent.trim();
                    folio = cells[7].textContent.trim();
                    decision = cells[8].textContent.trim();
                    montoAutorizado = cells[9].textContent.trim();
                } else if (tableId === 'contentResolucionesFirmadas') {
                    // Tabla de resoluciones firmadas
                    const nroResolucion = cells[0].textContent.trim();
                    fechaSolicitud = cells[1].textContent.trim();
                    rutFuncionario = cells[6].textContent.trim();  // Funcionario Responsable
                    nombreFuncionario = cells[6].textContent.trim();
                    tipoSolicitud = cells[4].textContent.trim();   // Tipo
                    folio = nroResolucion;
                    decision = cells[4].textContent.trim();        // Tipo como decisión
                    montoAutorizado = cells[5].textContent.trim(); // Monto
                    accion = 'Ver Resolución';
                } else if (tableId === 'contentSubResoluciones') {
                    // Tabla de resoluciones pendientes
                    const nroResolucion = cells[0].textContent.trim();
                    fechaSolicitud = cells[1].textContent.trim();
                    rutFuncionario = cells[6].textContent.trim();  // Funcionario Asignado
                    nombreFuncionario = cells[6].textContent.trim();
                    tipoSolicitud = cells[4].textContent.trim();   // Tipo
                    folio = nroResolucion;
                    decision = cells[5].textContent.trim();        // Estado
                    montoAutorizado = '0'; // No disponible en esta vista
                    accion = 'Revisar Resolución';
                } else if (this.closest('tbody')) {
                    // Si estamos en una tabla pero no podemos identificar la sección por ID,
                    // intentar extraer los datos según la posición de las columnas de la tabla específica
                    const headerRow = this.closest('table').querySelector('thead tr');
                    const headers = headerRow ? Array.from(headerRow.querySelectorAll('th')).map(th => th.textContent.trim()) : [];
                    
                    // Función para obtener el valor de una celda según el encabezado
                    const getCellValue = (headerName) => {
                        const index = headers.findIndex(h => h.includes(headerName));
                        return index !== -1 ? cells[index].textContent.trim() : '';
                    };
                    
                    // Extraer datos basados en los encabezados
                    accion = buttonText === 'Revisar' ? 'Revisar Documento' : 'Ver Detalle';
                    fechaSolicitud = getCellValue('Fecha') || new Date().toLocaleDateString('es-CL').split('/').join('-');
                    rutFuncionario = getCellValue('RUT Funcionario') || getCellValue('Funcionario');
                    nombreFuncionario = getCellValue('Nombre Funcionario') || getCellValue('Funcionario');
                    tipoSolicitud = getCellValue('Tipo') || getCellValue('Solicitud') || 'Documento';
                    folio = getCellValue('Folio') || getCellValue('Resolución') || getCellValue('Nº');
                    decision = getCellValue('Decisión') || getCellValue('Estado') || '';
                    montoAutorizado = getCellValue('Monto') || '0';
                } else {
                    // Si no podemos identificar la tabla, usar valores genéricos
                    tipoSolicitud = 'Solicitud';
                    accion = buttonText === 'Revisar' ? 'Revisar Documento' : 'Ver Detalle';
                    fechaSolicitud = new Date().toLocaleDateString('es-CL').split('/').join('-');
                    folio = 'N/A';
                    rutFuncionario = 'N/A';
                    nombreFuncionario = 'N/A';
                    decision = 'N/A';
                    montoAutorizado = '0';
                }
                
                // -----------------------------------------------
                // 3.3.2 GENERACIÓN DE COMENTARIOS SEGÚN DECISIÓN
                // -----------------------------------------------
                
                // Generar comentarios simulados basados en el tipo de solicitud y decisión
                let comentarios = 'No hay comentarios registrados para esta solicitud.';
                
                if (decision.includes('Ha lugar en parte')) {
                    comentarios = `Se autoriza parcialmente la solicitud debido a inconsistencias en la documentación presentada. El monto autorizado es de $${formatearMonto(montoAutorizado)}.`;
                } else if (decision.includes('Ha lugar')) {
                    comentarios = `Se autoriza la solicitud en su totalidad. El monto autorizado es de $${formatearMonto(montoAutorizado)}.`;
                } else if (decision.includes('No Ha lugar') || decision.includes('Denegatoria')) {
                    comentarios = 'Se rechaza la solicitud debido a inconsistencias graves en la documentación presentada y/o incumplimiento de requisitos fundamentales.';
                } else if (decision.includes('Pendiente')) {
                    comentarios = 'Este documento está pendiente de revisión. Por favor, revise los detalles y complete el proceso correspondiente.';
                }
                
                // Abrir el popup con los datos
                openDetailPopup(
                    tipoSolicitud,
                    accion,
                    fechaSolicitud,
                    folio,
                    rutFuncionario,
                    nombreFuncionario,
                    decision,
                    montoAutorizado,
                    comentarios
                );
            });
        }
    });
});
