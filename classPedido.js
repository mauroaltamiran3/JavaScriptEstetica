const servicioManager = new ServicioManager;

class Pedido {
    constructor() {
        this.dbBaseSeleccionados = [];
        this.dbExtrasSeleccionados = [];
    }

    agruparArrays() {
        this.dbSeleccionados = [...this.dbBaseSeleccionados, ...this.dbExtrasSeleccionados];
    }

    async mostrarTextoServicio(db,elemento,contenedor) {
        try {
            db.forEach( servicio => {
                const label = agregarHtml.addElement('label');
                
                if(servicio.esExtra) {
                    label.textContent = `${servicio.nombre} (${servicio.cantidad})`;
                } else {
                    label.textContent = `${servicio.nombre}`;
                }
    
                elemento.appendChild(label);
                agregarHtml.addBr(elemento);
                contenedor.appendChild(elemento);
            });
        } catch (err) {
            console.error('Error al agregar el textContent a los servicios seleccionados.',err);
        }
    }

    async agregarSeleccionados(query,esExtra) {
        query.forEach(async servicio => {
            const index = await servicio.dataset.index;
            const servicioSeleccionado = await servicios.dbServicios[index];

            try {
                if(esExtra && servicio.value > 0) {
                    servicioSeleccionado.cantidad = servicio.value;
                    pedido.dbExtrasSeleccionados.push(servicioSeleccionado);
                } else if (!esExtra){
                    pedido.dbBaseSeleccionados.push(servicioSeleccionado)
                }
            } catch (err) {
                console.error('Error al agregar servicio seleccionado', err);
            }
        });
    }

    async mostrarSeleccionados(contenedor) { // Muestro los servicios seleccionados.
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

        try {
            const servicioBaseSeleccionado = document.querySelectorAll(`input[name="servicioBase"]:checked`); // Filtro los inputs checkeados
            const servicioExtraSeleccionado = document.querySelectorAll(`select[name="servicioExtra"]`); // FIltro los selects con valor != 0

            await this.agregarSeleccionados(servicioBaseSeleccionado, false);
            await this.agregarSeleccionados(servicioExtraSeleccionado, true);
    
            await this.mostrarTextoServicio(this.dbBaseSeleccionados,divBase,contenedorDivs);
            await this.mostrarTextoServicio(this.dbExtrasSeleccionados,divExtra,contenedorDivs);

            
            contenedor.appendChild(contenedorDivs);
            this.mostrarTotal(main);

        } catch (err) {
            console.error('Error al mostrar servicios seleccionados', err);
        }
    };

    async mostrarTotal(contenedor) {
        const div = agregarHtml.addElement('div');
        const labelExtra = agregarHtml.addElement('label');
        const labelBase = agregarHtml.addElement('label');
        const labelFinal = agregarHtml.addElement('label');
        const divDescuentos = agregarHtml.addElement('div');
        const labelDescuentos = agregarHtml.addElement('label');

        divDescuentos.style.marginTop = '25px';
        labelDescuentos.style.fontStyle = 'italic';
        labelDescuentos.style.fontSize = '10px';

        const baseSeleccionados = this.dbBaseSeleccionados;
    
        let totalBase = 0;
        try {
            totalBase = baseSeleccionados.reduce((total, servicio) => {
                return total + servicio.precio;
            }, 0);
        } catch (err) {
            console.error('Error al aplicar reduce al totalBase.',err)
        }

        if (this.dbBaseSeleccionados.length === 2) {
            totalBase *= 0.9;
            labelDescuentos.innerHTML = `<italic>Descuento del 10% por llevar 2 servicios principales</italic>`;
            agregarHtml.addBr(labelDescuentos);
            divDescuentos.appendChild(labelDescuentos);
        } else if (this.dbBaseSeleccionados.length === 3) {
            totalBase *= 0.85;
            labelDescuentos.innerHTML = `<italic>Descuento del 15% por llevar 3 servicios principales</italic>`;
            agregarHtml.addBr(labelDescuentos);
            divDescuentos.appendChild(labelDescuentos);
        } else if (this.dbBaseSeleccionados.length >= 4) {
            totalBase *= 0.8;
            labelDescuentos.innerHTML = `<italic>Descuento del 20% por llevar 4 o más servicios principales</italic>`;
            agregarHtml.addBr(labelDescuentos);
            divDescuentos.appendChild(labelDescuentos);
        }

        const extrasConDescuento = this.aplicarDescuentosExtras();  // Llamado a una función que me crea un nuevo array con map con los valores actualizados en caso de que haya algún servicio seleccionado que cumpla el descuento (10 uñas).

        let totalExtra = 0;
        try {
            totalExtra = extrasConDescuento.reduce((total, servicio) => {
                return total + (servicio.precio * servicio.cantidad);
            }, 0);
        } catch (err) {
            console.error('Error al aplicar reduce al totalExtra', err);
        }

        // Agregar mensaje de descuento para los extras
        extrasConDescuento.forEach(servicio => {
            const labelExtraDescuento = agregarHtml.addElement('label');
            totalExtra += (servicio.precio * servicio.cantidad);

            if(servicio.cantidad == 10) {
                labelExtraDescuento.textContent = `10% descuento en ${servicio.nombre} por llevar 10 unidades.`;
                labelExtraDescuento.style.fontSize = '10px';
                labelExtraDescuento.style.fontStyle = 'italic';
                divDescuentos.appendChild(labelExtraDescuento);
                agregarHtml.addBr(divDescuentos);
            }
        });

        try {
            this.almacenarLocalStorage(totalBase, totalExtra)
        } catch (err) {
            console.log('Error al almacenar en el localStorage.',err);
        }

        labelBase.innerHTML = `<strong>Total Servicios Base: $${totalBase}</strong>`;
        labelExtra.innerHTML = `<strong>Total Servicios Extras: $${totalExtra}</strong>`;
        labelFinal.innerHTML = `<strong>Monto Final: $${totalBase + totalExtra}</strong>`;

        div.appendChild(labelBase);
        agregarHtml.addBr(div);
        div.appendChild(labelExtra);
        agregarHtml.addBr(div);
        div.appendChild(labelFinal);
        div.style.textAlign = 'center';
        div.style.marginTop = '25px';

        div.appendChild(divDescuentos);

        return contenedor.appendChild(div);
    }

