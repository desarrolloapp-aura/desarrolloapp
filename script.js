// Asignación de proveedores por evaluador
// Cada evaluador tiene una lista específica de proveedores asignados
const asignacionProveedores = {
    'Exequiel Ledezma': {
        PRODUCTO: ['PRODALAM', 'APRO', 'SERVICIOS 23', 'RECOMIN', 'PROSEV', 'TUBIX', 'LET RIVEROS', 'DYFAR'],
        SERVICIO: []
    },
    'Pablo León': {
        PRODUCTO: ['SKAVA', 'MANANTIAL', 'PRISA', 'LUKSIC', 'NORMET', 'OFIGRAPH', 'MARSELLA', 'OVIEDO', 'SEGURYCEL'],
        SERVICIO: []
    },
    'Julio Quintero': {
        PRODUCTO: ['ADASME', 'BCM SERVICIOS', 'MAQUIMAL', 'ROBOCON'],
        SERVICIO: []
    },
    'Herve Guerrero': {
        PRODUCTO: ['APEX', 'DERCOMAQ', 'PERFOMEX', 'SALFA', 'FILTER'],
        SERVICIO: []
    },
    'Felipe Velazquez': {
        PRODUCTO: ['ARTEMETALICA', 'EQ. MINEROS', 'RCR', 'TOTAL CHILE'],
        SERVICIO: []
    },
    'Freddy Marquez': {
        PRODUCTO: ['AS COMPUTACION', 'IT CONS'],
        SERVICIO: []
    },
    'Faviola Parraguez': {
        PRODUCTO: [],
        SERVICIO: ['SEBASTIAN CARTAGENA']
    },
    'Hernán Opazo': {
        PRODUCTO: [],
        SERVICIO: ['RENTOKIL', 'CLIMA IDEAL', 'SEGURIDAD MMC']
    },
    'Ramón Cabrera': {
        PRODUCTO: [],
        SERVICIO: ['AMYSA']
    },
    'Manuel Bustamante': {
        PRODUCTO: [],
        SERVICIO: ['TRANSBUS', 'ESTAFETA']
    },
    'Magdalena Avendaño': {
        PRODUCTO: [],
        SERVICIO: ['ALTO IMPACTO']
    },
    'Patricia Torres': {
        PRODUCTO: [],
        SERVICIO: ['TRANSPORTE ARANGUIZ']
    },
    'Leandro Sánchez': {
        PRODUCTO: [],
        SERVICIO: ['SISA']
    },
    'Danitza Meneses': {
        PRODUCTO: [],
        SERVICIO: ['XTREME']
    },
    'Cintia Salas': {
        PRODUCTO: [],
        SERVICIO: ['SERVISAN']
    },
    'Sebastián Rodríguez': {
        PRODUCTO: [],
        SERVICIO: ['GLOBAL PARTNERS']
    },
    'Dorca Núñez': {
        PRODUCTO: [],
        SERVICIO: ['RECICLAJE ECOTRANS', 'RECYCLING']
    },
    'José Cárdenas': {
        PRODUCTO: [],
        SERVICIO: ['BUREAU VERITAS']
    },
    'Matías Espinoza': {
        PRODUCTO: ['TUBIX', 'OFIGRAPH', 'MANANTIAL', 'DYFAR', 'RECOMIN', 'PROSEV', 'LET RIVEROS'],
        SERVICIO: []
    },
    'Daniel Tamayo': {
        PRODUCTO: ['TOTAL CHILE', 'FILTER', 'ARTEMETALICA', 'RCR', 'SALFA'],
        SERVICIO: []
    },
    'Adrián Paredes': {
        PRODUCTO: ['APRO', 'PRISA', 'SEGURYCEL', 'SKAVA', 'LUKSIC', 'APEX', 'MAESTRANZA SAN MIGUEL'],
        SERVICIO: []
    },
    'Víctor González': {
        PRODUCTO: ['NORMET', 'ADASME', 'BCM SERVICIOS', 'ROBOCON'],
        SERVICIO: []
    }
};

// Lista de evaluadores
const evaluadores = Object.keys(asignacionProveedores);

// Función auxiliar para obtener proveedores de un evaluador por tipo
function obtenerProveedoresPorEvaluador(evaluador, tipo) {
    if (!asignacionProveedores[evaluador]) {
        return [];
    }
    return asignacionProveedores[evaluador][tipo] || [];
}

