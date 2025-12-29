// Asignación de proveedores por evaluador (valores por defecto)
const asignacionProveedoresDefault = {
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

// Variables globales que se cargarán desde Supabase
let asignacionProveedores = asignacionProveedoresDefault;
let evaluadores = [];

// Cargar asignación de proveedores desde Supabase
async function cargarAsignacionProveedores() {
    try {
        const asignaciones = await cargarAsignaciones();
        if (asignaciones && Object.keys(asignaciones).length > 0) {
            return asignaciones;
        }
    } catch (e) {
        console.error('Error al cargar asignación de proveedores desde Supabase:', e);
    }
    return asignacionProveedoresDefault;
}

// Función auxiliar para obtener proveedores de un evaluador por tipo
function obtenerProveedoresPorEvaluador(evaluador, tipo) {
    if (!asignacionProveedores[evaluador]) {
        return [];
    }
    return asignacionProveedores[evaluador][tipo] || [];
}

// Variables globales
let configEvaluacion = null;
let itemsProducto = [];
let itemsServicio = [];

// Cargar configuración desde Supabase
async function cargarConfiguracionEvaluacionLocal() {
    try {
        const config = await cargarConfiguracionEvaluacion();
        if (config) {
            return config;
        }
    } catch (e) {
        console.error('Error al cargar configuración desde Supabase:', e);
    }
    // Valores por defecto
    return getConfiguracionDefault();
}

// Escala de respuesta
const escalaRespuesta = [25, 50, 75, 100];

// Sistema de navegación por pasos
let pasoActual = 0;
const totalPasos = 5;

function mostrarPaso(paso) {
    // Ocultar todos los pasos
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Mostrar el paso actual
    const stepElement = document.getElementById(`step${paso}`);
    if (stepElement) {
        stepElement.classList.add('active');
    }
    
    // Si estamos en el paso 4, asegurar que solo se muestre el resultado
    if (paso === 4) {
        // Calcular resultado si aún no se ha calculado
        calcularResultado();
        const resultSection = document.getElementById('resultSection');
        if (resultSection) {
            resultSection.style.display = 'block';
        }
        // Ocultar otros elementos del formulario que no deben verse
        const itemsSection = document.getElementById('itemsSection');
        if (itemsSection) {
            itemsSection.style.display = 'none';
        }
    }
    
    // Actualizar indicador de progreso
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index < paso) {
            step.classList.add('completed');
        } else if (index === paso) {
            step.classList.add('active');
        }
    });
    
    // Mostrar/ocultar indicador de progreso
    const progressIndicator = document.getElementById('progressIndicator');
    if (progressIndicator) {
        if (paso === 0) {
            progressIndicator.style.display = 'none';
        } else {
            progressIndicator.style.display = 'flex';
        }
    }
    
    pasoActual = paso;
}

