// ============================================
// Revenue Management Dashboard - JavaScript Logic
// ============================================

// Initial Values
const initialValues = {
    roomCount: 300,
    basePrice: 150,
    occupancyRate: 75,
    discountFactor: 0,
    demandMultiplier: 1
};

// Chart instance (for revenue projection)
let chartInstance = null;

// 7-day projection profile.
//
// This used to be Math.random() on every redraw: since the chart is redrawn on
// every slider move, the curve jumped around at random and the effect of the
// lever you were actually moving got lost in the noise -- which is the one
// thing this simulator exists to show.
//
// The weekly profile is fixed and it is the shape of an urban hotel: quiet
// Monday to Thursday, full on Friday and Saturday, checkout Sunday. The seven
// factors add up to exactly 7, so the week totals seven times the daily
// revenue shown in the metrics and the chart cannot drift away from the
// numbers printed next to it. That sum is pinned by a test.
const WEEKLY_PROFILE = [0.92, 0.94, 0.97, 1.02, 1.12, 1.15, 0.88];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function weeklyProjection(dailyRevenue) {
    return WEEKLY_PROFILE.map(factor => dailyRevenue * factor);
}

// Initialize on page load.
//
// Guarded because the test runner loads this same file in Node, where there is
// no document. In the browser nothing changes: the listener registers exactly
// as before.
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        setupEventListeners();
        calculateRevenue();
        drawRevenueChart();
    });
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    const inputs = document.querySelectorAll('input[type="range"], input[type="number"]');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            updateSliderValue(this);
            calculateRevenue();
            drawRevenueChart();
        });
    });
}

function updateSliderValue(input) {
    const valueSpan = document.getElementById(input.id + 'Value');
    if (valueSpan) {
        let displayValue = input.value;
        
        if (input.id === 'basePrice') {
            displayValue = '$' + parseFloat(input.value).toFixed(2);
        } else if (input.id === 'occupancyRate' || input.id === 'discountFactor') {
            displayValue = input.value + '%';
        } else if (input.id === 'demandMultiplier') {
            displayValue = parseFloat(input.value).toFixed(1) + 'x';
        }
        
        valueSpan.textContent = displayValue;
    }
}

// ============================================
// Revenue Calculation Logic
// ============================================

/**
 * The whole model of the simulator, with no DOM in sight so it can be tested.
 *
 * Takes the five levers already normalised (occupancy and discount as
 * fractions, not percentages) and returns every figure the page prints.
 *
 * `adr` is the EFFECTIVE rate, not the base price. The panel used to print the
 * base price as ADR while computing RevPAR from the effective one: set the
 * discount to 20 % and the three metrics sitting side by side read ADR $150,
 * occupancy 75 %, RevPAR $90 -- and 150 x 0.75 is 112.50, not 90. RevPAR = ADR
 * x occupancy is the definition the industry uses; the fix is to show the rate
 * actually being charged, which is what the revenue below is built from.
 */
function computeMetrics(levers) {
    const roomCount = Number(levers.roomCount);
    const basePrice = Number(levers.basePrice);
    const occupancyRate = Number(levers.occupancyRate);
    const discountFactor = Number(levers.discountFactor);
    const demandMultiplier = Number(levers.demandMultiplier);

    // A cleared number field yields NaN, and NaN spreads through every figure
    // without raising anything: the dashboard just fills with "$NaN".
    if (![roomCount, basePrice, occupancyRate, discountFactor, demandMultiplier]
            .every(Number.isFinite) || roomCount <= 0) {
        return null;
    }

    const effectivePrice = basePrice * (1 - discountFactor) * demandMultiplier;
    const bookedRooms = roomCount * occupancyRate;
    const dailyRevenue = bookedRooms * effectivePrice;
    const revpar = dailyRevenue / roomCount;

    // Baseline = same hotel, same occupancy, list price and no demand premium.
    const baselineRevenue = roomCount * occupancyRate * basePrice;
    const revenueChange = baselineRevenue === 0
        ? 0
        : ((dailyRevenue - baselineRevenue) / baselineRevenue) * 100;

    return {
        adr: effectivePrice,
        occupancyRate: occupancyRate,
        bookedRooms: bookedRooms,
        effectivePrice: effectivePrice,
        dailyRevenue: dailyRevenue,
        revpar: revpar,
        baselineRevenue: baselineRevenue,
        revenueChange: revenueChange,
    };
}