// Ítems de evaluación para PRODUCTO
const itemsProducto = [
    { nombre: 'Condiciones Financieras de Pago', ponderacion: 10 },
    { nombre: 'Información de certificación o implementación respecto a alguna ISO', ponderacion: 4 },
    { nombre: 'Comunicación fluida con el cliente', ponderacion: 4 },
    { nombre: 'Reacción frente a nuevos requerimientos', ponderacion: 5 },
    { nombre: 'Información técnica de los productos (Calidad, Medio Ambiente y Seguridad)', ponderacion: 2 },
    { nombre: 'Cumplimiento de plazos de entrega, horarios de bodega y documentación', ponderacion: 65 },
    { nombre: 'Certificación del producto del proveedor', ponderacion: 10 }
];

// Ítems de evaluación para SERVICIO
const itemsServicio = [
    { nombre: 'Comportamiento seguro durante la prestación del servicio', ponderacion: 10 },
    { nombre: 'Cumplimiento de la oportunidad en la realización del servicio', ponderacion: 33 },
    { nombre: 'Calidad del servicio', ponderacion: 33 },
    { nombre: 'Comunicación fluida con el prestador del servicio', ponderacion: 7 },
    { nombre: 'Reacción del prestador frente a nuevos requerimientos', ponderacion: 10 },
    { nombre: 'Publicación del estado en regla de las partes relevantes y otra información relevante para el usuario AURA', ponderacion: 7 }
];

// Escala de respuesta
const escalaRespuesta = [25, 50, 75, 100];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    inicializarEvaluadores();
    inicializarEventos();
});

function inicializarEvaluadores() {
    const selectEvaluador = document.getElementById('evaluador');
    evaluadores.forEach(evaluador => {
        const option = document.createElement('option');
        option.value = evaluador;
        option.textContent = evaluador;
        selectEvaluador.appendChild(option);
    });
}

