function murmur2(texto) {
  const data = Buffer.from(texto, 'utf8');
  const m = 0x5bd1e995;
  let h = 0x9747b28c ^ data.length;
  const cuartos = data.length >>> 2;
  for (let i = 0; i < cuartos; i++) {
    const j = i * 4;
    let k = data[j] | (data[j + 1] << 8) | (data[j + 2] << 16) | (data[j + 3] << 24);
    k = Math.imul(k, m);
    k ^= k >>> 24;
    k = Math.imul(k, m);
    h = Math.imul(h, m) ^ k;
  }
  const base = data.length & ~3;
  switch (data.length % 4) {
    case 3: h ^= data[base + 2] << 16; // sigue abajo
    case 2: h ^= data[base + 1] << 8;  // sigue abajo
    case 1: h ^= data[base]; h = Math.imul(h, m);
  }
  h ^= h >>> 13;
  h = Math.imul(h, m);
  h ^= h >>> 15;
  return h;
}
const particion = (key, n) => (murmur2(key) & 0x7fffffff) % n;

console.log(`comprobacion: murmur2('21') = ${murmur2('21')} (Kafka espera -973932308)\n`);

// 300 partidas de vidalstore.actividad. La key es el juegoId.
// El juego 292030 se lleva 2 de cada 5 partidas: es el mas jugado de la noche.
const otros = ['1091500', '1328670', '413150', '367520', '105600', '1145360'];
const partidas = [];
for (let i = 0; i < 300; i++) {
  const juegoId = i % 5 < 2 ? '292030' : otros[i % otros.length];
  partidas.push({ juegoId, partida: i });
}

for (const n of [3, 4]) {
  const porParticion = Array.from({ length: n }, () => 0);
  for (const p of partidas) porParticion[particion(p.juegoId, n)]++;
  console.log(`Con ${n} particiones`);
  console.log(`  eventos por particion: ${porParticion.join(' / ')}`);
  const donde = ['292030', ...otros].map((id) => `${id}->${particion(id, n)}`).join('  ');
  console.log(`  cada juego: ${donde}\n`);
}