// Pruebas del simulador de revenue management.
//
// Se ejecutan con el runner que trae Node de serie -- `node --test` -- para no
// meter una cadena de dependencias en un proyecto que es una pagina estatica de
// tres ficheros sin build.
//
// Lo que persiguen: que las cifras que la pagina imprime UNA AL LADO DE OTRA
// cuadren entre ellas. RevPAR = ADR x ocupacion es la identidad que usa el
// sector, y el panel la incumplia: enseñaba el precio de tarifa como ADR
// mientras calculaba el RevPAR con el precio efectivo. Con un 20 % de descuento
// se leia ADR $150, ocupacion 75 % y RevPAR $90 -- y 150 x 0,75 son 112,50.

import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const require = createRequire(import.meta.url)
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const {
  computeMetrics,
  weeklyProjection,
  WEEKLY_PROFILE,
  WEEKDAYS,
  initialValues,
} = require(path.join(AQUI, '..', 'script.js'))

// Los cinco mandos, ya normalizados como los pasa la pagina.
const NEUTRO = {
  roomCount: 300,
  basePrice: 150,
  occupancyRate: 0.75,
  discountFactor: 0,
  demandMultiplier: 1,
}

const con = (cambios) => computeMetrics({ ...NEUTRO, ...cambios })
const cerca = (a, b, tol = 1e-9) =>
  assert.ok(Math.abs(a - b) <= tol, `${a} != ${b}`)

// --- La identidad del sector ---------------------------------------------

test('RevPAR es siempre ADR por ocupacion', async (t) => {
  const casos = [
    { descuento: 0, demanda: 1 },
    { descuento: 0.2, demanda: 1 },
    { descuento: 0.5, demanda: 1 },
    { descuento: 0, demanda: 2 },
    { descuento: 0.35, demanda: 1.7 },
    { descuento: 0.1, demanda: 0.5 },
  ]
  for (const { descuento, demanda } of casos) {
    for (const ocupacion of [0.3, 0.55, 0.75, 1.0]) {
      const m = con({
        discountFactor: descuento,
        demandMultiplier: demanda,
        occupancyRate: ocupacion,
      })
      cerca(m.revpar, m.adr * m.occupancyRate, 1e-9)
    }
  }
})

test('con un 20 % de descuento el panel ya no se contradice', () => {
  // El caso exacto que fallaba: ADR $150, ocupacion 75 %, RevPAR $90.
  const m = con({ discountFactor: 0.2 })
  cerca(m.adr, 120)
  cerca(m.revpar, 90)
  cerca(m.adr * m.occupancyRate, m.revpar)
})

test('el ingreso diario es RevPAR por las habitaciones del hotel', () => {
  for (const habitaciones of [10, 120, 300, 500]) {
    const m = con({ roomCount: habitaciones, discountFactor: 0.15 })
    cerca(m.dailyRevenue, m.revpar * habitaciones, 1e-8)
  }
})

test('el ingreso diario tambien es las habitaciones vendidas por su precio', () => {
  const m = con({ discountFactor: 0.3, demandMultiplier: 1.4 })
  cerca(m.dailyRevenue, m.bookedRooms * m.effectivePrice, 1e-8)
})

// --- Los valores por defecto que la pagina trae escritos -------------------

test('los valores iniciales dan las cifras impresas en el HTML', () => {
  const m = computeMetrics({
    roomCount: initialValues.roomCount,
    basePrice: initialValues.basePrice,
    occupancyRate: initialValues.occupancyRate / 100,
    discountFactor: initialValues.discountFactor / 100,
    demandMultiplier: initialValues.demandMultiplier,
  })
  cerca(m.adr, 150)
  cerca(m.revpar, 112.5)
  cerca(m.dailyRevenue, 33750)
  cerca(m.revenueChange, 0)
})

// --- Direccion de cada mando ----------------------------------------------

test('descontar baja el ingreso y subir la demanda lo sube', () => {
  const base = con({}).dailyRevenue
  assert.ok(con({ discountFactor: 0.2 }).dailyRevenue < base)
  assert.ok(con({ demandMultiplier: 1.5 }).dailyRevenue > base)
  assert.ok(con({ demandMultiplier: 0.5 }).dailyRevenue < base)
})

test('mas ocupacion nunca da menos ingreso', () => {
  let anterior = -Infinity
  for (const ocupacion of [0.3, 0.5, 0.7, 0.9, 1.0]) {
    const actual = con({ occupancyRate: ocupacion }).dailyRevenue
    assert.ok(actual >= anterior, `${ocupacion}: ${actual} < ${anterior}`)
    anterior = actual
  }
})

