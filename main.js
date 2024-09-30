document.body.style.fontFamily = 'sans-serif';
document.body.style.backgroundColor = '#171717';
document.body.style.color = '#EDEDED';
document.body.style.margin = '0px';
document.body.style.padding = '0px';
document.body.style.alignContent = 'center';

const h1 = document.createElement('h1');
const main = document.getElementById('main');
const contenedorBase = document.createElement('div');
const contenedorExtras = document.createElement('div');
const contenedorServicios = document.createElement('div');

main.style.display = 'flex';
main.style.flexDirection = 'column';
main.style.alignContent = 'center';
main.style.justifyContent = 'center';
main.style.height = '100vh';

h1.textContent = 'Gestión de turnos Estética Lu';
h1.style.textAlign = 'center';
h1.style.marginBottom = '100px';
main.appendChild(h1);

contenedorBase.style.marginBottom = '20px';
contenedorBase.id = 'serviciosBase';
contenedorExtras.id = 'serviciosExtras';

// const dbExtrasSeleccionados = [];
// const dbBaseSeleccionados = [];

const btnSeleccionar = document.createElement('button');
btnSeleccionar.textContent = 'Seleccionar';
btnSeleccionar.style.margin = '0 auto';
btnSeleccionar.style.width = '35%'

const descuento = (db,total) => {
    if(db.length == 2) {
        total = total * 0.9;
    } else if(db.length == 3) {
        total = total * 0.85;
    } else if(db.length >= 4) {
        total = total * 0.8;
    }
    return total;
};

let descuentoAplicado = false;
let servicioConDescuento = [];
const descuentoExtras = (servicio) => {
    if (servicio.cantidad === 10) {
        descuentoAplicado = true;
        servicioConDescuento.push(servicio.nombre);
        return {
            ...servicio, // Llamo a las propiedades del servicio
            precio: servicio.precio * 0.9 // Le cambio el valor por un 10% de desc.
        };
    }
    return servicio; // Si la cantidad no es 10, devuelvo el valor original
};

const crearElemento = (servicio, esExtra) => { // Función para no repetir código (labels, inputs, selects)
    const label = document.createElement('label');
    label.textContent = `${servicio.nombre} $${servicio.precio}`; // Label se repite, así que lo asigno a ambos ahora.

    let elemento; // Con elementos voy variando (depende el servicio del forEach) entre input o select.

    if(!esExtra) {
        elemento = document.createElement('input');
        elemento.type = 'checkbox';
        elemento.name = 'servicioBase';
    } else {
        elemento = document.createElement('select');
        elemento.name = 'servicioExtra';

        for (let i = 0; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            
            elemento.appendChild(option);
        };
    };

    elemento.dataset.index = `${dbServicios.indexOf(servicio)}`; // Le doy un index depende tanto al input y al select.

    label.htmlFor = elemento.id; //Asocio el label con el input o select

    return { label, elemento }; // Retorno el label para ambos, y elemento según corresponda al llamar la función.
}

const divServicios = () => { //Crear divs según el servicio.
    dbServicios.forEach(servicio => { // Recorro cada servicio y lo paso con crearElemento(), así me devuelve el valor de label y elemento.
        const { label, elemento } = crearElemento( servicio, servicio.esExtra );
        // const resultado = crearElemento(servicio, servicio.esExtra);
        // const label = resultado.label;
        // const elemento = resultado.elemento;

        if( !servicio.esExtra ) { // Como de false, itera con los princiaples
            contenedorBase.appendChild(elemento);
            contenedorBase.appendChild(label);
            contenedorBase.appendChild(document.createElement('br'));
        } else { // los extras
            contenedorExtras.appendChild(elemento);
            contenedorExtras.appendChild(label);
            contenedorExtras.appendChild(document.createElement('br'));
        };
    });
}; //Cargué contenedorBase y contenedorExtras según su label y elemento provenientes de la función crearElemento().
divServicios();

contenedorServicios.appendChild(contenedorBase);
contenedorServicios.appendChild(contenedorExtras);
contenedorServicios.id = 'contenedorServicios';
contenedorServicios.style.display = 'flex';
contenedorServicios.style.justifyContent = 'space-around';

