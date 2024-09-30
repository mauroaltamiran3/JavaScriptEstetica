class Servicios {
    constructor (nombre, precio, esExtra = false, cantidad = 0) {
        this.nombre = nombre;
        this.precio = precio;
        this.esExtra = esExtra;
        this.cantidad = cantidad;
    }

    setCantidad(cantidad) {
        this.cantidad = cantidad;
    }
};

const dbServicios = [];

const construirServicio = (nombre, precio, esExtra) => {
    const servicio = new Servicios(nombre, precio, esExtra);
    dbServicios.push(servicio);  // Si es extra, va a extrasServicios
}

construirServicio('Capping', 5000);
construirServicio('Semipermanente', 6000);
construirServicio('Soft Gel', 7000);
construirServicio('Press On', 8000);
construirServicio('Pestañas', 5000);
construirServicio('Diseño básico por uña', 250, true);
construirServicio('Diseño complejo por uña', 500, true);
construirServicio('Pedrería por uña', 700, true);

class Pedido {
    constructor() {
        this.dbBaseSeleccionados = [];
        this.dbExtrasSeleccionados = [];
    }

    agregarServicio(servicio, esExtra) {
        if (esExtra) {
            this.dbExtrasSeleccionados.push(servicio);
        } else {
            this.dbBaseSeleccionados.push(servicio);
        }
    }

    guardarPedido() {
        const pedido = [...this.dbBaseSeleccionados, ...this.dbExtrasSeleccionados];

        localStorage.setItem('pedido', JSON.stringify(pedido));
        
        console.log("Pedido guardado en localStorage:", pedido);
    }

}