function inicializarEventos() {
    // Cambio de evaluador
    document.getElementById('evaluador').addEventListener('change', function() {
        actualizarProveedores();
    });

    // Cambio de tipo de proveedor
    document.querySelectorAll('input[name="tipoProveedor"]').forEach(radio => {
        radio.addEventListener('change', function() {
            actualizarProveedores();
        });
    });

    // Cambio de proveedor
    document.getElementById('proveedor').addEventListener('change', function() {
        mostrarItemsEvaluacion();
        mostrarCampoCorreo();
    });

    // Cambio en respuestas
    document.addEventListener('change', function(e) {
        if (e.target.name && e.target.name.startsWith('item_')) {
            calcularResultado();
            // Actualizar estado visual de los labels
            actualizarEstadoRadioButtons(e.target);
        }
    });
    
    // Actualizar estado visual cuando se carga la página
    document.addEventListener('click', function(e) {
        if (e.target.type === 'radio' && e.target.name.startsWith('item_')) {
            actualizarEstadoRadioButtons(e.target);
        }
    });

    // Envío del formulario
    document.getElementById('evaluationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarEvaluacion();
    });

    // Limpiar formulario
    document.getElementById('limpiarBtn').addEventListener('click', function() {
        limpiarFormulario();
    });

    // Ver evaluaciones
    document.getElementById('verEvaluacionesBtn').addEventListener('click', function() {
        mostrarEvaluaciones();
    });

    // Descargar Excel desde modal
    document.getElementById('descargarExcelModalBtn').addEventListener('click', function() {
        descargarExcel();
    });

    // Cerrar modal
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('modalEvaluaciones').style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        const modal = document.getElementById('modalEvaluaciones');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function actualizarProveedores() {
    const evaluador = document.getElementById('evaluador').value;
    const tipoProveedor = document.querySelector('input[name="tipoProveedor"]:checked');
    const selectProveedor = document.getElementById('proveedor');
    
    // Limpiar opciones
    selectProveedor.innerHTML = '<option value="">-- Seleccione un proveedor --</option>';
    
    if (!evaluador) {
        selectProveedor.innerHTML = '<option value="">-- Primero seleccione un evaluador --</option>';
        // Ocultar items y correo
        document.getElementById('itemsSection').style.display = 'none';
        document.getElementById('resultSection').style.display = 'none';
        document.getElementById('correoSection').style.display = 'none';
        document.getElementById('correoProveedor').value = '';
        return;
    }
    
    if (tipoProveedor) {
        // Obtener evaluaciones guardadas
        const evaluaciones = JSON.parse(localStorage.getItem('evaluaciones') || '[]');
        
        // Obtener proveedores ya evaluados por este evaluador y tipo
        const proveedoresEvaluados = new Set();
        evaluaciones.forEach(eval => {
            if (eval.evaluador === evaluador && eval.tipoProveedor === tipoProveedor.value) {
                proveedoresEvaluados.add(eval.proveedor);
            }
        });
        
        // Obtener lista de proveedores asignados a este evaluador según el tipo
        const proveedoresAsignados = obtenerProveedoresPorEvaluador(evaluador, tipoProveedor.value);
        
        if (proveedoresAsignados.length === 0) {
            selectProveedor.innerHTML = `<option value="">-- Este evaluador no tiene proveedores asignados de tipo ${tipoProveedor.value} --</option>`;
        } else {
            // Filtrar proveedores que aún no han sido evaluados
            const proveedoresDisponibles = proveedoresAsignados.filter(proveedor => !proveedoresEvaluados.has(proveedor));
            
            if (proveedoresDisponibles.length === 0) {
                selectProveedor.innerHTML = '<option value="">-- Ya ha evaluado todos los proveedores asignados de este tipo --</option>';
            } else {
                proveedoresDisponibles.forEach(proveedor => {
                    const option = document.createElement('option');
                    option.value = proveedor;
                    option.textContent = proveedor;
                    selectProveedor.appendChild(option);
                });
            }
        }
    }
    
    // Ocultar items y correo
    document.getElementById('itemsSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('correoSection').style.display = 'none';
    document.getElementById('correoProveedor').value = '';
}

function actualizarEstadoRadioButtons(radioSeleccionado) {
    // Remover clase selected de todos los labels del mismo grupo
    const nombreGrupo = radioSeleccionado.name;
    document.querySelectorAll(`input[name="${nombreGrupo}"]`).forEach(radio => {
        radio.closest('label').classList.remove('selected');
    });
    
    // Agregar clase selected al label del radio seleccionado
    if (radioSeleccionado.checked) {
        radioSeleccionado.closest('label').classList.add('selected');
    }
}

function mostrarCampoCorreo() {
    const proveedor = document.getElementById('proveedor').value;
    if (proveedor) {
        document.getElementById('correoSection').style.display = 'block';
    } else {
        document.getElementById('correoSection').style.display = 'none';
        document.getElementById('correoProveedor').value = '';
    }
}

function mostrarItemsEvaluacion() {
    const tipoProveedor = document.querySelector('input[name="tipoProveedor"]:checked');
    const proveedor = document.getElementById('proveedor').value;
    
    if (!tipoProveedor || !proveedor) {
        return;
    }
    
    const items = tipoProveedor.value === 'PRODUCTO' ? itemsProducto : itemsServicio;
    const container = document.getElementById('itemsContainer');
    const title = document.getElementById('itemsTitle');
    
    title.textContent = tipoProveedor.value === 'PRODUCTO' ? '4. Ítems de Evaluación - PRODUCTO' : '4. Ítems de Evaluación - SERVICIO';
    
    container.innerHTML = '';
    
    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-evaluacion';
        
        const label = document.createElement('label');
        label.innerHTML = `${item.nombre} <span class="ponderacion">(${item.ponderacion}%)</span>`;
        
        const radioGroup = document.createElement('div');
        radioGroup.className = 'radio-options';
        
        escalaRespuesta.forEach(porcentaje => {
            const labelRadio = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `item_${index}`;
            input.value = porcentaje;
            input.required = true;
            
            const span = document.createElement('span');
            span.textContent = `${porcentaje}%`;
            
            labelRadio.appendChild(input);
            labelRadio.appendChild(span);
            radioGroup.appendChild(labelRadio);
        });
        
        itemDiv.appendChild(label);
        itemDiv.appendChild(radioGroup);
        container.appendChild(itemDiv);
    });
    
    document.getElementById('itemsSection').style.display = 'block';
}

