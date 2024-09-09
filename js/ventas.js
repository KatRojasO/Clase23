var productos = JSON.parse(localStorage.getItem('productos')) || [];
var proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
var carrito2 = JSON.parse(localStorage.getItem('carrito2'))||[];
var ventas = JSON.parse(localStorage.getItem('ventas')) || [];


function cargarProductos(){

    var cadena = '';
    for(let i = 0; i < productos.length; i++){
        cadena += `<tr>
                        
                        <td>${productos[i].producto}</td>
                        <td>${productos[i].precio}</td>
                        <td>${productos[i].stock}</td>
                       
                        <td>
                            <div class="acciones">
                                <button onclick="agregarCarrito(${i})" class="btn btn-show m5">
                                    <i class="fa fa-plus"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    `;
    }

    if(productos.length == 0){
        cadena += `<tr>
                        <td colspan="4" align="center">
                            <br>
                            <br>
                                No hay productos registrados!
                                <br>
                                <br>
                                <br>
                                <a href="productosForm.html" class="btn btn-nuevo">
                                    <i class="fa fa-plus"></i>
                                    Nuevo
                                </a>
                            <br>
                            <br>
                            <br>
                            <br>
                        </td>
                    </tr>
                    `;
    }

    document.getElementById('listaProductos').innerHTML = cadena;
}

function eliminarProducto(posicion){
    Swal.fire({
        title: "Esta seguro?",
        text: "El producto se eliminará!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, quiero eliminar!",
    }).then((result) => {
        if (result.isConfirmed) {          

            productos.splice(posicion, 1);

            localStorage.setItem('productos', JSON.stringify(productos));
            cargarDatos();

            Swal.fire({
                title: "Eliminado!",
                text: "El producto ha sido eliminado.",
                icon: "success",
            });
        }
    });
}

function editarProducto(posicion){
    localStorage.setItem('producto_seleccionado', posicion);

    window.location.href = 'productosForm.html';
}

function setearDatos(){
    seleccionado = localStorage.getItem('producto_seleccionado');
    if(seleccionado != null && seleccionado >= 0 && seleccionado != undefined){
        var elProve = productos[seleccionado];

        document.getElementById('producto').value = elProve.producto;
        document.getElementById('precio').value = elProve.precio;
        document.getElementById('stock').value = elProve.stock;
    }
}