function siguientePaso() {
    // Verificar si la encuesta está disponible (solo en paso 0)
    if (pasoActual === 0) {
        const ahora = new Date();
        const fechaInicio = configEvaluacion?.fechaInicioEncuesta ? new Date(configEvaluacion.fechaInicioEncuesta) : null;
        const fechaFin = configEvaluacion?.fechaFinEncuesta ? new Date(configEvaluacion.fechaFinEncuesta) : null;
        
        let fueraDeRango = false;
        let mensaje = '';
        
        if (fechaInicio && fechaFin) {
            if (ahora < fechaInicio) {
                fueraDeRango = true;
                const fechaInicioFormateada = fechaInicio.toLocaleString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                mensaje = `La encuesta estará disponible a partir del ${fechaInicioFormateada}.`;
            } else if (ahora > fechaFin) {
                fueraDeRango = true;
                const fechaFinFormateada = fechaFin.toLocaleString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                mensaje = `La encuesta ya no está disponible. El período de evaluación finalizó el ${fechaFinFormateada}.`;
            }
        } else if (fechaInicio) {
            if (ahora < fechaInicio) {
                fueraDeRango = true;
                const fechaInicioFormateada = fechaInicio.toLocaleString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                mensaje = `La encuesta estará disponible a partir del ${fechaInicioFormateada}.`;
            }
        } else if (fechaFin) {
            if (ahora > fechaFin) {
                fueraDeRango = true;
                const fechaFinFormateada = fechaFin.toLocaleString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                mensaje = `La encuesta ya no está disponible. El período de evaluación finalizó el ${fechaFinFormateada}.`;
            }
        }
        
        if (fueraDeRango) {
            alert(`⚠️ ${mensaje}`);
            return;
        }
    }
    
    // Validar paso actual antes de avanzar
    if (!validarPasoActual()) {
        return;
    }
    
    if (pasoActual < totalPasos - 1) {
        const siguiente = pasoActual + 1;
        
        // Si estamos avanzando al paso 2, actualizar proveedores
        if (pasoActual === 1) {
            actualizarProveedores().then(() => {
                mostrarPaso(siguiente);
            });
            return;
        }
        
        // Si estamos avanzando al paso 3, mostrar items y correo
        if (pasoActual === 2) {
            mostrarItemsEvaluacion();
            mostrarCampoCorreo();
        }
        
        // Si estamos avanzando al paso 4, calcular resultado y mostrar
        if (pasoActual === 3) {
            calcularResultado();
            // Asegurar que el resultado se muestre
            const resultSection = document.getElementById('resultSection');
            if (resultSection) {
                resultSection.style.display = 'block';
            }
        }
        
        mostrarPaso(siguiente);
    }
}

function anteriorPaso() {
    if (pasoActual > 0) {
        mostrarPaso(pasoActual - 1);
    }
}

// Hacer funciones globales inmediatamente (antes de DOMContentLoaded)
window.siguientePaso = siguientePaso;
window.anteriorPaso = anteriorPaso;

function validarPasoActual() {
    // Paso 0 no requiere validación
    if (pasoActual === 0) {
        return true;
    }
    
    switch(pasoActual) {
        case 1:
            const evaluador = document.getElementById('evaluador').value;
            const tipoProveedor = document.querySelector('input[name="tipoProveedor"]:checked');
            
            if (!evaluador) {
                alert('Por favor seleccione un evaluador.');
                return false;
            }
            if (!tipoProveedor) {
                alert('Por favor seleccione un tipo de proveedor.');
                return false;
            }
            return true;
            
        case 2:
            const proveedor = document.getElementById('proveedor').value;
            const correo = document.getElementById('correoProveedor').value;
            
            if (!proveedor) {
                alert('Por favor seleccione un proveedor.');
                return false;
            }
            if (!correo) {
                alert('Por favor ingrese el correo electrónico del proveedor.');
                return false;
            }
            return true;
            
        case 3:
            const tipoProveedorCheck = document.querySelector('input[name="tipoProveedor"]:checked');
            if (!tipoProveedorCheck) return true;
            
            const items = tipoProveedorCheck.value === 'PRODUCTO' ? itemsProducto : itemsServicio;
            let todosCompletos = true;
            
            items.forEach((item, index) => {
                const respuesta = document.querySelector(`input[name="item_${index}"]:checked`);
                if (!respuesta) {
                    todosCompletos = false;
                }
            });
            
            if (!todosCompletos) {
                alert('Por favor responda todas las preguntas antes de continuar.');
                return false;
            }
            return true;
            
        default:
            return true;
    }
}