function calcularResultado() {
    const tipoProveedor = document.querySelector('input[name="tipoProveedor"]:checked');
    if (!tipoProveedor) return;
    
    const items = tipoProveedor.value === 'PRODUCTO' ? itemsProducto : itemsServicio;
    let resultadoPonderado = 0;
    let todosCompletos = true;
    
    items.forEach((item, index) => {
        const respuesta = document.querySelector(`input[name="item_${index}"]:checked`);
        if (!respuesta) {
            todosCompletos = false;
            return;
        }
        
        const porcentaje = parseInt(respuesta.value);
        resultadoPonderado += (porcentaje * item.ponderacion) / 100;
    });
    
    if (todosCompletos) {
        document.getElementById('resultadoFinal').textContent = resultadoPonderado.toFixed(2) + '%';
        document.getElementById('resultSection').style.display = 'block';
    } else {
        document.getElementById('resultSection').style.display = 'none';
    }
}

function guardarEvaluacion() {
    const evaluador = document.getElementById('evaluador').value;
    const tipoProveedor = document.querySelector('input[name="tipoProveedor"]:checked');
    const proveedor = document.getElementById('proveedor').value;
    const correoProveedor = document.getElementById('correoProveedor').value;
    const resultadoFinal = document.getElementById('resultadoFinal').textContent;
    
    if (!evaluador || !tipoProveedor || !proveedor || !correoProveedor || resultadoFinal === '0%') {
        alert('Por favor complete todos los campos y responda todas las preguntas.');
        return;
    }
    
    const items = tipoProveedor.value === 'PRODUCTO' ? itemsProducto : itemsServicio;
    const respuestas = {};
    
    items.forEach((item, index) => {
        const respuesta = document.querySelector(`input[name="item_${index}"]:checked`);
        if (respuesta) {
            respuestas[item.nombre] = parseInt(respuesta.value);
        }
    });
    
    const evaluacion = {
        id: Date.now(),
        evaluador: evaluador,
        proveedor: proveedor,
        correoProveedor: correoProveedor,
        tipoProveedor: tipoProveedor.value,
        respuestas: respuestas,
        resultadoFinal: parseFloat(resultadoFinal.replace('%', '')),
        fecha: new Date().toLocaleString('es-ES')
    };
    
    // Guardar en localStorage
    let evaluaciones = JSON.parse(localStorage.getItem('evaluaciones') || '[]');
    evaluaciones.push(evaluacion);
    localStorage.setItem('evaluaciones', JSON.stringify(evaluaciones));
    
    alert('Evaluación guardada exitosamente.');
    limpiarFormulario();
}

function limpiarFormulario() {
    document.getElementById('evaluationForm').reset();
    document.getElementById('proveedor').innerHTML = '<option value="">-- Primero seleccione el tipo de proveedor --</option>';
    document.getElementById('itemsContainer').innerHTML = '';
    document.getElementById('itemsSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('correoSection').style.display = 'none';
    document.getElementById('correoProveedor').value = '';
}

function eliminarEvaluacion(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta evaluación?')) {
        return;
    }
    
    let evaluaciones = JSON.parse(localStorage.getItem('evaluaciones') || '[]');
    evaluaciones = evaluaciones.filter(e => e.id !== id);
    localStorage.setItem('evaluaciones', JSON.stringify(evaluaciones));
    
    // Refrescar la lista
    mostrarEvaluaciones();
    
    alert('Evaluación eliminada exitosamente.');
}

function mostrarEvaluaciones() {
    const evaluaciones = JSON.parse(localStorage.getItem('evaluaciones') || '[]');
    const container = document.getElementById('evaluacionesList');
    const botonesContainer = document.getElementById('botonesProveedores');
    
    if (evaluaciones.length === 0) {
        container.innerHTML = '<p>No hay evaluaciones guardadas.</p>';
        botonesContainer.innerHTML = '';
    } else {
        // Obtener proveedores únicos
        const proveedoresUnicos = [...new Set(evaluaciones.map(e => e.proveedor))].sort();
        
        // Crear botones para cada proveedor
        botonesContainer.innerHTML = '';
        proveedoresUnicos.forEach(proveedor => {
            const btn = document.createElement('button');
            btn.className = 'btn-excel-individual';
            btn.textContent = `📄 ${proveedor}`;
            btn.onclick = () => descargarExcelPorProveedor(proveedor);
            botonesContainer.appendChild(btn);
        });
        
        // Mostrar evaluaciones
        container.innerHTML = '';
        evaluaciones.sort((a, b) => {
            // Ordenar por proveedor, luego por fecha (más reciente primero)
            if (a.proveedor !== b.proveedor) {
                return a.proveedor.localeCompare(b.proveedor);
            }
            return new Date(b.fecha) - new Date(a.fecha);
        });
        
        evaluaciones.forEach(eval => {
            const div = document.createElement('div');
            div.className = 'evaluacion-item';
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';
            div.style.padding = '15px';
            
            const infoDiv = document.createElement('div');
            infoDiv.style.flex = '1';
            infoDiv.innerHTML = `
                <strong>${eval.proveedor}</strong> - ${eval.tipoProveedor} | ${eval.fecha} | Resultado: ${eval.resultadoFinal.toFixed(2)}%
            `;
            
            const btnEliminar = document.createElement('button');
            btnEliminar.className = 'btn-eliminar';
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = () => eliminarEvaluacion(eval.id);
            
            div.appendChild(infoDiv);
            div.appendChild(btnEliminar);
            container.appendChild(div);
        });
    }
    
    document.getElementById('modalEvaluaciones').style.display = 'block';
}

