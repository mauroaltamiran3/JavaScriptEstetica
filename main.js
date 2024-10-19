const pedido = new Pedido;
const servicios = new ServicioManager;

const main = document.getElementById('main');
const contenedorServicios = document.createElement('div');
const btnSeleccionar = document.createElement('button');
const btnMostrarPedidos = document.createElement('button');
const btnBorrar = agregarHtml.addElement('button');


btnBorrar.textContent = 'Borrar Pedidos';
btnBorrar.style.display = 'none';
btnBorrar.style.margin = '0 auto';
contenedorServicios.id = 'contenedorServicios';
btnSeleccionar.textContent = 'Seleccionar';
btnSeleccionar.style.display = 'block';
btnSeleccionar.style.margin = '0 auto';

btnMostrarPedidos.textContent = 'Mostrar Pedidos';
btnMostrarPedidos.style.display = 'block';
btnMostrarPedidos.style.margin = '0 auto';

// Mostrar servicios y botón

async function mostrarContenido () {
    await servicios.listarServicios(contenedorServicios, 'Bases');
    await servicios.listarServicios(contenedorServicios, 'Extras');

    main.appendChild(contenedorServicios);
    main.appendChild(btnSeleccionar);
    main.appendChild(btnMostrarPedidos);
    main.appendChild(btnBorrar);
}
mostrarContenido();

agregarHtml.cssBody('#705C53','#F5F5F7', 'sans-serif');
agregarHtml.cssMain();

let pedidosVisibles = false;
let contenedorPedidos = document.getElementById('contenedorPedidos');

btnMostrarPedidos.addEventListener('click', () => {

    if (!contenedorPedidos) {
        contenedorPedidos = agregarHtml.addElement('section');
        contenedorPedidos.id = 'contenedorPedidos';
        pedido.mostrarLocalStorage(contenedorPedidos);
        main.appendChild(contenedorPedidos);
    }
    // Aplico toggle
    if (pedidosVisibles) {
        contenedorPedidos.style.display = 'none';
        pedidosVisibles = false;
    } else {
        contenedorPedidos.style.display = 'block';
        pedidosVisibles = true;
    }

    const pedidos = localStorage.getItem('Pedido');
    const arrayPedidos = JSON.parse(pedidos);
    if(arrayPedidos === null) {
        btnBorrar.style.display = 'none';

        const p = agregarHtml.addElement('p');
        p.textContent = 'No hay pedidos guardados.';
        p.style.fontSize = '12px';
        p.style.textAlign = 'center';
        main.appendChild(p);
    } else {
        btnBorrar.style.display = 'block';

        btnBorrar.addEventListener('click', () => {
            localStorage.removeItem('Pedido');
            contenedorPedidos.innerHTML = ''; // Limpia el contenido visible
            btnBorrar.style.display = 'none'; // Ocultar el botón de borrar después de limpiar
        });
    }
});

btnSeleccionar.addEventListener('click', async (e) => { // En el evento "limpio" el main y entrego los detalles del pedido.
    const serviciosBaseSeleccionados = document.querySelectorAll('input[name="servicioBase"]:checked');
    const serviciosExtraSeleccionados = Array.from(document.querySelectorAll('select[name="servicioExtra"]')).filter(select => select.value > 0);
    const serviciosSeleccionados = [...serviciosBaseSeleccionados, ...serviciosExtraSeleccionados];

    if (serviciosSeleccionados.length === 0) {
        e.preventDefault(); // Si está vacío, freno el comportamiento

        Swal.fire({
            title: 'Error',
            text: 'Debes seleccionar al menos un servicio',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("El usuario ha sido notificado. Selecciona al menos un servicio.");
            }
        });
    } else {
        const result = await Swal.fire({
            title: 'Confirmar compra',
            text: "¿Estás seguro de confirmar el pedido?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'No, cancelar'
        });
        
        if (result.isConfirmed) {
            // Si el usuario confirmó, continúa con la ejecución del pedido
            if (contenedorPedidos) {
                contenedorPedidos.style.display = 'none';
            }
            btnSeleccionar.style.display = 'none';
            contenedorServicios.style.display = 'none';
            btnMostrarPedidos.style.display = 'none';
            btnBorrar.style.display = 'none';
        
            const divBase = agregarHtml.addElement('div');
            const divExtra = agregarHtml.addElement('div');
            const contenedorDivs = agregarHtml.addElement('div');
        
            divBase.id = 'divBase';
            divExtra.id = 'divExtra';
            contenedorDivs.id = 'contenedorDivs';
            contenedorDivs.style.display = 'flex';
            contenedorDivs.style.justifyContent = 'space-around';
        
            agregarHtml.mostrarH3(divExtra,'Extras');
            agregarHtml.mostrarH3(divBase,'Base');
        
            agregarHtml.mostrarH2(main,'Detalles del Pedido');
            pedido.mostrarSeleccionados(main);
        } else {
            // Si el usuario no acepta, cancelo la ejecución
            e.preventDefault();
            console.log("Pedido cancelado por el usuario.");
        }
    }
});