// Inicializar año actual por defecto
document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar con valores por defecto primero (para mostrar la página inmediatamente)
    if (!configEvaluacion) {
        configEvaluacion = getConfiguracionDefault();
        itemsProducto = configEvaluacion.itemsProducto || [];
        itemsServicio = configEvaluacion.itemsServicio || [];
    }
    
    // Mostrar la página con valores por defecto
    actualizarInformacionDesdeConfig();
    inicializarEvaluadores();
    inicializarEventos();
    mostrarPaso(0);
    
    // Cargar datos desde Supabase (solo para verificar si hay cambios)
    try {
        console.log('Verificando datos desde Supabase...');
        
        // Cargar configuración
        const configDesdeBD = await cargarConfiguracionEvaluacionLocal();
        
        // Actualizar configEvaluacion con los datos de la BD (siempre, para asegurar que las fechas se carguen)
        if (configDesdeBD) {
            configEvaluacion = { ...configEvaluacion, ...configDesdeBD };
            itemsProducto = configEvaluacion.itemsProducto || [];
            itemsServicio = configEvaluacion.itemsServicio || [];
            
            // Actualizar la información solo si hubo cambios
            if (JSON.stringify(configDesdeBD) !== JSON.stringify(configEvaluacion) || !configEvaluacion.titulo) {
                actualizarInformacionDesdeConfig();
            }
        }
        
        // Verificar rango de fechas después de cargar la configuración
        // Esperar un poco más para asegurar que configEvaluacion esté actualizado
        setTimeout(() => {
            console.log('📅 Verificando rango de fechas...', {
                fechaInicio: configEvaluacion?.fechaInicioEncuesta,
                fechaFin: configEvaluacion?.fechaFinEncuesta,
                configEvaluacion: configEvaluacion
            });
            verificarRangoFechas();
        }, 300);
        
        // Cargar asignaciones y evaluadores
        asignacionProveedores = await cargarAsignacionProveedores();
        const evaluadoresDesdeBD = await cargarEvaluadores();
        
        // Actualizar evaluadores solo si hay cambios
        if (evaluadoresDesdeBD.length > 0) {
            evaluadores = evaluadoresDesdeBD;
            inicializarEvaluadores();
        } else if (Object.keys(asignacionProveedores).length > 0) {
            evaluadores = Object.keys(asignacionProveedores);
            inicializarEvaluadores();
        }
        
        // Cargar evaluaciones para obtener años disponibles
        const evaluaciones = await cargarEvaluaciones();
        
        // Inicializar selector de años
        await inicializarSelectorAnios(evaluaciones);
        
        console.log('✅ Datos verificados desde Supabase');
    } catch (error) {
        console.error('Error al verificar datos desde Supabase, usando valores por defecto:', error);
        // Si hay error, mantener los valores por defecto que ya están cargados
    }
});

// Inicializar fecha de evaluación (mostrar fecha actual)
async function inicializarSelectorAnios(evaluaciones) {
    const anioInput = document.getElementById('anioEvaluacion');
    const fechaTexto = document.getElementById('fechaTexto');
    
    if (!anioInput) return;
    
    // Establecer fecha actual
    const hoy = new Date();
    const fechaFormato = hoy.toISOString().split('T')[0]; // YYYY-MM-DD
    anioInput.value = fechaFormato;
    anioInput.dataset.anio = hoy.getFullYear();
    
    // Mostrar fecha formateada en español
    if (fechaTexto) {
        const dia = hoy.getDate();
        const mes = hoy.toLocaleString('es-ES', { month: 'long' });
        const anio = hoy.getFullYear();
        fechaTexto.textContent = `${dia} de ${mes} de ${anio}`;
    }
}

function actualizarInformacionDesdeConfig() {
    // Verificar que configEvaluacion existe
    if (!configEvaluacion) {
        console.warn('configEvaluacion no está disponible aún');
        return;
    }
    
    // Actualizar título
    const titulo = document.getElementById('tituloPrincipal');
    if (titulo) {
        titulo.textContent = configEvaluacion.titulo || 'Evaluación de Proveedores';
    }
    
    // Actualizar descripción
    const descripcion = document.getElementById('descripcionEvaluacion');
    if (descripcion) {
        descripcion.textContent = configEvaluacion.descripcion || '';
    }
    
    // Actualizar objetivo
    const objetivo = document.getElementById('objetivoEvaluacion');
    if (objetivo) {
        objetivo.textContent = configEvaluacion.objetivo || '';
    }
    
    // Actualizar lista de criterios dinámicamente
    actualizarCriteriosEnHTML();
}