function descargarExcel() {
    const evaluaciones = JSON.parse(localStorage.getItem('evaluaciones') || '[]');
    
    if (evaluaciones.length === 0) {
        alert('No hay evaluaciones guardadas para descargar.');
        return;
    }
    
    // Ordenar: primero por proveedor, luego por fecha (más reciente primero)
    evaluaciones.sort((a, b) => {
        if (a.proveedor !== b.proveedor) {
            return a.proveedor.localeCompare(b.proveedor);
        }
        return new Date(b.fecha) - new Date(a.fecha);
    });
    
    crearYDescargarExcel(evaluaciones, 'Todas las Evaluaciones');
}

function descargarExcelPorProveedor(nombreProveedor) {
    const evaluaciones = JSON.parse(localStorage.getItem('evaluaciones') || '[]');
    const evaluacionesProveedor = evaluaciones.filter(e => e.proveedor === nombreProveedor);
    
    if (evaluacionesProveedor.length === 0) {
        alert(`No hay evaluaciones para el proveedor ${nombreProveedor}.`);
        return;
    }
    
    // Ordenar por fecha (más reciente primero)
    evaluacionesProveedor.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    crearYDescargarExcel(evaluacionesProveedor, nombreProveedor);
}

function crearYDescargarExcel(evaluaciones, titulo) {
    // Preparar datos para Excel
    const datosExcel = [];
    
    evaluaciones.forEach(eval => {
        const items = eval.tipoProveedor === 'PRODUCTO' ? itemsProducto : itemsServicio;
        const fila = {
            'Fecha': eval.fecha,
            'Evaluador': eval.evaluador,
            'Proveedor': eval.proveedor,
            'Correo Proveedor': eval.correoProveedor || 'No especificado',
            'Tipo': eval.tipoProveedor,
            'Resultado Final (%)': eval.resultadoFinal.toFixed(2)
        };
        
        // Agregar respuestas por ítem en orden
        items.forEach(item => {
            const respuesta = eval.respuestas[item.nombre] || 0;
            fila[`${item.nombre} (${item.ponderacion}%)`] = respuesta + '%';
        });
        
        datosExcel.push(fila);
    });
    
    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExcel);
    
    // Ajustar ancho de columnas
    const colWidths = [];
    const headers = Object.keys(datosExcel[0]);
    headers.forEach(header => {
        colWidths.push({ wch: Math.max(header.length, 20) });
    });
    ws['!cols'] = colWidths;
    
    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Evaluaciones');
    
    // Generar nombre de archivo
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = titulo === 'Todas las Evaluaciones' 
        ? `Evaluaciones_TOTAL_${fecha}.xlsx`
        : `Evaluacion_${titulo.replace(/\s+/g, '_')}_${fecha}.xlsx`;
    
    // Descargar archivo
    XLSX.writeFile(wb, nombreArchivo);
    
    alert(`Se descargaron ${evaluaciones.length} evaluación(es) en Excel.`);
}

