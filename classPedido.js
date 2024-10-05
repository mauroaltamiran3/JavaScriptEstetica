class Pedido {
    constructor() {
        this.dbBaseSeleccionados = [];
        this.dbExtrasSeleccionados = [];
    }

    agruparArrays() {
        this.dbSeleccionados = [...this.dbBaseSeleccionados, ...this.dbExtrasSeleccionados];
    }

    agregarServicio(query, esExtra) { // Los servicios seleccionados, los pusheo a las base del constructor.
        query.forEach(servicio => {
            const index = servicio.dataset.index;
            const servicioSeleccionado = Servicios.dbServicios[index]; // Le asigno el servicio según el id de la base original.

            if(esExtra) {
                const cantidad = servicio.value;
                servicioSeleccionado.cantidad = cantidad;

                if(servicioSeleccionado.cantidad > 0) { // Cuando sea mayor que 0, lo pusheo, sino no.
                    this.dbExtrasSeleccionados.push(servicioSeleccionado);
                };
            } else {
                this.dbBaseSeleccionados.push(servicioSeleccionado);
            }
        });
    }

    mostrarSeleccionados(contenedor) { // Muestro los servicios seleccionados.
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

        this.mostrarTextoServicio(this.dbBaseSeleccionados,divBase,contenedorDivs);
        this.mostrarTextoServicio(this.dbExtrasSeleccionados,divExtra,contenedorDivs);
        
        contenedor.appendChild(contenedorDivs);
    };

    mostrarTextoServicio(db,elemento,contenedor) {
        db.forEach(servicio => {
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
    }

    mostrarTotal(contenedor) {
        const div = agregarHtml.addElement('div');
        const labelExtra = agregarHtml.addElement('label');
        const labelBase = agregarHtml.addElement('label');
        const labelFinal = agregarHtml.addElement('label');
        const divDescuentos = agregarHtml.addElement('div');
        const labelDescuentos = agregarHtml.addElement('label');

        divDescuentos.style.marginTop = '25px';
        labelDescuentos.style.fontStyle = 'italic';
        labelDescuentos.style.fontSize = '10px';

        let totalBase = this.dbBaseSeleccionados.reduce((total,servicio)=> {
            return total + servicio.precio;
        }, 0);

        if(this.dbBaseSeleccionados.length == 2) { // Descuento
            totalBase *= 0.9;

            labelDescuentos.innerHTML = `<italic>Descuento del 10% por llevar 2 servicios principales</italic>`;
            agregarHtml.addBr(labelDescuentos);
            divDescuentos.appendChild(labelDescuentos);
            
        } else if(this.dbBaseSeleccionados.length == 3) {
            totalBase *= 0.85;

            labelDescuentos.innerHTML = `<italic>Descuento del 15% por llevar 3 servicios principales</italic>`;
            agregarHtml.addBr(labelDescuentos);
            divDescuentos.appendChild(labelDescuentos);
        } else if(this.dbBaseSeleccionados.length >= 4) {
            totalBase *= 0.8;

            labelDescuentos.innerHTML = `<italic>Descuento del 20% por llevar 4 o más servicios principales</italic>`;
            agregarHtml.addBr(labelDescuentos);
            divDescuentos.appendChild(labelDescuentos);
        }

        const extrasConDescuento = this.aplicarDescuentosExtras();  // Llamado a una función que me crea un nuevo array con map, con los valores actualizados en caso
                                                                    // de que haya algún servicio seleccionado que cumpla el descuento.

        let totalExtra = 0;
        extrasConDescuento.forEach(servicio => { // Aplico descuento cuando el valor sea igual a 10.
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

        this.almacenarLocalStorage(totalBase, totalExtra)

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
        console.log(extras);
        
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

    mostrarLocalStorage(){
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
                main.appendChild(div);
            })
        } else{
            console.log('No hay pedidos guardados');
        }
    }
};