// Función para verificar si la fecha actual está dentro del rango configurado
function verificarRangoFechas() {
    const mensajeDiv = document.getElementById('mensajeRangoFechas');
    const mensajeTexto = document.getElementById('mensajeRangoTexto');
    const form = document.getElementById('evaluationForm');
    
    if (!mensajeDiv || !configEvaluacion) return;
    
    const ahora = new Date();
    const fechaInicio = configEvaluacion.fechaInicioEncuesta ? new Date(configEvaluacion.fechaInicioEncuesta) : null;
    const fechaFin = configEvaluacion.fechaFinEncuesta ? new Date(configEvaluacion.fechaFinEncuesta) : null;
    
    if (!fechaInicio && !fechaFin) {
        mensajeDiv.style.display = 'none';
        if (form) {
            form.style.pointerEvents = 'auto';
            form.style.opacity = '1';
        }
        return;
    }
    
    let fueraDeRango = false;
    let mensaje = '';
    let tipoMensaje = 'info';
    
    const formatearFecha = (fecha) => {
        return fecha.toLocaleString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    if (fechaInicio && fechaFin) {
        if (ahora < fechaInicio) {
            fueraDeRango = true;
            tipoMensaje = 'warning';
            mensaje = `La encuesta estará disponible desde el ${formatearFecha(fechaInicio)} hasta el ${formatearFecha(fechaFin)}.`;
        } else if (ahora > fechaFin) {
            fueraDeRango = true;
            tipoMensaje = 'error';
            mensaje = `La encuesta ya no está disponible. El período de evaluación finalizó el ${formatearFecha(fechaFin)}.`;
        } else {
            tipoMensaje = 'info';
            mensaje = `La encuesta está disponible desde el ${formatearFecha(fechaInicio)} hasta el ${formatearFecha(fechaFin)}.`;
        }
    } else if (fechaInicio) {
        if (ahora < fechaInicio) {
            fueraDeRango = true;
            tipoMensaje = 'warning';
            mensaje = `La encuesta estará disponible a partir del ${formatearFecha(fechaInicio)}.`;
        } else {
            tipoMensaje = 'info';
            mensaje = `La encuesta está disponible desde el ${formatearFecha(fechaInicio)}.`;
        }
    } else if (fechaFin) {
        if (ahora > fechaFin) {
            fueraDeRango = true;
            tipoMensaje = 'error';
            mensaje = `La encuesta ya no está disponible. El período de evaluación finalizó el ${formatearFecha(fechaFin)}.`;
        } else {
            tipoMensaje = 'info';
            mensaje = `La encuesta estará disponible hasta el ${formatearFecha(fechaFin)}.`;
        }
    }
    
    mensajeDiv.style.display = 'block';
    if (mensajeTexto) mensajeTexto.innerHTML = mensaje;
    
    const tituloMensaje = document.getElementById('mensajeRangoTitulo');
    if (tituloMensaje) {
        if (tipoMensaje === 'error') {
            tituloMensaje.textContent = 'La encuesta no está disponible';
        } else if (tipoMensaje === 'warning') {
            tituloMensaje.textContent = 'La encuesta aún no está disponible';
        } else {
            tituloMensaje.textContent = 'Período de evaluación';
        }
    }
    
    const icono = mensajeDiv.querySelector('.mensaje-icono');
    if (tipoMensaje === 'error') {
        mensajeDiv.style.background = 'linear-gradient(135deg, #fee 0%, #fcc 100%)';
        mensajeDiv.style.borderColor = '#f33';
        if (icono) icono.textContent = '❌';
        if (tituloMensaje) tituloMensaje.style.color = '#c33';
        if (mensajeTexto) mensajeTexto.style.color = '#c33';
    } else if (tipoMensaje === 'warning') {
        mensajeDiv.style.background = 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)';
        mensajeDiv.style.borderColor = '#ffc107';
        if (icono) icono.textContent = '⚠️';
        if (tituloMensaje) tituloMensaje.style.color = '#856404';
        if (mensajeTexto) mensajeTexto.style.color = '#856404';
    } else {
        mensajeDiv.style.background = 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
        mensajeDiv.style.borderColor = '#10b981';
        if (icono) icono.textContent = 'ℹ️';
        if (tituloMensaje) tituloMensaje.style.color = '#065f46';
        if (mensajeTexto) mensajeTexto.style.color = '#065f46';
    }
    
    // Deshabilitar/habilitar botón "Comenzar" y bloquear formulario
    const btnComenzar = document.querySelector('button[onclick="siguientePaso()"]');
    
    if (fueraDeRango) {
        if (form) {
            form.style.pointerEvents = 'none';
            form.style.opacity = '0.6';
        }
        // Deshabilitar botón "Comenzar"
        if (btnComenzar) {
            btnComenzar.disabled = true;
            btnComenzar.style.opacity = '0.5';
            btnComenzar.style.cursor = 'not-allowed';
            btnComenzar.title = 'La encuesta no está disponible en este momento';
        }
    } else {
        if (form) {
            form.style.pointerEvents = 'auto';
            form.style.opacity = '1';
        }
        // Habilitar botón "Comenzar"
        if (btnComenzar) {
            btnComenzar.disabled = false;
            btnComenzar.style.opacity = '1';
            btnComenzar.style.cursor = 'pointer';
            btnComenzar.title = '';
        }
    }
}