function generarContenidoCorreo(evaluacion) {
    const items = evaluacion.tipoProveedor === 'PRODUCTO' ? itemsProducto : itemsServicio;
    
    let contenido = `Estimado/a Proveedor ${evaluacion.proveedor},\n\n`;
    contenido += `Le informamos los resultados de su evaluación realizada el ${evaluacion.fecha}.\n\n`;
    contenido += `INFORMACIÓN GENERAL:\n`;
    contenido += `${'='.repeat(60)}\n`;
    contenido += `Evaluador: ${evaluacion.evaluador}\n`;
    contenido += `Tipo de Proveedor: ${evaluacion.tipoProveedor}\n`;
    contenido += `Fecha de Evaluación: ${evaluacion.fecha}\n`;
    contenido += `${'='.repeat(60)}\n\n`;
    
    contenido += `DETALLE DE LA EVALUACIÓN POR ÍTEMS:\n`;
    contenido += `${'='.repeat(60)}\n\n`;
    
    // Crear tabla ordenada
    items.forEach((item, index) => {
        const respuesta = evaluacion.respuestas[item.nombre] || 0;
        contenido += `${index + 1}. ${item.nombre}\n`;
        contenido += `   Ponderación: ${item.ponderacion}%\n`;
        contenido += `   Calificación: ${respuesta}%\n`;
        contenido += `   Puntuación Ponderada: ${((respuesta * item.ponderacion) / 100).toFixed(2)}%\n\n`;
    });
    
    contenido += `${'='.repeat(60)}\n`;
    contenido += `RESULTADO FINAL PONDERADO: ${evaluacion.resultadoFinal.toFixed(2)}%\n`;
    contenido += `${'='.repeat(60)}\n\n`;
    
    contenido += `NOTA: Este resultado se calcula ponderando cada ítem según su importancia.\n\n`;
    contenido += `Agradecemos su atención y quedamos a disposición para cualquier consulta.\n\n`;
    contenido += `Saludos cordiales,\n`;
    contenido += `Equipo de Evaluación de Proveedores`;
    
    return contenido;
}

function enviarCorreoIndividual(idEvaluacion) {
    const evaluaciones = JSON.parse(localStorage.getItem('evaluaciones') || '[]');
    const evaluacion = evaluaciones.find(e => e.id === idEvaluacion);
    
    if (!evaluacion) {
        alert('Evaluación no encontrada.');
        return;
    }
    
    if (!evaluacion.correoProveedor) {
        alert('No se ha especificado correo electrónico para este proveedor.');
        return;
    }
    
    // Primero generar y descargar el Excel para este proveedor
    const evaluacionesProveedor = [evaluacion];
    evaluacionesProveedor.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    // Crear Excel temporalmente
    const datosExcel = [];
    const items = evaluacion.tipoProveedor === 'PRODUCTO' ? itemsProducto : itemsServicio;
    const fila = {
        'Fecha': evaluacion.fecha,
        'Evaluador': evaluacion.evaluador,
        'Proveedor': evaluacion.proveedor,
        'Correo Proveedor': evaluacion.correoProveedor || 'No especificado',
        'Tipo': evaluacion.tipoProveedor,
        'Resultado Final (%)': evaluacion.resultadoFinal.toFixed(2)
    };
    
    items.forEach(item => {
        const respuesta = evaluacion.respuestas[item.nombre] || 0;
        fila[`${item.nombre} (${item.ponderacion}%)`] = respuesta + '%';
    });
    datosExcel.push(fila);
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExcel);
    const colWidths = [];
    const headers = Object.keys(datosExcel[0]);
    headers.forEach(header => {
        colWidths.push({ wch: Math.max(header.length, 20) });
    });
    ws['!cols'] = colWidths;
    XLSX.utils.book_append_sheet(wb, ws, 'Evaluación');
    
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Evaluacion_${evaluacion.proveedor.replace(/\s+/g, '_')}_${fecha}.xlsx`;
    
    // Descargar Excel
    XLSX.writeFile(wb, nombreArchivo);
    
    // Preparar correo
    const asunto = `Evaluación de Proveedor - ${evaluacion.proveedor} - ${evaluacion.fecha}`;
    let cuerpo = generarContenidoCorreo(evaluacion);
    cuerpo += `\n\nNOTA: Se ha generado un archivo Excel con el detalle completo de su evaluación.`;
    cuerpo += `\nEl archivo "${nombreArchivo}" se ha descargado automáticamente y puede adjuntarlo a este correo.`;
    
    const mailtoLink = `mailto:${evaluacion.correoProveedor}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    
    setTimeout(() => {
        window.location.href = mailtoLink;
    }, 500);
}