function buscarProducto(){
    var buscador = document.getElementById('buscar').value;

    var nuevoArray = [];
    
    if(buscador.trim() == '' || buscador.trim() == null){
        nuevoArray = JSON.parse(localStorage.getItem('productos')) || [];
    } else {
        
        for(let i = 0; i < productos.length; i++){
            var texto = productos[i].producto.toLowerCase();
            if(texto.search(buscador.toLowerCase()) >= 0){
                nuevoArray.push(productos[i]);
            }
        }
    }

    productos = nuevoArray;
    cargarProductos();
}
function cargarProveedores(){

    var cadena = '';
    for(let i = 0; i < productos.length; i++){
        cadena += `<option value="${proveedores[i].empresa}">${proveedores[i].empresa}</option>`;
    }
    document.getElementById('proveedor').innerHTML = cadena;
}
function agregarCarrito(parametro){
    
    var elemento ={
        producto: productos[parametro].producto,
        precio: productos[parametro].precio,
        cantidad: 1,
        subtotal: function(){
            return this.cantidad*this.precio;
        }
    }
    carrito2.push(elemento);

    cargarCarrito();
}
function cargarCarrito(){
    var cadena = '';
    for (var i = 0; i < carrito2.length; i++) {
        cadena += ` <tr>
                        <td>${carrito2[i].producto}</td>
                        <td>${carrito2[i].precio}</td>
                        <td>
                           <input type="number" onchange="cambiarCantidad(${i}, this)" value="${carrito2[i].cantidad}" class="form" placeholder="Cantidad">
                        </td>
                           <td>${carrito2[i].subtotal()}</td>
                        <td>
                            <button onclick="quitarCarrito(${i})" class="btn btn-delete m5">
                                <i class="fa fa-times"></i>
                            </button>
                        </td>
                    </tr>`;                                              
    }
    document.getElementById('listaCarrito').innerHTML=cadena;
    calcularTotal();
}
function quitarCarrito(posicion){
    carrito2.splice(posicion,1);
    cargarCarrito();
}
function calcularTotal(){
    var total = 0;
    for (var i = 0; i < carrito2.length; i++) {
        total += carrito2[i].subtotal();
    }
    document.getElementById('total').innerHTML=total;
}
function calcularTotalNeto(){
    var totalNeto = 0;
    var descuento = parseInt(document.getElementById('descuento').value) ;
    totalNeto += total*(descuento/100);
    
    document.getElementById('totalNeto').innerHTML=totalNeto;
}
function cambiarCantidad(posicion, elemento){
    console.log(elemento.value);
    if(elemento.value<-0){
        Swal.fire({
            title: "No puede ser cero",
            text: "La cantidad no puede ser menor o igual a cero",
            icon: "warning"
        });
        return;
    }
    carrito2[posicion].cantidad = (elemento.value!=null||elemento.value!='')?elemento.value:1;
    cargarCarrito();
}
function cambiarCantidad(){
    calcularTotalNeto();
    cargarCarrito();
}
function registrarCompra(){
    var proveedor=document.getElementById('proveedor').value;
    var fecha=document.getElementById('fecha').value;
    var comprobante=document.getElementById('numComprobante').value;
    var total = 0;
    for (let i = 0; i < carrito.length; i++) {
        total += carrito[i].subtotal();
    }

    if (proveedor==''|| fecha==''||comprobante==''||total==0) {
        Swal.fire({
            title: "Faltan Datos",
            text: "Complete los campos",
            icon: "warning"
        });
        return;
    }

    var compra = {
        proveedor: proveedor,
        fecha: fecha,
        comprobante: comprobante,
        total: total,
        usuario: "Katherin Rojas",
        detalles: carrito
    }
    compras.push(compra);
    localStorage.setItem('compras', JSON.stringify(compras));
    var losProductos= JSON.parse(localStorage.getItem('productos'));
    for (let i = 0; i < carrito.length; i++) {
        for (let j = 0; j < losProductos.length; j++) {
            if (losProductos[j].producto==carrito[i].producto) {
                losProductos[j].stock=(parseInt(losProductos[j].stock)+parseInt(carrito[i].cantidad));
            }
        }
    }
    localStorage.setItem('productos', JSON.stringify(losProductos));
    window.location.href="compras.html";
}
function cargarDatos(){
    var cadena = '';
    for (let i = 0; i < compras.length; i++) {
        cadena += ` <tr>
                        <td>${i+1}</td>
                        <td>${compras[i].proveedor}</td>
                        <td>${compras[i].fecha}</td>
                        <td>${compras[i].comprobante}</td>
                        <td>${compras[i].total}</td>
                        <td>${compras[i].usuario}</td>
                        <td>
                            <div class="acciones">
                                <button onclick="verCompra(${i})" class="btn btn-show m5">
                                <i class="fa fa-eye"></i>
                                <button onclick="eliminarCompra(${i})" class="btn btn-delete m5">
                                <i class="fa fa-times"></i>
                                </button>

                            </div>
                        </td>
                    </tr>`;  
    }
    if(compras.length==0){
        cadena += ` <tr>
                        <td colspan="7" align="center">
                            <br>
                            <br>No hay compras Registradas
                            <br>
                            <br>
                            <br>
                            <a href="comprasForm.html" class="btn btn-nuevo">
                                <i class="fa fa-plus"></i>
                                Nuevo
                            </a>
                            <br>
                            <br>
                            <br>
                            <br>
                        </td>
                    </tr>`;  
    }
    document.getElementById('listaCompras').innerHTML=cadena;
}