function actualizarCriteriosEnHTML() {
    // Actualizar criterios de PRODUCTO
    const ulProducto = document.getElementById('listaProducto');
    const cantidadProducto = document.getElementById('cantidadProducto');
    if (ulProducto) {
        ulProducto.innerHTML = '';
        itemsProducto.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${item.nombre}</strong> (${item.ponderacion}%)`;
            ulProducto.appendChild(li);
        });
        if (cantidadProducto) {
            cantidadProducto.textContent = itemsProducto.length;
        }
    }
    
    // Actualizar criterios de SERVICIO
    const ulServicio = document.getElementById('listaServicio');
    const cantidadServicio = document.getElementById('cantidadServicio');
    if (ulServicio) {
        ulServicio.innerHTML = '';
        itemsServicio.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${item.nombre}</strong> (${item.ponderacion}%)`;
            ulServicio.appendChild(li);
        });
        if (cantidadServicio) {
            cantidadServicio.textContent = itemsServicio.length;
        }
    }
}

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
    document.getElementById('evaluador').addEventListener('change', async function() {
        await actualizarProveedores();
    });

    // La fecha se establece automáticamente al cargar, no necesita evento de cambio

    // Cambio de tipo de proveedor
    document.querySelectorAll('input[name="tipoProveedor"]').forEach(radio => {
        radio.addEventListener('change', async function() {
            await actualizarProveedores();
        });
    });

    // Cambio de proveedor
    document.getElementById('proveedor').addEventListener('change', function() {
        mostrarItemsEvaluacion();
        mostrarCampoCorreo();
        // Si estamos en el paso 2, asegurar que el correo se muestre
        if (pasoActual === 2) {
            const correoSection = document.getElementById('correoSection');
            if (this.value && correoSection) {
                correoSection.style.display = 'block';
            }
        }
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
            // También calcular resultado al hacer click
            calcularResultado();
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

}

async function actualizarProveedores() {
    const evaluador = document.getElementById('evaluador').value;
    const tipoProveedor = document.querySelector('input[name="tipoProveedor"]:checked');
    // Usar siempre la fecha actual
    const hoy = new Date();
    const anioEvaluacion = hoy.getFullYear();
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
        const evaluaciones = await cargarEvaluaciones();
        
        // Obtener proveedores ya evaluados por este evaluador, tipo y año
        const proveedoresEvaluados = new Set();
        evaluaciones.forEach(eval => {
            const anioEval = new Date(eval.fecha).getFullYear();
            if (eval.evaluador === evaluador && 
                eval.tipo === tipoProveedor.value && 
                anioEval === parseInt(anioEvaluacion)) {
                proveedoresEvaluados.add(eval.proveedor);
            }
        });
        
        // Obtener lista de proveedores asignados a este evaluador según el tipo
        const proveedoresAsignados = obtenerProveedoresPorEvaluador(evaluador, tipoProveedor.value);
        
        if (proveedoresAsignados.length === 0) {
            selectProveedor.innerHTML = `<option value="">-- Este evaluador no tiene proveedores asignados de tipo ${tipoProveedor.value} --</option>`;
        } else {
            // Filtrar proveedores que aún no han sido evaluados en este año
            const proveedoresDisponibles = proveedoresAsignados.filter(proveedor => !proveedoresEvaluados.has(proveedor));
            
            if (proveedoresDisponibles.length === 0) {
                selectProveedor.innerHTML = `<option value="">-- Ya ha evaluado todos los proveedores asignados de este tipo para el año ${anioEvaluacion} --</option>`;
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
    const correoSection = document.getElementById('correoSection');
    if (proveedor && correoSection) {
        correoSection.style.display = 'block';
    } else if (correoSection) {
        correoSection.style.display = 'none';
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
        // Solo mostrar el resultado si estamos en el paso 4
        if (pasoActual === 4) {
            const resultSection = document.getElementById('resultSection');
            if (resultSection) {
                resultSection.style.display = 'block';
            }
        }
    } else {
        // Si no están todos completos y estamos en paso 4, ocultar
        if (pasoActual === 4) {
            const resultSection = document.getElementById('resultSection');
            if (resultSection) {
                resultSection.style.display = 'none';
            }
        }
    }
}

async function guardarEvaluacion() {
    // Verificar rango de fechas antes de guardar (considerando hora)
    const ahora = new Date(); // Usar fecha y hora actuales
    
    const fechaInicio = configEvaluacion?.fechaInicioEncuesta ? new Date(configEvaluacion.fechaInicioEncuesta) : null;
    const fechaFin = configEvaluacion?.fechaFinEncuesta ? new Date(configEvaluacion.fechaFinEncuesta) : null;
    
    if (fechaInicio) {
        if (ahora < fechaInicio) {
            const fechaInicioFormateada = fechaInicio.toLocaleString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            alert(`⚠️ La encuesta aún no está disponible. Por favor, espere hasta el ${fechaInicioFormateada}.`);
            return;
        }
    }
    
    if (fechaFin) {
        if (ahora > fechaFin) {
            const fechaFinFormateada = fechaFin.toLocaleString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            alert(`⚠️ La encuesta ya no está disponible. El período de evaluación finalizó el ${fechaFinFormateada}.`);
            return;
        }
    }
    
    const evaluador = document.getElementById('evaluador').value;
    const tipoProveedor = document.querySelector('input[name="tipoProveedor"]:checked');
    const proveedor = document.getElementById('proveedor').value;
    const correoProveedor = document.getElementById('correoProveedor').value;
    
    // Usar siempre la fecha actual del día
    const hoy = new Date();
    const fechaSeleccionada = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const anioEvaluacion = hoy.getFullYear();
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
    
    // Guardar en Supabase (usando la función de supabase-service.js)
    // Convertir respuestas a formato array para Supabase
    const respuestasArray = [];
    Object.keys(respuestas).forEach(itemNombre => {
        respuestasArray.push({
            item: itemNombre,
            valor: respuestas[itemNombre]
        });
    });
    
    // Usar la fecha seleccionada en el calendario para fecha_evaluacion
    // La fecha debe ser la fecha completa del calendario, no solo el año
    let fechaEvaluacion;
    if (fechaSeleccionada) {
        // Crear fecha ISO en formato YYYY-MM-DD sin hora para evitar problemas de zona horaria
        const year = fechaSeleccionada.getFullYear();
        const month = String(fechaSeleccionada.getMonth() + 1).padStart(2, '0');
        const day = String(fechaSeleccionada.getDate()).padStart(2, '0');
        fechaEvaluacion = `${year}-${month}-${day}T00:00:00.000Z`; // Medianoche UTC para preservar el día
    } else {
        // Si no hay fecha seleccionada, usar la fecha actual
        fechaEvaluacion = new Date().toISOString();
    }
    
    console.log('📅 Fecha de evaluación (del calendario):', fechaEvaluacion);
    console.log('📅 Año extraído:', anioEvaluacion);
    
    try {
        // Llamar a la función de supabase-service.js
        const evaluacionData = {
            evaluador: evaluador,
            proveedor: proveedor,
            tipo: tipoProveedor.value,
            correoProveedor: correoProveedor,
            respuestas: respuestasArray,
            resultadoFinal: parseFloat(resultadoFinal.replace('%', '')),
            fechaEvaluacion: fechaEvaluacion, // Fecha del calendario para fecha_evaluacion
            anio: anioEvaluacion // Año extraído de la fecha del calendario
        };
        
        // Usar window para asegurar que llamamos a la función global de supabase-service.js
        console.log('💾 Intentando guardar evaluación:', evaluacionData);
        
        if (typeof guardarEvaluacionEnSupabase === 'function') {
            console.log('✅ Usando guardarEvaluacionEnSupabase');
            await guardarEvaluacionEnSupabase(evaluacionData);
        } else if (typeof window.guardarEvaluacionEnSupabase === 'function') {
            console.log('✅ Usando window.guardarEvaluacionEnSupabase');
            await window.guardarEvaluacionEnSupabase(evaluacionData);
        } else {
            console.error('❌ guardarEvaluacionEnSupabase no está disponible');
            throw new Error('La función guardarEvaluacionEnSupabase no está disponible. Por favor, recargue la página.');
        }
        
        console.log('✅ Evaluación guardada exitosamente');
        
        // Mostrar modal de éxito
        mostrarModalExito();
        limpiarFormulario();
        await actualizarProveedores();
        // Volver al inicio (paso 0) después de cerrar el modal
        setTimeout(() => {
            mostrarPaso(0);
        }, 500);
    } catch (error) {
        console.error('Error al guardar evaluación:', error);
        alert('❌ Error al guardar la evaluación. Por favor, intente nuevamente.');
    }
}

// Función para mostrar el modal de éxito
function mostrarModalExito() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Función para cerrar el modal de éxito
function cerrarModalExito() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Hacer funciones globales
window.mostrarModalExito = mostrarModalExito;
window.cerrarModalExito = cerrarModalExito;

// Cerrar modal al hacer clic fuera de él
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModalExito();
            }
        });
    }
});

