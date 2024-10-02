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
        const divBase = document.createElement('div');
        const divExtra = document.createElement('div');
        const contenedorDivs = document.createElement('div');

        divBase.id = 'divBase';
        divExtra.id = 'divExtra';
        contenedorDivs.id = 'contenedorDivs';
        contenedorDivs.style.display = 'flex';
        contenedorDivs.style.justifyContent = 'space-around';
        
        agregarHtml.mostrarH3(divExtra,'Extras')
        agregarHtml.mostrarH3(divBase,'Base')
        
        this.dbSeleccionados.forEach(servicio => {
            const label = document.createElement('label');

            if(servicio.esExtra) {
                label.textContent = `${servicio.nombre} (${servicio.cantidad})`;

                divExtra.appendChild(label);
                divExtra.appendChild(document.createElement('br'));
                contenedorDivs.appendChild(divExtra);
            } else{
                label.textContent = `${servicio.nombre}`;
                
                divBase.appendChild(label);
                divBase.appendChild(document.createElement('br'));
                contenedorDivs.appendChild(divBase);
            };
        });

        contenedor.appendChild(contenedorDivs);
    };

    mostrarTotal(contenedor) {
        const div = document.createElement('div');
        const labelExtra = document.createElement('label');
        const labelBase = document.createElement('label');
        const labelFinal = document.createElement('label');
        const divDescuentos = document.createElement('div');
        const labelDescuentos = document.createElement('label');

        divDescuentos.style.marginTop = '25px';
        labelDescuentos.style.fontStyle = 'italic';
        labelDescuentos.style.fontSize = '10px';

        let totalBase = this.dbBaseSeleccionados.reduce((total,servicio)=> {
            return total + servicio.precio;
        }, 0);

        if(this.dbBaseSeleccionados.length == 2) { // Descuento
            totalBase *= 0.9;

            labelDescuentos.innerHTML = `<italic>Descuento del 10% por llevar 2 servicios principales</italic>`;
            labelDescuentos.appendChild(document.createElement('br'));
            divDescuentos.appendChild(labelDescuentos);
            
        } else if(this.dbBaseSeleccionados.length == 3) {
            totalBase *= 0.85;

            labelDescuentos.innerHTML = `<italic>Descuento del 15% por llevar 3 servicios principales</italic>`;
            labelDescuentos.appendChild(document.createElement('br'));
            divDescuentos.appendChild(labelDescuentos);
        } else if(this.dbBaseSeleccionados.length >= 4) {
            totalBase *= 0.8;

            labelDescuentos.innerHTML = `<italic>Descuento del 20% por llevar 4 o más servicios principales</italic>`;
            labelDescuentos.appendChild(document.createElement('br'));
            divDescuentos.appendChild(labelDescuentos);
        }

        const extrasConDescuento = this.aplicarDescuentosExtras();  // Llamado a una función que me crea un nuevo array con map, con los valores actualizados en caso
                                                                    // de que haya algún servicio seleccionado que cumpla el descuento.

        let totalExtra = 0;
        extrasConDescuento.forEach(servicio => { // Aplico descuento cuando el valor sea igual a 10.
            const labelExtraDescuento = document.createElement('label');
            totalExtra += (servicio.precio * servicio.cantidad);

            if(servicio.cantidad == 10) {
                labelExtraDescuento.textContent = `10% descuento en ${servicio.nombre} por llevar 10 unidades.`;
                labelExtraDescuento.style.fontSize = '10px';
                labelExtraDescuento.style.fontStyle = 'italic';
                divDescuentos.appendChild(labelExtraDescuento);
                divDescuentos.appendChild(document.createElement('br'));
            }
        });

        labelBase.innerHTML = `<strong>Total Servicios Base: $${totalBase}</strong>`;
        labelExtra.innerHTML = `<strong>Total Servicios Extras: $${totalExtra}</strong>`;
        labelFinal.innerHTML = `<strong>Monto Final: $${totalBase + totalExtra}</strong>`;

        div.appendChild(labelBase);
        div.appendChild(document.createElement('br'));
        div.appendChild(labelExtra);
        div.appendChild(document.createElement('br'));
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

    almacenarLocalStorage() {
        this.agruparArrays();
        const extras = this.aplicarDescuentosExtras();
    
        const pedidoFinal = {
            base: this.dbBaseSeleccionados,
            extras: extras,
        };
    
        localStorage.setItem('Pedido', JSON.stringify(pedidoFinal));
    }
};