    aplicarDescuentosExtras() {
        return this.dbExtrasSeleccionados.map(servicio => {
            if(servicio.cantidad == 10){
                return {
                    ...servicio,
                    precio: servicio.precio * 0.9,
                };
            }
            return servicio;
        });
    }

    almacenarLocalStorage(totalBase, totalExtra) {
        this.agruparArrays();
        const extras = this.aplicarDescuentosExtras();
        
        const pedidoFinal = {
            base: this.dbBaseSeleccionados,
            extras: extras,
            total: totalBase + totalExtra,
        };

        let pedidosGuardados = localStorage.getItem('Pedido');

        if(pedidosGuardados) {
            pedidosGuardados = JSON.parse(pedidosGuardados);
        } else {
            pedidosGuardados = [];
        }

        pedidosGuardados.push(pedidoFinal);
    
        localStorage.setItem('Pedido', JSON.stringify(pedidosGuardados));
    }

    listarPedidos(db) {
        let lista = '';
        db.forEach((e,index) => {
            lista += e.nombre;
            if(index < db.length -1) {
                lista += ', '; // Agrego , si no es el ult. elemento
            } else {
                lista += '.';
            }
        });
        return lista;
    }

    mostrarLocalStorage(contenedor){
        const pedidos = localStorage.getItem('Pedido');

        if(pedidos){
            const arrayPedidos = JSON.parse(pedidos);

            arrayPedidos.forEach((servicio, index) => {
                const h4 = agregarHtml.addElement('h4');
                const div = document.createElement('div');
                const servicios = agregarHtml.addElement('ul');
                const serviciosBase = agregarHtml.addElement('li');
                const serviciosExtras = agregarHtml.addElement('li');
                const label = agregarHtml.addElement('label');

                const listaBase = this.listarPedidos(servicio.base);
                const listaExtra = this.listarPedidos(servicio.extras);
                const total = servicio.total;

                h4.innerHTML = `<strong>Pedido (${index})</strong>`;
                div.style.fontSize = '10px'
                label.innerHTML = `<strong>Total Pedido:</strong> $${total}`;
                label.style.marginLeft = '30px';
                serviciosBase.innerHTML = `Pedidos Base: ${listaBase}`;
                serviciosExtras.innerHTML = `Pedidos Extras: ${listaExtra}`;

                div.appendChild(h4);
                if( listaBase !== '' ) {
                servicios.appendChild(serviciosBase);
                }
                if( listaExtra !== '' ) {
                    servicios.appendChild(serviciosExtras);
                }

                div.appendChild(servicios);
                div.appendChild(label);
                contenedor.appendChild(div);
            })
        } else{
            console.log('No hay pedidos guardados');
        }
    }
};