function buscarCompra(){
     var buscador = document.getElementById('buscar').value;

    var nuevoArray = [];
    
    if(buscador.trim() == '' || buscador.trim() == null){
        nuevoArray = JSON.parse(localStorage.getItem('compras')) || [];
    } else {
        
        for(let i = 0; i < compras.length; i++){
            var texto = compras[i].proveedor.toLowerCase();
            if(texto.search(buscador.toLowerCase()) >= 0){
                nuevoArray.push(compras[i]);
            }
        }
    }

    compras = nuevoArray;
    cargarDatos();
}
function eliminarCompra(posicion){
    var laCompra = compras[posicion];
    Swal.fire({
        title: "Esta seguro?",
        text: "La compra se eliminara y se descontara el stock",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si quiero eliminar",
    }).then((result)=>{
        if (result.isConfirmed) {
            var losProductos=JSON.parse(localStorage.getItem('productos'));
            for (let i = 0; i < laCompra.detalles.length; i++) {
                for (let j = 0; j < losProductos.length; j++) {
                    if (losProductos[j].producto==laCompra.detalles[i].producto) {
                        if (parseInt(losProductos[j].stock)>=parseInt(laCompra.detalles[i].cantidad)) {
                            losProductos[j].stock=(parseInt(losProductos[j].stock)-parseInt(laCompra.detalles[i].cantidad));
                        }
                        else{
                            Swal.fire({
                                title:"Error",
                                text: "No hay suficientes productos",
                                icon: "error",
                            });
                            return ;
                        }
                    }
                }
            }
            localStorage.setItem('productos', JSON.stringify(losProductos));
            compras.splice(posicion,1);
            cargarDatos();
            Swal.fire({
                title: "Eliminado",
                text: "El producto ha sido eliminado",
                icon: "success",
            });
        }
    });
}
function verCompra(posicion){
    localStorage.setItem('posicionCompra', posicion);
    window.location.href='comprasVer.html';

}
function mostrarCompra(){
    var posicion = localStorage.getItem('posicionCompra');
    var laCompra = compras[posicion];

    document.getElementById('proveedor').innerText=laCompra.proveedor;
    document.getElementById('fecha').innerText=laCompra.fecha;
    document.getElementById('comprobante').innerText=laCompra.comprobante;
    document.getElementById('total').innerText=laCompra.total;
    document.getElementById('usuario').innerText=laCompra.usuario;
    document.getElementById('ltotal').innerText=laCompra.total;
    var cadena = '';
    for (let i = 0; i < laCompra.detalles.length; i++) {
        var subtotal = parseFloat(laCompra.detalles[i].precio)*parseFloat(laCompra.detalles[i].cantidad);
        cadena += ` <tr>
                        <td>${laCompra.detalles[i].producto}</td>
                        <td>${laCompra.detalles[i].precio}</td>
                        <td>${laCompra.detalles[i].cantidad}</td>
                        <td>${subtotal}</td>
                            
                    </tr>`;  
    }
    document.getElementById('listaVer').innerHTML=cadena;
}
function cargarTotales(){
    var cantidadCompras = 0;
    var comprasMes = 0;
    var totalCompras = 0;
    for (let i = 0; i < compras.length; i++) {
        var laFecha = compras[i].fecha;
        var laFecha = new Date(laFecha);
        var fechaActual = new Date();

        if(laFecha.getFullYear()==fechaActual.getFullYear()){
            totalCompras+=parseFloat(compras[i].total);
            if (laFecha.getMonth()==fechaActual.getMonth()) {
                comprasMes+=parseFloat(compras[i].total);
            }
            cantidadCompras++;
        }
    }
    document.getElementById('cantidadCompras').innerText=cantidadCompras;
    document.getElementById('comprasMes').innerText=comprasMes;
    document.getElementById('totalCompras').innerText=totalCompras;
}