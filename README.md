# Revenue Management Dashboard & Pricing Simulator

> **Web Development Portfolio Project** · Vanilla JS · RevOps · Interactive simulator
> **Status:** Finished · Portfolio showcase (2026-04)

[![Portfolio](https://img.shields.io/badge/Portfolio-proyectos--personales.web.app-60a5fa?style=for-the-badge&logo=firebase&logoColor=white)](https://proyectos-personales.web.app)
[![Stack](https://img.shields.io/badge/Stack-HTML%2FCSS%2FJS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](.)
[![Domain](https://img.shields.io/badge/Domain-Revenue%20Management-003366?style=for-the-badge)](.)

---

## Project Status

| Phase | Status |
|---|---|
| Dashboard UI con KPIs en tiempo real | Done |
| Pricing simulator interactivo (5 parámetros) | Done |
| Canvas chart de proyección 7 días | Done |
| Responsive design (desktop/tablet/mobile) | Done |

**Current phase:** portfolio showcase — ejemplo de stack minimal con lógica de negocio completa.

---

## Project Overview

Web app completamente funcional que combina **Web Development** con lógica de **Revenue Management**. El dashboard muestra métricas de ingresos en tiempo real y un **simulador interactivo** permite ajustar parámetros y observar el impacto instantáneo en KPIs de hospitalidad.

Ideal para roles que combinan desarrollo técnico con *business acumen*: **Revenue Operations**, **Business Intelligence** o **Full-Stack**.

---

## Key Features

### Performance Dashboard (panel izquierdo)

Métricas de ingreso actualizadas en tiempo real:
- **ADR** (Average Daily Rate) — precio medio por habitación
- **Occupancy Rate** — % de habitaciones ocupadas
- **RevPAR** (Revenue Per Available Room) — KPI clave en hospitality
- **Total Daily Revenue** — ingreso agregado del día
- **7-Day Revenue Projection Chart** — tendencia visual en canvas

### Interactive Pricing Simulator (panel derecho)

Ajusta parámetros y ve impacto inmediato:

| Parámetro | Rango |
|---|---|
| Total Rooms Available | 10 – 500 |
| Base Price per Room | $50 – $300 |
| Target Occupancy Rate | 30% – 100% |
| Discount Factor | 0% – 50% |
| Demand Multiplier | 0.5× – 2× |

### Real-Time Results

- **Effective Price** tras descuentos y ajuste por demanda
- **Projected Daily Revenue** bajo los parámetros actuales
- **Projected RevPAR**
- **Revenue Change %** vs baseline (verde = positivo, rojo = negativo)

---

## Business Logic

### Fórmula de ingresos

```
Effective Price  = Base Price × (1 − Discount Factor) × Demand Multiplier
Booked Rooms    = Total Rooms × Occupancy Rate
Daily Revenue   = Booked Rooms × Effective Price
RevPAR          = Daily Revenue / Total Rooms
```

### Use cases

- **Revenue Managers** — optimizar estrategia de precios y ocupación
- **Business Analysts** — modelar escenarios de ingreso
- **Operations Teams** — entender la relación precio–ocupación–revenue
- **Executives** — decisiones basadas en datos sobre capacity planning

---

## Skills Demostradas

- **Frontend Development:** HTML5, CSS3 (Flexbox, Grid, gradientes), diseño responsive
- **JavaScript ES6+:** event listeners, DOM manipulation, cálculos en tiempo real
- **Data Visualization:** Canvas API para charts dinámicos
- **Business Logic:** fórmulas Revenue Management + pricing optimization
- **UX:** controles intuitivos, feedback en tiempo real, código con color
- **Code Quality:** JS limpio, comentado, mantenible

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 semántico |
| Style | CSS3 (Flexbox + Grid + gradientes) |
| Logic | JavaScript ES6+ |
| Charts | Canvas API (sin librerías externas) |

---

## Project Structure

```
project-revenue-management-web/
├── index.html          # Dashboard + simulador
├── styles.css          # Estilos responsive
├── script.js           # Lógica + charts
└── README.md
```

---

## How to Use

```bash
git clone https://github.com/mindset-code/project-revenue-management-web.git
cd project-revenue-management-web
# Abre index.html en cualquier navegador moderno
```

1. Ajusta sliders / inputs del panel derecho
2. Observa KPIs y chart actualizándose en tiempo real
3. **Calculate Revenue** — refresca cálculos
4. **Reset to Defaults** — vuelve a valores iniciales

---

## Future Enhancements

Posibles mejoras para versión de producción:
- Backend con DB (Node.js/Express · Python/Django)
- Autenticación y escenarios guardados
- Análisis histórico y forecasting
- Exportar reportes (CSV / PDF)
- Multi-property management
- Algoritmos de *dynamic pricing* basados en ML

---

## License

MIT License

---

## Links

- **Portfolio:** [proyectos-personales.web.app](https://proyectos-personales.web.app)
- **LinkedIn:** [Mindset & Code](https://www.linkedin.com/company/mindset-code)
- **Email:** contacto@mindset-code.com

---

*Built by [Mindset & Code](https://github.com/mindset-code) · Data & BI Analyst · MBA · ISC2 CC*
