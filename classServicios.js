class ServicioManager {
    constructor() {
        this.dbServicios = [];
    }

    async obtenerServicios() { // Simulo el pedido con delay
        const loadingElement = document.getElementById('loading');
        loadingElement.style.display = 'block'; // Simular espera de carga
        loadingElement.style.textAlign = 'center';
    
        return new Promise((resolve) => {
            setTimeout(async () => {
                try {
                    const respuesta = await fetch('dbServicios.json'); // Uso del fetch
                    const servicios = await respuesta.json();
                    resolve(servicios);
                } catch (err) {
                    console.error('Error al obtener los servicios desde la base de datos.', err);
                } finally {
                    loadingElement.style.display = 'none'; // Ocultar el mensaje de carga cuando finaliza
                }
            }, 1000);
        });
    }

    async llamarServicios() {
        try {
            const servicios = await this.obtenerServicios();
            
            if(this.dbServicios.length === 0) {
                this.dbServicios.push(...servicios);
            }
        } catch (err) {
            console.error('Error al llamar la función para obtener la base de datos.',err);
        }
    }

    async listarServicios(contenedor, tipoServicio) {
        await this.llamarServicios();

        const div = document.createElement('div');
        div.id = `contenedorServicios${tipoServicio}`;
        
        try {
            this.dbServicios.forEach((servicio,index) => {
                const label = document.createElement('label');
                label.textContent = `${servicio.nombre} ($${servicio.precio})`;
    
                if ( tipoServicio === 'Bases' && !servicio.esExtra ) {
                    const input = document.createElement('input');
                    
                    input.type = 'checkbox';
                    input.name = 'servicioBase';
                    input.dataset.index = index;
            
                    label.htmlFor = input.id;
    
                    div.appendChild(input);
                    div.appendChild(label);
                    div.appendChild(document.createElement('br'));
                } else if ( servicio.esExtra && tipoServicio === 'Extras' ){
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
    
                    div.appendChild(select);
                    div.appendChild(label);
                    div.appendChild(document.createElement('br'));
                }
            });
        } catch (err) {
            console.error('Error al listar los servicios',err);
        }
        
        contenedor.appendChild(div);
    }
}