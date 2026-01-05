# 💰 Revenue Management Dashboard & Pricing Simulator

## Project Overview

This is a **fully functional web application** that demonstrates expertise in **Web Development** combined with **Revenue Management** business logic. The dashboard provides real-time revenue analytics and an interactive pricing simulator that allows users to adjust key parameters and observe their impact on business metrics.

This project is ideal for roles that require both technical development skills and business acumen, such as **Revenue Operations (RevOps)**, **Business Intelligence**, or **Full-Stack Development** positions.

## Key Features

### 1. **Performance Dashboard**
The left panel displays critical revenue metrics updated in real-time:
- **Average Daily Rate (ADR):** The average price per room
- **Occupancy Rate:** Percentage of rooms booked
- **RevPAR:** Revenue Per Available Room (key hospitality metric)
- **Total Daily Revenue:** Aggregate revenue calculation
- **7-Day Revenue Projection Chart:** Visual trend analysis with dynamic bar charts

### 2. **Interactive Pricing Simulator**
The right panel allows users to adjust business parameters and instantly see the impact:
- **Total Rooms Available:** Adjust the inventory size (10-500 rooms)
- **Base Price per Room:** Set the baseline pricing ($50-$300)
- **Target Occupancy Rate:** Define booking targets (30-100%)
- **Discount Factor:** Apply promotional discounts (0-50%)
- **Demand Multiplier:** Model demand fluctuations (0.5x-2x)

### 3. **Real-Time Results**
The simulator calculates and displays:
- **Effective Price:** Price after discounts and demand adjustments
- **Projected Daily Revenue:** Total revenue based on current parameters
- **Projected RevPAR:** Revenue efficiency metric
- **Revenue Change:** Percentage change vs. baseline (with color coding: green for positive, red for negative)

### 4. **Professional UI/UX**
- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile devices
- **Modern Aesthetics:** Gradient backgrounds, smooth animations, and intuitive controls
- **Interactive Charts:** Canvas-based revenue projection charts with real-time updates
- **Accessibility:** Clear labels, high contrast, and keyboard-friendly controls

## Technical Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic markup and structure |
| **CSS3** | Responsive design with gradients, flexbox, and grid layout |
| **JavaScript (ES6+)** | Interactive logic, calculations, and chart rendering |
| **Canvas API** | Dynamic chart rendering for revenue projections |

## Project Structure

```
project-revenue-management-web/
├── index.html          # Main HTML file with dashboard and simulator
├── styles.css          # Complete styling (responsive, modern design)
├── script.js           # JavaScript logic (calculations, interactivity, charts)
└── README.md           # This file
```

## How to Use

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mindset-code/project-revenue-management-web.git
   cd project-revenue-management-web
   ```

2. **Open in a browser:**
   Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).

3. **Interact with the simulator:**
   - Adjust the sliders and input fields on the right panel
   - Watch the dashboard metrics and chart update in real-time
   - Click "Calculate Revenue" to refresh calculations
   - Click "Reset to Defaults" to return to initial values

## Business Logic Explained

### Revenue Calculation Formula

```
Effective Price = Base Price × (1 - Discount Factor) × Demand Multiplier
Booked Rooms = Total Rooms × Occupancy Rate
Daily Revenue = Booked Rooms × Effective Price
RevPAR = Daily Revenue / Total Rooms
```

### Use Cases

This tool is valuable for:
- **Revenue Managers:** Optimize pricing strategies and occupancy targets
- **Business Analysts:** Model revenue scenarios and forecast impact
- **Operations Teams:** Understand the relationship between pricing, occupancy, and revenue
- **Executives:** Make data-driven decisions on pricing and capacity planning

## Key Metrics Explained

| Metric | Definition | Importance |
| :--- | :--- | :--- |
| **ADR** | Average Daily Rate per room | Indicates pricing power and market positioning |
| **Occupancy Rate** | Percentage of rooms booked | Measures demand and capacity utilization |
| **RevPAR** | Revenue Per Available Room | Most important hospitality KPI; combines ADR and occupancy |
| **Total Revenue** | Daily aggregate revenue | Bottom-line business performance |

## Features Demonstrated

- **Frontend Development:** HTML5, CSS3 (Flexbox, Grid, Gradients), Responsive Design
- **JavaScript Mastery:** Event listeners, DOM manipulation, real-time calculations
- **Data Visualization:** Canvas API for dynamic chart rendering
- **Business Logic:** Revenue management formulas and pricing optimization
- **User Experience:** Intuitive controls, real-time feedback, color-coded results
- **Code Quality:** Clean, well-commented, and maintainable JavaScript

## Future Enhancements

Potential improvements for a production version:
- Backend integration with a database (Node.js/Express, Python/Django)
- User authentication and saved scenarios
- Historical data analysis and trend forecasting
- Export functionality (CSV, PDF reports)
- Multi-property management support
- Advanced pricing algorithms (dynamic pricing, ML-based optimization)

## Author

**Mindset & Code**  
LinkedIn: [linkedin.com/company/mindset-codeú-027a3a120](https://www.linkedin.com/company/mindset-code/)  
GitHub: [@mindset-code](https://github.com/mindset-code)

## License

This project is open source and available under the MIT License.

---

**Built with:** HTML5 | CSS3 | JavaScript ES6+  
**Last Updated:** January 2025
