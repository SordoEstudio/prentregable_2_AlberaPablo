/* A R R A Y   D E   P R O D U C T O S */
const productos = [
    { id: "1", nombre: 'Rucula y Crudo', valor: 2900 },
    { id: "2", nombre: '4 Quesos', valor: 600 },
    { id: "3", nombre: 'Hawaiana', valor: 700 },
    { id: "4", nombre: 'Napo Encebollada', valor: 800 },
    { id: "5", nombre: 'Pizza Clementina', valor: 900 },
    { id: "6", nombre: 'Palmitos a la Entre Rihana', valor: 900 },
    { id: "7", nombre: 'Anana y Roquefort', valor: 1500 }
];

/* D E C L A R A C I O N   D E   V A R I A B L E S */
const resultado = document.querySelector('#resultado');
const carritoLista = document.querySelector('#carrito');
const btnVaciarCarrito = document.getElementById('vaciarCarrito')

btnVaciarCarrito.addEventListener('click', () => {
  localStorage.clear();
  carritoLista.innerHTML = ''
})

/* F U N C I O N E S */

const mostrar = () => {
  resultado.innerHTML = '';
  productos.forEach(producto => {
    const productoItem = document.createElement('tr');
    productoItem.innerHTML = `
      <th scope="row">${producto.nombre}</th>
      <td>${producto.valor}</td>
      <td><button class="comprar btn btn-info mb-2">Comprar</button></td>
    `;

    const botonAgregar = productoItem.querySelector('.comprar');
    botonAgregar.addEventListener('click', () => agregarAlCarrito(producto));
    resultado.appendChild(productoItem);
  });
}

function agregarAlCarrito(producto) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.push(producto);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  
  mostrarCarrito(); 
}

function quitarDelCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const index = carrito.findIndex(item => item.id === producto.id);
  if (index !== -1) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
  mostrarCarrito();
}

function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carritoLista.innerHTML = '';
  carrito.forEach(producto => {
    const elementoCarrito = document.createElement('tr');
    elementoCarrito.innerHTML = `
      <th scope="row">${producto.nombre}</th>
      <td>$${producto.valor}</td>
      <td><button class="quitar btn btn-info mb-2">Quitar</button></td>
    `;
    const botonQuitar = elementoCarrito.querySelector('.quitar');
    botonQuitar.addEventListener('click', () => quitarDelCarrito(producto));
    carritoLista.appendChild(elementoCarrito);
  });
}

window.addEventListener('load', () => {
  mostrarCarrito(); 
});

mostrar();
