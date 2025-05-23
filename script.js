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

/**
 * Controla el sistema de pestañas, mostrando el contenido de la pestaña seleccionada
 * y ocultando las demás
 * @param {string} contentId - ID del contenido de la pestaña a mostrar
 * @param {string} activeTabId - ID de la pestaña activa
 */
function openTab(contentId, activeTabId) {
    // Ocultar todos los contenidos de pestañas
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Desactivar todas las pestañas
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    // Mostrar el contenido seleccionado y activar la pestaña
    document.getElementById(contentId).classList.add('active');
    document.getElementById(activeTabId).classList.add('active');
    
    // Si es la pestaña de Mis Confirmaciones, y está visible la sub-pestaña de confirmaciones pendientes, calcular días pendientes
    if (contentId === 'contentMisConfirmaciones') {
        const subTabPendientes = document.getElementById('contentConfirmacionesPendientes');
        if (subTabPendientes && subTabPendientes.classList.contains('active')) {
            setTimeout(calcularDiasPendientes, 100);
        }
    }
}

/**
 * Controla el sistema de sub-pestañas, mostrando el contenido de la sub-pestaña seleccionada
 * y ocultando las demás, sin afectar la pestaña principal
 * @param {string} contentId - ID del contenido de la sub-pestaña a mostrar
 * @param {string} activeTabId - ID de la sub-pestaña activa
 * @param {string} parentContentId - ID del contenido de la pestaña padre
 */
