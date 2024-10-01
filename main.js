const servicios = new Servicios;
const pedido = new Pedido;

const construirServicio = (nombre, precio, esExtra) => {
    const servicio = new Servicios(nombre, precio, esExtra);
    servicios.dbServicios.push(servicio);  // Si es extra, va a extrasServicios
}

construirServicio('Capping', 5000);
construirServicio('Semipermanente', 6000);
construirServicio('Soft Gel', 7000);
construirServicio('Press On', 8000);
construirServicio('Pestañas', 5000);
construirServicio('Diseño básico por uña', 250, true);
construirServicio('Diseño complejo por uña', 500, true);
construirServicio('Pedrería por uña', 700, true);

const main = document.getElementById('main');
const contenedorServicios = document.createElement('div')
const btnSeleccionar = document.createElement('button');

contenedorServicios.id = 'contenedorServicios';
btnSeleccionar.textContent = 'Seleccionar';
btnSeleccionar.style.display = 'block';
btnSeleccionar.style.margin = '0 auto';

servicios.listarServicio(contenedorServicios,false);
servicios.listarServicio(contenedorServicios,true);

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