function calculateRevenue() {
    // Get form values
    const roomCount = parseFloat(document.getElementById('roomCount').value);
    const basePrice = parseFloat(document.getElementById('basePrice').value);
    const occupancyRate = parseFloat(document.getElementById('occupancyRate').value) / 100;
    const discountFactor = parseFloat(document.getElementById('discountFactor').value) / 100;
    const demandMultiplier = parseFloat(document.getElementById('demandMultiplier').value);

    const m = computeMetrics({
        roomCount: roomCount,
        basePrice: basePrice,
        occupancyRate: occupancyRate,
        discountFactor: discountFactor,
        demandMultiplier: demandMultiplier,
    });
    if (!m) {
        return;   // lever half-typed: leave the last valid figures on screen
    }

    const effectivePrice = m.effectivePrice;
    const dailyRevenue = m.dailyRevenue;
    const revpar = m.revpar;
    const revenueChange = m.revenueChange;

    // Update Dashboard Metrics (Current Performance)
    document.getElementById('adr').textContent = '$' + m.adr.toFixed(2);
    document.getElementById('occupancy').textContent = (occupancyRate * 100).toFixed(0) + '%';
    document.getElementById('revpar').textContent = '$' + revpar.toFixed(2);
    document.getElementById('totalRevenue').textContent = '$' + dailyRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    
    // Update Simulation Results
    document.getElementById('effectivePrice').textContent = '$' + effectivePrice.toFixed(2);
    document.getElementById('projectedRevenue').textContent = '$' + dailyRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('projectedRevPAR').textContent = '$' + revpar.toFixed(2);
    
    // Update Revenue Change with color coding
    const changeElement = document.getElementById('revenueChange');
    const changeText = (revenueChange >= 0 ? '+' : '') + revenueChange.toFixed(2) + '%';
    changeElement.textContent = changeText;
    
    if (revenueChange > 0) {
        changeElement.className = 'positive';
    } else if (revenueChange < 0) {
        changeElement.className = 'negative';
    } else {
        changeElement.className = 'neutral';
    }
    
    // Store values for chart
    window.currentRevenue = dailyRevenue;
    window.currentRevPAR = revpar;
}

// ============================================
// Chart Drawing (Revenue Projection)
// ============================================

function drawRevenueChart() {
    const canvas = document.getElementById('revenueChart');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get current revenue
    const currentRevenue = window.currentRevenue || 33750;
    
    // The profile and the day labels live at the top of the file, where a test
    // can reach them. See the comment there for why they are not random.
    const days = WEEKDAYS;
    const revenues = weeklyProjection(currentRevenue);
    
    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    // Find min and max for scaling
    const maxRevenue = Math.max(...revenues) * 1.1;
    const minRevenue = Math.min(...revenues) * 0.9;
    const range = maxRevenue - minRevenue;
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    
    // Draw bars
    const barWidth = chartWidth / days.length;
    const barPadding = 10;
    
    revenues.forEach((revenue, index) => {
        const x = padding + index * barWidth + barPadding;
        const barHeight = (revenue - minRevenue) / range * chartHeight;
        const y = canvas.height - padding - barHeight;
        
        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(x, y, x, canvas.height - padding);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2 * barPadding, barHeight);
        
        // Draw label
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(days[index], x + (barWidth - 2 * barPadding) / 2, canvas.height - padding + 20);
        
        // Draw value on top of bar
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 11px Arial';
        ctx.fillText('$' + (revenue / 1000).toFixed(1) + 'k', x + (barWidth - 2 * barPadding) / 2, y - 5);
    });
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw Y-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = minRevenue + (range / 5) * i;
        const y = canvas.height - padding - (chartHeight / 5) * i;
        ctx.fillText('$' + (value / 1000).toFixed(0) + 'k', padding - 10, y + 4);
    }
}

// ============================================
// Form Reset Function
// ============================================

function resetForm() {
    document.getElementById('roomCount').value = initialValues.roomCount;
    document.getElementById('basePrice').value = initialValues.basePrice;
    document.getElementById('occupancyRate').value = initialValues.occupancyRate;
    document.getElementById('discountFactor').value = initialValues.discountFactor;
    document.getElementById('demandMultiplier').value = initialValues.demandMultiplier;
    
    // Update all slider values
    document.querySelectorAll('input[type="range"], input[type="number"]').forEach(input => {
        updateSliderValue(input);
    });
    
    calculateRevenue();
    drawRevenueChart();
}

// ============================================
// Test hook
// ============================================
//
// The page loads this file with a plain <script> tag, so everything above has
// to stay in the global scope. This block only exists when the file is required
// from Node (the test runner) and is invisible to the browser.

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        computeMetrics,
        weeklyProjection,
        WEEKLY_PROFILE,
        WEEKDAYS,
        initialValues,
    };
}
