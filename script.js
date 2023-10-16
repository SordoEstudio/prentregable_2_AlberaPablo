const productos = [];

const traerProductos = async () => {
  try {
    const resp = await fetch("./productos.json");
    if (!resp.ok) {
      throw new Error("las cosas no salieron como esperabamos");
    }
    const data = await resp.json();
    data.forEach((producto) => productos.push(producto));
    mostrarBuscador();
    mostrarCarrito();
  } catch (error) {
    console.error(error);
  }
};

/* D E C L A R A C I O N   D E   V A R I A B L E S */
const inputBusqueda = document.querySelector("#inputBusqueda");
const resultado = document.querySelector("#resultado");
const carritoLista = document.querySelector("#carrito");
const btnVaciarCarrito = document.getElementById("vaciarCarrito");
const btnFinalizarCompra = document.getElementById("finalizarCompra");
const totalCompra = document.getElementById("totalCompra");
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: false,
});

/* F U N C I O N E S */

//    VACIAR CARRITO
btnVaciarCarrito.addEventListener("click", () => {
  Swal.fire({
    title: "Desea eliminar TODOS los productos?",
    icon: "warning",
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: "SI",
    cancelButtonText: "NO",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Borrado",
        icon: "success",
        text: "El carrito esta vacio!",
      });
      vaciarCarrito();
    }
  });
});

// MOSTRAR CON BUSCADOR INDEXOF
const mostrarBuscador = () => {
  resultado.innerHTML = "";
  const texto = inputBusqueda.value.toLowerCase();
  productos.forEach((producto) => {
    let nombre = producto.nombre.toLowerCase();
    if (nombre.indexOf(texto) !== -1) {
      const productoItem = document.createElement("tr");
      productoItem.innerHTML = `
      <th scope="row">${producto.nombre}</th>
      <td>$${producto.valor}</td>
      <td class='text-end'><button class="comprar btn btn-info mb-2">Comprar</button></td>
      `;
      const botonAgregar = productoItem.querySelector(".comprar");
      botonAgregar.addEventListener("click", () => agregarAlCarrito(producto));
      resultado.appendChild(productoItem);
    }
  });

  if (resultado.innerHTML === "") {
    const nadaParaMostrar = document.createElement("tr");
    nadaParaMostrar.innerHTML = `<td colspan="3"><div class="alert alert-dark" role="alert">No se encontro ningun producto</div></td>`;
    resultado.appendChild(nadaParaMostrar);
  }
};

//     AGREGAR AL CARRITO
function agregarAlCarrito(producto) {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const index = carrito.findIndex((item) => item.producto.id === producto.id);

  Toast.fire({
    icon: "success",
    title: "Producto agregado",
  });

  if (index !== -1) {
    carrito[index].cantidad++;
  } else {
    carrito.push({ producto, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  mostrarCarrito();
}

//     QUITAR DEL CARRITO
function quitarDelCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const index = carrito.findIndex((item) => item.producto.id === producto.id);
  Toast.fire({
    icon: "success",
    title: "Producto eliminado",
  });
  if (index !== -1) {
    if (carrito[index].cantidad > 1) {
      carrito[index].cantidad--;
    } else {
      carrito.splice(index, 1);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  }
}

//      MOSTRAR CARRITO
function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carritoLista.innerHTML = "";
  let totalCarrito = 0;
  carrito.forEach((item) => {
    const totalPorItem = item.producto.valor * item.cantidad;
    totalCarrito += totalPorItem;
    const elementoCarrito = document.createElement("tr");
    elementoCarrito.innerHTML = `
      <th scope="row">${item.producto.nombre}</th>
      <td>${item.cantidad}</td>
      <td>$${item.producto.valor}</td>
      <td>$${totalPorItem}</td>
      <td class='text-end'><button class="quitar btn btn-info mb-2">Quitar</button></td>
    `;
    const botonQuitar = elementoCarrito.querySelector(".quitar");
    botonQuitar.addEventListener("click", () =>
      quitarDelCarrito(item.producto)
    );
    carritoLista.appendChild(elementoCarrito);
  });
  const totalCarritoElemento = document.createElement("tr");
  totalCarritoElemento.innerHTML = `
<th scope="row" colspan="3">Total de la compra: </ht>
<td><b>$${totalCarrito}</b></td>
<td></td>
`;
  carritoLista.appendChild(totalCarritoElemento);

  if (totalCarrito === 0) {
    carritoVacio();
  }
}

//      VACIAR CARRITO
function vaciarCarrito() {
  localStorage.removeItem("carrito");
  carritoLista.innerHTML = "";
  carritoVacio();
}

//     FINALIZAR COMPRA
btnFinalizarCompra.addEventListener("click", () => {
  Swal.fire({
    title: "Finalizar Compra?",
    icon: "question",
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: "SI",
    cancelButtonText: "NO",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Gracias por su compra!",
        icon: "success",
        text: "Compra finalizada con exito",
      });
      vaciarCarrito();
    }
  });
});

function carritoVacio() {
  const carritoVacio = document.createElement("tr");
  carritoVacio.innerHTML = `<td colspan="5"><div class="alert alert-primary" role="alert">El carrito esta vacio</div></td>`;
  carritoLista.appendChild(carritoVacio);
}

traerProductos();
inputBusqueda.addEventListener("input", mostrarBuscador);
