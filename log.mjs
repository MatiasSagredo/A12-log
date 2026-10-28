// log.mjs: los mismos tres eventos, en una cola y en un log
const eventos = [
  { tipo: 'compra.realizada', juego: 'Celeste' },
  { tipo: 'compra.realizada', juego: 'Hollow Knight' },
  { tipo: 'licencia.revocada', juego: 'Celeste' },
];

// La cola: leer es sacar
const cola = [...eventos];
const leerDeLaCola = () => cola.shift();

// El log: leer es mirar desde una posicion
const log = [];
const append = (evento) => log.push(evento) - 1; // devuelve el offset
const leerDesde = (offset) => log.slice(offset);

for (const e of eventos) console.log(`append ${e.juego} -> offset ${append(e)}`);

console.log('\nCOLA');
const paraFacturacion = [leerDeLaCola(), leerDeLaCola(), leerDeLaCola()];
console.log(`facturacion leyo: ${paraFacturacion.map((e) => e.juego).join(', ')}`);
console.log(`estadisticas leyo: ${leerDeLaCola()?.juego ?? 'nada'}`);
console.log(`quedan en la cola: ${cola.length}`);

console.log('\nLOG');
const offsets = { facturacion: 0, estadisticas: 0 };
function consumir(grupo, maximo) {
  const nuevos = leerDesde(offsets[grupo]).slice(0, maximo);
  offsets[grupo] += nuevos.length;
  console.log(`${grupo} leyo: ${nuevos.map((e) => e.juego).join(', ')} -> va en el offset ${offsets[grupo]}`);
}
consumir('facturacion', 3);
consumir('estadisticas', 1);
console.log(`quedan en el log: ${log.length}`);