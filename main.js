const pedido = new Pedido;

const servicios = [ // db
    { nombre: 'Capping', precio: 5000, esExtra: false },
    { nombre: 'Semipermanente', precio: 6000, esExtra: false },
    { nombre: 'Soft Gel', precio: 7000, esExtra: false },
    { nombre: 'Press On', precio: 8000, esExtra: false },
    { nombre: 'Pestañas', precio: 5000, esExtra: false },
    { nombre: 'Diseño básico por uña', precio: 250, esExtra: true },
    { nombre: 'Diseño complejo por uña', precio: 500, esExtra: true },
    { nombre: 'Pedrería por uña', precio: 700, esExtra: true }
];

const [capping,Semipermanente,SoftGel,PressOn,Pestanhas,DisenhoBasico,DisenhoComplejo,Pedreria] = servicios;
servicios.forEach(servicio => {
    Servicios.agregarServicio(servicio);
})

const main = document.getElementById('main');
const contenedorServicios = document.createElement('div')
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
Servicios.listarServicio(contenedorServicios,false);
Servicios.listarServicio(contenedorServicios,true);

main.appendChild(contenedorServicios);
main.appendChild(btnSeleccionar);
main.appendChild(btnMostrarPedidos);
main.appendChild(btnBorrar);

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
        });
    }
});

btnSeleccionar.addEventListener('click', () => { // En el evento "limpio" el main y entrego los detalles del pedido.
    if(contenedorPedidos) {
        contenedorPedidos.style.display = 'none';
    }
    btnSeleccionar.style.display = 'none';
    contenedorServicios.style.display = 'none';
    btnMostrarPedidos.style.display = 'none';
    btnBorrar.style.display = 'none';
    const servicioBaseSeleccionado = document.querySelectorAll(`input[name="servicioBase"]:checked`); // Filtro los inputs checkeados
    const servicioExtraSeleccionado = document.querySelectorAll(`select[name="servicioExtra"]`); // FIltro los selects con valor != 0

    pedido.agregarServicio(servicioBaseSeleccionado, false); 
    pedido.agregarServicio(servicioExtraSeleccionado, true);
    pedido.agruparArrays();

    agregarHtml.mostrarH2(main,'Detalles del Pedido');

    pedido.mostrarSeleccionados(main);
    pedido.mostrarTotal(main);
});