function enviarCorreosProveedores() {
    const evaluaciones = JSON.parse(localStorage.getItem('evaluaciones') || '[]');
    
    if (evaluaciones.length === 0) {
        alert('No hay evaluaciones guardadas.');
        return;
    }
    
    // Filtrar evaluaciones con correo
    const evaluacionesConCorreo = evaluaciones.filter(e => e.correoProveedor);
    
    if (evaluacionesConCorreo.length === 0) {
        alert('No hay evaluaciones con correo electrónico especificado.');
        return;
    }
    
    // Ordenar por fecha (más reciente primero)
    evaluacionesConCorreo.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    // Agrupar por proveedor (última evaluación de cada proveedor)
    const proveedoresUnicos = {};
    evaluacionesConCorreo.forEach(eval => {
        if (!proveedoresUnicos[eval.proveedor] || new Date(eval.fecha) > new Date(proveedoresUnicos[eval.proveedor].fecha)) {
            proveedoresUnicos[eval.proveedor] = eval;
        }
    });
    
    const evaluacionesUnicas = Object.values(proveedoresUnicos);
    
    if (evaluacionesUnicas.length === 0) {
        alert('No hay evaluaciones para enviar.');
        return;
    }
    
    // Confirmar envío
    const confirmar = confirm(`Se enviarán correos a ${evaluacionesUnicas.length} proveedor(es).\n\nSe abrirá su cliente de correo para cada proveedor. ¿Desea continuar?`);
    
    if (!confirmar) {
        return;
    }
    
    // Enviar correos uno por uno con delay
    let indice = 0;
    function enviarSiguiente() {
        if (indice < evaluacionesUnicas.length) {
            const evaluacion = evaluacionesUnicas[indice];
            
            // Generar Excel para este proveedor
            const evaluacionesProveedor = evaluaciones.filter(e => e.proveedor === evaluacion.proveedor);
            evaluacionesProveedor.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            
            const datosExcel = [];
            evaluacionesProveedor.forEach(eval => {
                const items = eval.tipoProveedor === 'PRODUCTO' ? itemsProducto : itemsServicio;
                const fila = {
                    'Fecha': eval.fecha,
                    'Evaluador': eval.evaluador,
                    'Proveedor': eval.proveedor,
                    'Correo Proveedor': eval.correoProveedor || 'No especificado',
                    'Tipo': eval.tipoProveedor,
                    'Resultado Final (%)': eval.resultadoFinal.toFixed(2)
                };
                
                items.forEach(item => {
                    const respuesta = eval.respuestas[item.nombre] || 0;
                    fila[`${item.nombre} (${item.ponderacion}%)`] = respuesta + '%';
                });
                datosExcel.push(fila);
            });
            
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(datosExcel);
            const colWidths = [];
            const headers = Object.keys(datosExcel[0]);
            headers.forEach(header => {
                colWidths.push({ wch: Math.max(header.length, 20) });
            });
            ws['!cols'] = colWidths;
            XLSX.utils.book_append_sheet(wb, ws, 'Evaluaciones');
            
            const fecha = new Date().toISOString().split('T')[0];
            const nombreArchivo = `Evaluacion_${evaluacion.proveedor.replace(/\s+/g, '_')}_${fecha}.xlsx`;
            
            // Descargar Excel
            XLSX.writeFile(wb, nombreArchivo);
            
            // Preparar correo
            const asunto = `Evaluación de Proveedor - ${evaluacion.proveedor} - ${evaluacion.fecha}`;
            let cuerpo = generarContenidoCorreo(evaluacion);
            cuerpo += `\n\nNOTA: Se ha generado un archivo Excel con el detalle completo de su(s) evaluación(es).`;
            cuerpo += `\nEl archivo "${nombreArchivo}" se ha descargado automáticamente y puede adjuntarlo a este correo.`;
            
            const mailtoLink = `mailto:${evaluacion.correoProveedor}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
            
            // Abrir correo después de un pequeño delay para que se descargue el Excel
            setTimeout(() => {
                window.open(mailtoLink, '_blank');
            }, 500);
            
            indice++;
            
            // Esperar 3 segundos antes de enviar el siguiente (más tiempo para descargar Excel)
            if (indice < evaluacionesUnicas.length) {
                setTimeout(enviarSiguiente, 3000);
            } else {
                setTimeout(() => {
                    alert(`Se han generado ${evaluacionesUnicas.length} archivos Excel y abierto los correos correspondientes.`);
                }, 1000);
            }
        }
    }
    
    enviarSiguiente();
}

