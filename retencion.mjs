// retencion.mjs: reprocesar desde el principio, y lo que la retencion se lleva
const log = { inicio: 0, registros: [] }; // inicio: el primer offset que todavia existe

function append(evento) {
  log.registros.push(evento);
  return log.inicio + log.registros.length - 1;
}
const fin = () => log.inicio + log.registros.length; // el offset que recibira el proximo evento

function leerDesde(offset) {
  if (offset < log.inicio) {
    console.log(`   el offset ${offset} ya no existe: la retencion lo borro. Se parte desde ${log.inicio}`);
    offset = log.inicio;
  }
  return log.registros.slice(offset - log.inicio);
}

function aplicarRetencion(hoy, dias) {
  // se borra por antiguedad, sin mirar quien lo leyo
  while (log.registros.length && log.registros[0].dia <= hoy - dias) {
    log.registros.shift();
    log.inicio++;
  }
}

const juegos = ['Celeste', 'Hades', 'Celeste', 'Terraria', 'Hades', 'Celeste', 'Hades', 'Celeste', 'Terraria', 'Celeste'];
juegos.forEach((juego, i) => append({ tipo: 'compra.realizada', juego, dia: i + 1 }));

const offsets = { estadisticas: 10, facturacion: 1 };
function consumir(grupo) {
  const desde = grupo in offsets ? offsets[grupo] : log.inicio; // grupo nuevo: desde lo mas antiguo
  const nuevos = leerDesde(desde);
  offsets[grupo] = fin();
  return nuevos;
}
function contar(eventos) {
  const total = {};
  for (const e of eventos) total[e.juego] = (total[e.juego] ?? 0) + 1;
  return JSON.stringify(total);
}

console.log(`El log tiene los offsets ${log.inicio} a ${fin() - 1}, una compra por dia.`);

console.log('\n1. estadisticas ya leyo todo. Cambia la formula: su offset vuelve a 0');
offsets.estadisticas = 0;
console.log(`   recalculo con ${contar(consumir('estadisticas'))}`);

console.log('\n2. Hoy es el dia 10 y la retencion es de 7 dias');
aplicarRetencion(10, 7);
console.log(`   el log ahora va del offset ${log.inicio} al ${fin() - 1}: ${log.registros.length} registros`);

console.log('\n3. historial es un grupo nuevo y parte de lo mas antiguo que queda');
console.log(`   leyo ${contar(consumir('historial'))}`);

console.log('\n4. facturacion estuvo caida. Se habia quedado en el offset 1');
const leidos = consumir('facturacion');
console.log(`   leyo ${leidos.length} eventos; los offsets 1 y 2 no los va a ver nunca`);