function limpiarFormulario() {
    document.getElementById('evaluationForm').reset();
    document.getElementById('proveedor').innerHTML = '<option value="">-- Primero seleccione el tipo de proveedor --</option>';
    document.getElementById('itemsContainer').innerHTML = '';
    document.getElementById('itemsSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('correoSection').style.display = 'none';
    document.getElementById('correoProveedor').value = '';
    
    // Restablecer fecha actual (actualizar el display)
    const fechaTexto = document.getElementById('fechaTexto');
    const anioInput = document.getElementById('anioEvaluacion');
    if (anioInput && fechaTexto) {
        const hoy = new Date();
        anioInput.value = hoy.toISOString().split('T')[0];
        const dia = hoy.getDate();
        const mes = hoy.toLocaleString('es-ES', { month: 'long' });
        const anio = hoy.getFullYear();
        fechaTexto.textContent = `${dia} de ${mes} de ${anio}`;
    }
    
    // Volver al paso inicial
    mostrarPaso(0);
}

async function eliminarEvaluacionPorId(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta evaluación?')) {
        return;
    }
    
    try {
        const success = await eliminarEvaluacion(id);
        if (success) {
            alert('✅ Evaluación eliminada exitosamente.');
            mostrarEvaluaciones();
        } else {
            alert('❌ Error al eliminar la evaluación.');
        }
    } catch (error) {
        console.error('Error al eliminar evaluación:', error);
        alert('❌ Error al eliminar la evaluación.');
    }
}