test('nunca se venden mas habitaciones de las que tiene el hotel', () => {
  for (const ocupacion of [0.3, 0.75, 1.0]) {
    const m = con({ roomCount: 300, occupancyRate: ocupacion })
    assert.ok(m.bookedRooms <= 300)
  }
})

test('la variacion frente a la referencia es cero cuando no se toca nada', () => {
  cerca(con({}).revenueChange, 0)
})

test('un descuento del 20 % sin prima de demanda es una caida del 20 %', () => {
  cerca(con({ discountFactor: 0.2 }).revenueChange, -20, 1e-9)
})

test('la variacion no depende del tamano del hotel', () => {
  const pequeno = con({ roomCount: 10, discountFactor: 0.25 }).revenueChange
  const grande = con({ roomCount: 500, discountFactor: 0.25 }).revenueChange
  cerca(pequeno, grande, 1e-9)
})

// --- Bordes ---------------------------------------------------------------

test('un mando a medio teclear no llena el panel de NaN', () => {
  // parseFloat de un campo vacio da NaN, y el NaN se propagaba a las ocho
  // cifras sin que nada protestara: el panel se llenaba de "$NaN".
  for (const roto of [
    { roomCount: NaN },
    { basePrice: NaN },
    { occupancyRate: NaN },
    { discountFactor: NaN },
    { demandMultiplier: NaN },
    { roomCount: Infinity },
  ]) {
    assert.equal(con(roto), null)
  }
})

test('un hotel sin habitaciones no divide entre cero', () => {
  assert.equal(con({ roomCount: 0 }), null)
  assert.equal(con({ roomCount: -5 }), null)
})

test('con el hotel vacio no hay ingreso pero tampoco hay NaN', () => {
  const m = con({ occupancyRate: 0 })
  cerca(m.dailyRevenue, 0)
  cerca(m.revpar, 0)
  cerca(m.revenueChange, 0)
})

test('un precio de cero no revienta la variacion', () => {
  const m = con({ basePrice: 0 })
  assert.ok(Number.isFinite(m.revenueChange))
  cerca(m.revenueChange, 0)
})

test('todas las cifras devueltas son numeros finitos', () => {
  const m = con({ discountFactor: 0.5, demandMultiplier: 2, occupancyRate: 1 })
  for (const [clave, valor] of Object.entries(m)) {
    assert.ok(Number.isFinite(valor), `${clave} = ${valor}`)
  }
})

// --- La proyeccion semanal ------------------------------------------------

test('los siete factores suman exactamente siete', () => {
  // Es lo que hace que la semana valga siete veces el dia impreso al lado.
  // Se comprueba la regla, no el numero de hoy: si alguien retoca un factor
  // sin recolocar los demas, el grafico se separa de sus propias metricas.
  const suma = WEEKLY_PROFILE.reduce((a, b) => a + b, 0)
  cerca(suma, 7, 1e-9)
})

test('la semana proyectada vale siete dias del ingreso diario', () => {
  const diario = con({}).dailyRevenue
  const semana = weeklyProjection(diario).reduce((a, b) => a + b, 0)
  cerca(semana, diario * 7, 1e-6)
})

test('hay un factor por dia y un dia por factor', () => {
  assert.equal(WEEKLY_PROFILE.length, 7)
  assert.equal(WEEKDAYS.length, 7)
  assert.deepEqual(WEEKDAYS, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
})

test('el perfil es el de un hotel urbano: fin de semana lleno, domingo flojo', () => {
  const [lun, mar, mie, jue, vie, sab, dom] = WEEKLY_PROFILE
  assert.ok(vie > jue, 'el viernes tiene que superar al jueves')
  assert.ok(sab > vie, 'el sabado es el pico')
  assert.ok(dom < lun, 'el domingo es dia de salida')
  assert.ok(Math.min(mar, mie) > 0.5)
})

test('la proyeccion es proporcional: doble ingreso, doble semana', () => {
  const a = weeklyProjection(1000)
  const b = weeklyProjection(2000)
  a.forEach((valor, i) => cerca(b[i], valor * 2, 1e-9))
})

test('la proyeccion no lleva azar: dos llamadas dan lo mismo', () => {
  // Antes era Math.random() en cada repintado, y como el grafico se repinta al
  // mover cualquier mando, el efecto del mando se perdia dentro del ruido.
  assert.deepEqual(weeklyProjection(33750), weeklyProjection(33750))
})

test('un ingreso de cero proyecta una semana de ceros, no NaN', () => {
  for (const valor of weeklyProjection(0)) {
    assert.equal(valor, 0)
  }
})
