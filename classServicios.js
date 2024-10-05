class Servicios { 
    constructor (nombre, precio, esExtra = false) {
        this.nombre = nombre;
        this.precio = precio;
        this.esExtra = esExtra;
        this.cantidad = 0;
    }
    
    static dbServicios = [];

    static agregarServicio(servicio) {
        this.dbServicios.push(servicio); // Pusheo los servicios creados en el archivo main.js
    }

    static listarServicio(contenedor,esExtra) {
        const divBase = agregarHtml.addElement('div');
        const divExtra = agregarHtml.addElement('div');

        divBase.id = 'divBase';
        divExtra.id = 'divExtra';

        agregarHtml.mostrarH3(divBase,'Servicios Principales');
        agregarHtml.mostrarH3(divExtra,'Servicios Extras');

        this.dbServicios.forEach((servicio, index) => {
            const label = document.createElement('label');
            label.textContent = `${servicio.nombre} $${servicio.precio}`;
        
            if(!servicio.esExtra) {
                const input = document.createElement('input')
                input.type = 'checkbox';
                input.name = 'servicioBase';
                input.dataset.index = index;
        
                label.htmlFor = input.id;
        
                divBase.appendChild(input);
                divBase.appendChild(label);
                agregarHtml.addBr(divBase);
            } else {
                const select = document.createElement('select');
                select.name = 'servicioExtra';
                select.dataset.index = index;
        
                for (let i = 0; i <= 10; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
        
                    select.appendChild(option);
                };
                label.htmlFor = select.id;
        
                divExtra.appendChild(select);
                divExtra.appendChild(label);
                agregarHtml.addBr(divExtra);
            }
        });

        if(!esExtra) {
            contenedor.appendChild(divBase);
        } else {
            contenedor.appendChild(divExtra);
        }
    }
};

