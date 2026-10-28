# Lab A12-log

## Respuesta
```txt
PS C:\Users\po-alumno\DSY1107\A12-log> node log.mjs
append Celeste -> offset 0
append Hollow Knight -> offset 1
append Celeste -> offset 2

COLA
facturacion leyo: Celeste, Hollow Knight, Celeste
estadisticas leyo: nada
quedan en la cola: 0



LOG
facturacion leyo: Celeste, Hollow Knight, Celeste -> va en el offset 3
estadisticas leyo: Celeste -> va en el offset 1
quedan en el log: 3

PS C:\Users\po-alumno\DSY1107\A12-log> node retencion.mjs
El log tiene los offsets 0 a 9, una compra por dia.

1. estadisticas ya leyo todo. Cambia la formula: su offset vuelve a 0
   recalculo con {"Celeste":5,"Hades":3,"Terraria":2}

2. Hoy es el dia 10 y la retencion es de 7 dias
   el log ahora va del offset 3 al 9: 7 registros

3. historial es un grupo nuevo y parte de lo mas antiguo que queda
   leyo {"Terraria":2,"Hades":2,"Celeste":3}

4. facturacion estuvo caida. Se habia quedado en el offset 1
   el offset 1 ya no existe: la retencion lo borro. Se parte desde 3
   leyo 7 eventos; los offsets 1 y 2 no los va a ver nunca

PS C:\Users\po-alumno\DSY1107\A12-log> node particionar.mjs
comprobacion: murmur2('21') = -973932308 (Kafka espera -973932308)

Con 3 particiones
  eventos por particion: 150 / 90 / 60
  cada juego: 292030->0  1091500->1  1328670->2  413150->0  367520->1  105600->1  1145360->2

Con 4 particiones
  eventos por particion: 30 / 60 / 180 / 30
  cada juego: 292030->2  1091500->1  1328670->2  413150->2  367520->3  105600->0  1145360->1


PS C:\Users\po-alumno\DSY1107\A12-log> node asignar.mjs    
Topic vidalstore.actividad con 4 particiones

vidalstore-panel, 1 consumidor(es): c1=[0,1,2,3]  -> 0 sin trabajo
vidalstore-panel, 2 consumidor(es): c1=[0,2]  c2=[1,3]  -> 0 sin trabajo
vidalstore-panel, 4 consumidor(es): c1=[0]  c2=[1]  c3=[2]  c4=[3]  -> 0 sin trabajo
vidalstore-panel, 6 consumidor(es): c1=[0]  c2=[1]  c3=[2]  c4=[3]  c5=ocioso  c6=ocioso  -> 2 sin trabajo

Dos grupos distintos sobre el mismo topic
vidalstore-panel, 2 consumidor(es): c1=[0,2]  c2=[1,3]  -> 0 sin trabajo
vidalstore-alertas, 1 consumidor(es): c1=[0,1,2,3]  -> 0 sin trabajo
Cada grupo recibe las 4 particiones: todos los eventos llegan a los dos.

5. Porque el shift de facturacion al leer y usar shift, termino borrando los elementos antes de que estadisticas pudiera leerlos, log si pudo leerlos porque slice junto con el offset obtiene una copia parcial sin modificar la lista original.

6. Como el plazo de retencion es de 7 dias, en eso habria que haber arreglado la caida

7. Porque el juego 292030 es el mas jugado y al ir a la particion 0, termina aumentando el numero de eventos junto a 413150, que tambien va a la particion 0

8. correo.enviar va por cola, porque es un comando de procesamiento único donde un solo trabajador debe consumirlo y eliminarlo para no duplicar el envío.

compra.realizada va por log/stream, porque es un evento del pasado que múltiples servicios independientes (ej. facturación, inventario, métricas) necesitan leer de forma persistente.

partida.terminada va por log/stream, porque genera un flujo continuo de eventos a alta velocidad que requiere ser procesado o analizado en tiempo real por varios consumidores.
```