function openSubTab(contentId, activeTabId, parentContentId) {
    // Solo procesar las sub-pestañas dentro de la pestaña padre activa
    const parentElement = document.getElementById(parentContentId);
    
    if (!parentElement) {
        console.error(`No se encontró el elemento padre con ID "${parentContentId}"`);
        return;
    }
    
    // Ocultar todos los contenidos de sub-pestañas
    const subTabContents = parentElement.getElementsByClassName('sub-tab-content');
    for (let i = 0; i < subTabContents.length; i++) {
        subTabContents[i].classList.remove('active');
    }
    
    // Desactivar todas las sub-pestañas
    const subTabButtons = parentElement.getElementsByClassName('sub-tab-button');
    for (let i = 0; i < subTabButtons.length; i++) {
        subTabButtons[i].classList.remove('active');
    }
    
    // Mostrar el contenido seleccionado y activar la sub-pestaña
    const contentElement = document.getElementById(contentId);
    const tabElement = document.getElementById(activeTabId);
    
    if (!contentElement) {
        console.error(`No se encontró el elemento de contenido con ID "${contentId}"`);
        return;
    }
    
    if (!tabElement) {
        console.error(`No se encontró el elemento de pestaña con ID "${activeTabId}"`);
        return;
    }
    
    contentElement.classList.add('active');
    tabElement.classList.add('active');
    
    // Si es la sub-pestaña de confirmaciones pendientes, calcular días pendientes
    if (contentId === 'contentConfirmacionesPendientes') {
        setTimeout(calcularDiasPendientes, 100);
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
    const rows = document.querySelectorAll('#contentConfirmacionesPendientes tbody tr');
    const hoy = new Date();

    rows.forEach(row => {
        const accionCell = row.querySelector('td:nth-child(1)');
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
        if (fechaSolicitudCell && diasPendientesCell && accionCell) {
            const accion = accionCell.textContent.trim();
            const fechaSolicitud = parseFecha(fechaSolicitudCell.textContent);
            
            // Si la acción es FEP o Decision 48 Horas-Dispone FEP, agregar 40 días, sino agregar 3 días
            const diasAdicionales = (accion === 'FEP' || accion === 'Decision 48 Horas-Dispone FEP') ? 40 : 3;
            fechaSolicitud.setDate(fechaSolicitud.getDate() + diasAdicionales);
            
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
// FUNCIONES DE SUBRROGANCIA
// ===============================================

/**
 * Formatea una fecha en formato YYYY-MM-DD a formato DD-MM-YYYY
 * @param {string} fechaStr - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha en formato DD-MM-YYYY
 */
function formatearFecha(fechaStr) {
    const [anio, mes, dia] = fechaStr.split('-');
    return `${dia}-${mes}-${anio}`;
}

/**
 * Guarda una subrrogancia y la muestra en el historial
 */
function guardarSubrrogancia() {
    // Obtener los valores del formulario
    const selectUsuario = document.querySelector('#contentSubrrogancias .form-group select');
    const inputFechaInicio = document.querySelector('#contentSubrrogancias .form-group input[type="date"]:first-of-type');
    const inputFechaTermino = document.querySelector('#contentSubrrogancias .form-group input[type="date"]:last-of-type');
    
    const usuarioSeleccionado = selectUsuario.options[selectUsuario.selectedIndex];
    const fechaInicio = inputFechaInicio.value;
    const fechaTermino = inputFechaTermino.value;
    
    // Validar que se hayan ingresado todos los datos
    if (!usuarioSeleccionado.value || !fechaInicio || !fechaTermino) {
        alert('Por favor complete todos los campos antes de guardar.');
        return;
    }
    
    // Validar que la fecha de término no sea anterior a la de inicio
    if (new Date(fechaTermino) < new Date(fechaInicio)) {
        alert('La fecha de término no puede ser anterior a la fecha de inicio.');
        return;
    }
    
    // Formatear las fechas para mostrar
    const fechaInicioFormateada = formatearFecha(fechaInicio);
    const fechaTerminoFormateada = formatearFecha(fechaTermino);
    
    // Mostrar mensaje de confirmación
    const confirmacion = confirm(
        `¿Confirma la asignación de subrrogancia con los siguientes datos?\n\n` +
        `Usuario: ${usuarioSeleccionado.text}\n` +
        `Fecha de inicio: ${fechaInicioFormateada}\n` +
        `Fecha de término: ${fechaTerminoFormateada}`
    );    
    if (confirmacion) {
        // Agregar al historial de subrrogancias
        const tablaHistorial = document.querySelector('#tablaHistorialSubrrogancias tbody');
        const hoy = new Date();
        const fechaIngreso = `${hoy.getDate().toString().padStart(2, '0')}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-${hoy.getFullYear()}`;
          // Calcular vigencia
        const esVigente = new Date(fechaTermino) >= hoy;
        const vigencia = esVigente ? 'Vigente' : 'No vigente';
        const claseVigencia = esVigente ? 'vigente' : 'no-vigente';
        
        // Crear nueva fila en la tabla de historial
        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td>${fechaIngreso}</td>
            <td>${usuarioSeleccionado.text}</td>
            <td>${fechaInicioFormateada}</td>
            <td>${fechaTerminoFormateada}</td>
            <td class="${claseVigencia}">${vigencia}</td>
            <td><button class="btn-eliminar">Eliminar</button></td>
        `;
        
        // Agregar evento de eliminación al botón
        const btnEliminar = nuevaFila.querySelector('.btn-eliminar');
        btnEliminar.addEventListener('click', function() {
            eliminarSubrrogancia(nuevaFila, usuarioSeleccionado.text, fechaInicioFormateada, fechaTerminoFormateada);
        });
        
        tablaHistorial.appendChild(nuevaFila);
        
        // Limpiar el formulario
        selectUsuario.selectedIndex = 0;
        inputFechaInicio.value = '';
        inputFechaTermino.value = '';
        
        alert('Subrrogancia guardada con éxito.');
    }
}

/**
 * Elimina una subrrogancia del historial después de mostrar un mensaje de confirmación
 * @param {HTMLElement} fila - La fila de la tabla a eliminar
 * @param {string} usuario - Nombre del usuario subrrogante
 * @param {string} fechaInicio - Fecha de inicio formateada
 * @param {string} fechaTermino - Fecha de término formateada
 */
function eliminarSubrrogancia(fila, usuario, fechaInicio, fechaTermino) {
    const confirmacion = confirm(
        `¿Está seguro que desea eliminar la siguiente subrrogancia?\n\n` +
        `Usuario: ${usuario}\n` +
        `Fecha de inicio: ${fechaInicio}\n` +
        `Fecha de término: ${fechaTermino}`
    );
    
    if (confirmacion) {
        fila.remove();
        alert('Subrrogancia eliminada con éxito.');
    }
}

// ===============================================
// INICIALIZACIÓN
// ===============================================

// Configuración inicial cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el sistema de pestañas y calcular días pendientes
    calcularDiasPendientes();
    
    // Inicialización de las pestañas activas por defecto
    const activeTabContent = document.querySelector('.tab-content.active');
    if (activeTabContent) {
        const activeSubTabContent = activeTabContent.querySelector('.sub-tab-content.active');
        const activeSubTabButton = activeTabContent.querySelector('.sub-tab-button.active');
        
        // Si hay sub-pestañas activas, asegurarse de que estén correctamente inicializadas
        if (activeSubTabContent && activeSubTabButton) {
            activeSubTabContent.style.display = 'block';
        }
    }
    
    // Asegurar que las pestañas funcionen correctamente
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contentId = this.getAttribute('data-target') || this.id.replace('tab', 'content');
            openTab(contentId, this.id);
        });
    });
    
    // Asegurar que las sub-pestañas funcionen correctamente
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    subTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Usar data-target si está disponible, o construir el ID desde el ID del botón
            const contentId = this.getAttribute('data-target') || this.id.replace('subTab', 'content');
            const parentContentId = this.closest('.tab-content').id;
            
            console.log(`Activando sub-pestaña: ${this.textContent}`);
            console.log(`ContentId: ${contentId}, ActiveTabId: ${this.id}, ParentContentId: ${parentContentId}`);
            
            openSubTab(contentId, this.id, parentContentId);
        });
    });
    
    // Configurar el botón de guardar subrrogancia
    const btnGuardarSubrrogancia = document.querySelector('.submit-button');
    if (btnGuardarSubrrogancia) {
        btnGuardarSubrrogancia.addEventListener('click', guardarSubrrogancia);
    }
    
    // Configurar botones de eliminar para ejemplos que ya existan en la tabla
    const botonesEliminar = document.querySelectorAll('#tablaHistorialSubrrogancias .btn-eliminar');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', function() {
            const fila = this.closest('tr');
            const celdas = fila.querySelectorAll('td');
            const usuario = celdas[1].textContent;
            const fechaInicio = celdas[2].textContent;
            const fechaTermino = celdas[3].textContent;
            eliminarSubrrogancia(fila, usuario, fechaInicio, fechaTermino);
        });
    });
});
