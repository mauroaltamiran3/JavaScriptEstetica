const pedido = new Pedido;

const construirServicio = (nombre, precio, esExtra) => {
    const servicio = new Servicios(nombre, precio, esExtra);
    Servicios.agregarServicio(servicio); // Agregar a dbServicios
}

const servicios = [
    { nombre: 'Capping', precio: 5000, esExtra: false },
    { nombre: 'Semipermanente', precio: 6000, esExtra: false },
    { nombre: 'Soft Gel', precio: 7000, esExtra: false },
    { nombre: 'Press On', precio: 8000, esExtra: false },
    { nombre: 'Pestañas', precio: 5000, esExtra: false },
    { nombre: 'Diseño básico por uña', precio: 250, esExtra: true },
    { nombre: 'Diseño complejo por uña', precio: 500, esExtra: true },
    { nombre: 'Pedrería por uña', precio: 700, esExtra: true }
];

servicios.forEach(servicio => construirServicio(servicio.nombre, servicio.precio, servicio.esExtra));

const main = document.getElementById('main');
const contenedorServicios = document.createElement('div')
const btnSeleccionar = document.createElement('button');

contenedorServicios.id = 'contenedorServicios';
btnSeleccionar.textContent = 'Seleccionar';
btnSeleccionar.style.display = 'block';
btnSeleccionar.style.margin = '0 auto';

// Mostrar servicios
Servicios.listarServicio(contenedorServicios,false);
Servicios.listarServicio(contenedorServicios,true);

main.appendChild(contenedorServicios);
main.appendChild(btnSeleccionar);

agregarHtml.cssBody('#705C53','#F5F5F7', 'sans-serif');
agregarHtml.cssMain();


btnSeleccionar.addEventListener('click', () => {
    btnSeleccionar.style.display = 'none';
    contenedorServicios.style.display = 'none';
    const servicioBaseSeleccionado = document.querySelectorAll(`input[name="servicioBase"]:checked`);
    const servicioExtraSeleccionado = document.querySelectorAll(`select[name="servicioExtra"]`);

    pedido.agregarServicio(servicioBaseSeleccionado, false);
    pedido.agregarServicio(servicioExtraSeleccionado, true);
    pedido.agruparArrays();

    agregarHtml.mostrarH2(main,'Detalles del Pedido');

    pedido.mostrarSeleccionados(main);
    pedido.mostrarTotal(main);
    pedido.almacenarLocalStorage();
});

