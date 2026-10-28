function asignar(particiones, consumidores) {
  const reparto = Array.from({ length: consumidores }, () => []);
  for (let p = 0; p < particiones; p++) reparto[p % consumidores].push(p);
  return reparto;
}

function mostrar(grupo, particiones, consumidores) {
  const reparto = asignar(particiones, consumidores);
  const linea = reparto
    .map((ps, i) => `c${i + 1}=${ps.length ? '[' + ps.join(',') + ']' : 'ocioso'}`)
    .join('  ');
  const ociosos = reparto.filter((ps) => ps.length === 0).length;
  console.log(`${grupo}, ${consumidores} consumidor(es): ${linea}  -> ${ociosos} sin trabajo`);
}

console.log('Topic vidalstore.actividad con 4 particiones\n');
for (const n of [1, 2, 4, 6]) mostrar('vidalstore-panel', 4, n);

console.log('\nDos grupos distintos sobre el mismo topic');
mostrar('vidalstore-panel', 4, 2);
mostrar('vidalstore-alertas', 4, 1);
console.log('Cada grupo recibe las 4 particiones: todos los eventos llegan a los dos.');