async function mostrarEvaluaciones() {
    const evaluaciones = await cargarEvaluaciones();
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
            const fechaFormateada = new Date(eval.fecha).toLocaleString('es-ES');
            infoDiv.innerHTML = `
                <strong>${eval.proveedor}</strong> - ${eval.tipo} | ${fechaFormateada} | Resultado: ${eval.resultadoFinal.toFixed(2)}%
            `;
            
            const btnEliminar = document.createElement('button');
            btnEliminar.className = 'btn-eliminar';
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = () => eliminarEvaluacionPorId(eval.id);
            
            div.appendChild(infoDiv);
            div.appendChild(btnEliminar);
            container.appendChild(div);
        });
    }
    
    document.getElementById('modalEvaluaciones').style.display = 'block';
}

async function descargarExcel() {
    const evaluaciones = await cargarEvaluaciones();
    
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

async function descargarExcelPorProveedor(nombreProveedor) {
    const evaluaciones = await cargarEvaluaciones();
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
        const items = eval.tipo === 'PRODUCTO' ? itemsProducto : itemsServicio;
        const fila = {
            'Fecha': eval.fecha,
            'Evaluador': eval.evaluador,
            'Proveedor': eval.proveedor,
            'Correo Proveedor': eval.correoProveedor || 'No especificado',
            'Tipo': eval.tipo,
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
    const items = evaluacion.tipo === 'PRODUCTO' ? itemsProducto : itemsServicio;
    
    let contenido = `Estimado/a Proveedor ${evaluacion.proveedor},\n\n`;
    contenido += `Le informamos los resultados de su evaluación realizada el ${evaluacion.fecha}.\n\n`;
    contenido += `INFORMACIÓN GENERAL:\n`;
    contenido += `${'='.repeat(60)}\n`;
    contenido += `Evaluador: ${evaluacion.evaluador}\n`;
    contenido += `Tipo de Proveedor: ${evaluacion.tipo}\n`;
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

async function enviarCorreoIndividual(idEvaluacion) {
    const evaluaciones = await cargarEvaluaciones();
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
    const items = evaluacion.tipo === 'PRODUCTO' ? itemsProducto : itemsServicio;
    const fechaFormateada = new Date(evaluacion.fecha).toLocaleString('es-ES');
    const fila = {
        'Fecha': fechaFormateada,
        'Evaluador': evaluacion.evaluador,
        'Proveedor': evaluacion.proveedor,
        'Correo Proveedor': evaluacion.correoProveedor || 'No especificado',
        'Tipo': evaluacion.tipo,
        'Resultado Final (%)': evaluacion.resultadoFinal.toFixed(2)
    };
    
    // Las respuestas vienen como array desde Supabase
    if (Array.isArray(evaluacion.respuestas)) {
        evaluacion.respuestas.forEach(resp => {
            const item = items.find(i => i.nombre === resp.item);
            if (item) {
                fila[`${item.nombre} (${item.ponderacion}%)`] = resp.valor + '%';
            }
        });
    } else {
        // Formato antiguo (objeto)
        items.forEach(item => {
            const respuesta = evaluacion.respuestas[item.nombre] || 0;
            fila[`${item.nombre} (${item.ponderacion}%)`] = respuesta + '%';
        });
    }
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

async function enviarCorreosProveedores() {
    const evaluaciones = await cargarEvaluaciones();
    
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
                const items = eval.tipo === 'PRODUCTO' ? itemsProducto : itemsServicio;
                const fila = {
                    'Fecha': eval.fecha,
                    'Evaluador': eval.evaluador,
                    'Proveedor': eval.proveedor,
                    'Correo Proveedor': eval.correoProveedor || 'No especificado',
                    'Tipo': eval.tipo,
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