main.appendChild(contenedorServicios);
main.appendChild(btnSeleccionar);

btnSeleccionar.addEventListener('click', () => {
    const h2 = document.createElement('h2');
    const detallePedido = document.createElement('div');
    const contenedorServiciosPedidos = document.createElement('div');

    // --------------------- CSS ---------------------\\
    h1.style.display = 'none';
    btnSeleccionar.style.display = 'none';
    contenedorServicios.style.display= 'none';

    contenedorServiciosPedidos.style.display = 'flex';
    contenedorServiciosPedidos.style.justifyContent = 'space-around';
    contenedorServiciosPedidos.id = 'contenedorServiciosPedidos';
    
    h2.textContent = 'Detalles del pedido';
    h2.style.margin = '0 auto';
    h2.style.marginTop = '40px';
    h2.style.fontSize = '25px';
    h2.style.fontWeight = 'bold';
    h2.style.textDecoration = 'underline';

    detallePedido.id = 'detallePedido';
    detallePedido.style.display = 'flex';
    detallePedido.style.flexDirection = 'column';
    detallePedido.style.justifyContent = 'space-around';
    detallePedido.style.backgroundColor = '#444444';
    detallePedido.style.height = '90vh';
    detallePedido.style.margin = '10px 50px';

    const crearH4 = (esExtra) => {
        const h4 = document.createElement('h4');
        if(!esExtra) {
            h4.textContent = 'Servicios Base Seleccionados';
        } else {
            h4.textContent = 'Servicios Extras Seleccionados';
        }
        h4.style.marginBottom = '15px';
        h4.style.fontSize = '15px';
        return h4;
    }

    const crearContenedorSeleccionado = (id, isExtra) => {
        const contenedor = document.createElement('ul');
        contenedor.id = id;
        contenedor.style.display = 'flex';
        contenedor.style.flexDirection = 'column';
        contenedor.style.margin = '0';
        contenedor.appendChild(crearH4(isExtra));
        
        return contenedor;
    };
    
    // Creo los contenedores
    const contenedorBaseSeleccionados = crearContenedorSeleccionado('contenedorBaseSeleccionados', false);
    const contenedorExtrasSeleccionados = crearContenedorSeleccionado('contenedorExtrasSeleccionados', true);

    detallePedido.appendChild(h2);
    detallePedido.appendChild(contenedorServiciosPedidos);
    // --------------------- CSS ---------------------\\


    // Verificar los servicios  //

    const pedido = new Pedido();
    const verificarYAgregarServicio = (servicioVerificar) => {
        servicioVerificar.forEach(servicio => {
            const index = servicio.dataset.index;
            const servicioSeleccionado = dbServicios[index];
    
            if (servicio.name === 'servicioExtra') {
                const cantidadIndicada = servicio.value;
    
                if (cantidadIndicada != 0) {
                    servicioSeleccionado.setCantidad(parseInt(cantidadIndicada));
                    pedido.agregarServicio(servicioSeleccionado, true);
                }
            } else if (servicio.name === 'servicioBase' && servicio.checked) {
                pedido.agregarServicio(servicioSeleccionado, false);
            }
        });
    }; 

    const verificarBases = document.querySelectorAll(`input[name="servicioBase"]:checked`);
    const verificarExtras = document.querySelectorAll(`select[name="servicioExtra"]`);

    verificarYAgregarServicio(verificarBases);
    verificarYAgregarServicio(verificarExtras);

    const mostrarServiciosElegidos = (db, contenedor, esExtra) => { // Agrego los li a sus contenedores correspondientes
        db.forEach(servicio => {
            const desc = document.createElement('li');
            desc.style.margin = '0px';
            desc.style.marginLeft = '30px';
            desc.style.fontSize = '11px';

            if (!esExtra) {
                desc.textContent = `${servicio.nombre}`;
            } else {
                desc.textContent = `${servicio.nombre} (Cantidad uña/s: ${servicio.cantidad})`;
            };

            contenedor.appendChild(desc);
            contenedorServiciosPedidos.appendChild(contenedor)
        });
    };

    mostrarServiciosElegidos(pedido.dbBaseSeleccionados,contenedorBaseSeleccionados,false);
    mostrarServiciosElegidos(pedido.dbExtrasSeleccionados,contenedorExtrasSeleccionados,true);

    // Mostrar monto final y total por separado. //
    const mostrarTotal = document.createElement('div');
    const mostrarTotalBase = document.createElement('p');
    const mostrarTotalExtra = document.createElement('p');
    const totalFinal = document.createElement('p');
    const mostrarDescuentos = document.createElement('div');
    const mostrarDescuentosBase = document.createElement('label');
    const mostrarDescuentosExtras = document.createElement('div');

    // --------------------- CSS ---------------------\\
    const mostrarTotalIndividual = (contenedor, esExtra) => {
        contenedor.style.fontSize = '12px';

        if(esExtra) {
            contenedor.textContent = `Total servicios base: $${totalBaseFinal}`;
        } else {
            contenedor.textContent = `Total servicios extras: $${totalExtra}`;
        }

        mostrarTotal.id = 'mostrarTotal';
        mostrarTotal.style.margin = '0 auto';
        mostrarTotal.style.marginTop = '50px';
        mostrarTotal.style.fontWeight = 'bold';
        return mostrarTotal.appendChild(contenedor);
    }

    mostrarDescuentosBase.style.fontSize = '8px';
    mostrarDescuentosBase.style.fontStyle = 'italic'
    mostrarDescuentos.id = 'mostrarDescuentos';

    totalFinal.style.fontSize = '18px';
    // --------------------- CSS ---------------------\\

    const totalBase = pedido.dbBaseSeleccionados.reduce((total,servicio)=> {
        return total + servicio.precio;
    }, 0);
    const totalBaseFinal = descuento(pedido.dbBaseSeleccionados, totalBase);

    const extrasConDescuentos = pedido.dbExtrasSeleccionados.map(descuentoExtras); // Verificar cantidades y hacer descuento sin son 10
    const totalExtra = extrasConDescuentos.reduce((total,servicio)=> {
        return total + (servicio.precio * servicio.cantidad);
    },0);

    mostrarTotalIndividual(mostrarTotalBase, false);
    mostrarTotalIndividual(mostrarTotalExtra, true);

    if(pedido.dbBaseSeleccionados.length == 2) { //Descuentos principales
        mostrarDescuentosBase.textContent = `10% de descuento realizado por llevar 2 servicios principales.`;
    } else if( pedido.dbBaseSeleccionados.length == 3 ) {
        mostrarDescuentosBase.textContent = `15% de descuento realizado por llevar 3 servicios principales.`;
    } else if( pedido.dbBaseSeleccionados.length >= 4 ) {
        mostrarDescuentosBase.textContent = `20% de Descuento realizado por llevar 4 o más servicios principales.`;
    }
    mostrarDescuentos.appendChild(mostrarDescuentosBase);

    mostrarDescuentosExtras.innerHTML = ''; //Descuento extras
    servicioConDescuento.forEach(servicio => {
        const descuentosRealizados = document.createElement('label');
        descuentosRealizados.style.fontSize = '8px';
        descuentosRealizados.style.fontStyle = 'italic'
        descuentosRealizados.innerHTML += `10% descuento en <strong>${servicio}</strong> por llevar 10 uñas.`;

        mostrarDescuentosExtras.appendChild(descuentosRealizados);
        mostrarDescuentosExtras.appendChild(document.createElement('br'));
    });
    if(descuentoAplicado) {
        mostrarDescuentos.appendChild(mostrarDescuentosExtras);
    }

    totalFinal.textContent = `Precio Final: $${totalBaseFinal + totalExtra}`;
    
    mostrarTotal.appendChild(totalFinal);  
    detallePedido.appendChild(mostrarTotal);
    detallePedido.appendChild(mostrarDescuentos);
    main.appendChild(detallePedido);

    pedido.guardarPedido();
});