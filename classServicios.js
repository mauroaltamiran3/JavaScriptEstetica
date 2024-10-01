class Servicios {
    constructor (nombre, precio, esExtra = false, cantidad = 0) {
        this.nombre = nombre;
        this.precio = precio;
        this.esExtra = esExtra;
        this.cantidad = 0;

        this.dbServicios = [];
    }

    listarServicio(contenedor,esExtra) {
        const divBase = document.createElement('div');
        const divExtra = document.createElement('div');

        divBase.id = 'divBase';
        divExtra.id = 'divExtra';

        agregarHtml.mostrarH3(divBase,'Servicios Principales');
        agregarHtml.mostrarH3(divExtra,'Servicios Extras')

        this.dbServicios.forEach(servicio => {
            const label = document.createElement('label');
            label.textContent = `${servicio.nombre} $${servicio.precio}`;

            if(!servicio.esExtra) {
                const input = document.createElement('input')
                input.type = 'checkbox';
                input.name = 'servicioBase';
                input.dataset.index = `${this.dbServicios.indexOf(servicio)}`;

                label.htmlFor = input.id;

                divBase.appendChild(input);
                divBase.appendChild(label);
                divBase.appendChild(document.createElement('br'));
            } else {
                const select = document.createElement('select');
                select.name = 'servicioExtra';
                select.dataset.index = `${this.dbServicios.indexOf(servicio)}`;

                for (let i = 0; i <= 10; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    
                    select.appendChild(option);
                };
                label.htmlFor = select.id;
                
                divExtra.appendChild(select);
                divExtra.appendChild(label);
                divExtra.appendChild(document.createElement('br'));
            }
        })

        if(!esExtra) {
            contenedor.appendChild(divBase);
        } else {
            contenedor.appendChild(divExtra);
        }
    }
};

