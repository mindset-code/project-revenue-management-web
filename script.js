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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    calculateRevenue();
    drawRevenueChart();
});

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

function calculateRevenue() {
    // Get form values
    const roomCount = parseFloat(document.getElementById('roomCount').value);
    const basePrice = parseFloat(document.getElementById('basePrice').value);
    const occupancyRate = parseFloat(document.getElementById('occupancyRate').value) / 100;
    const discountFactor = parseFloat(document.getElementById('discountFactor').value) / 100;
    const demandMultiplier = parseFloat(document.getElementById('demandMultiplier').value);
    
    // Calculate effective price (with discount)
    const effectivePrice = basePrice * (1 - discountFactor) * demandMultiplier;
    
    // Calculate booked rooms
    const bookedRooms = roomCount * occupancyRate;
    
    // Calculate daily revenue
    const dailyRevenue = bookedRooms * effectivePrice;
    
    // Calculate RevPAR (Revenue Per Available Room)
    const revpar = dailyRevenue / roomCount;
    
    // Calculate current baseline revenue (for comparison)
    const baselineRevenue = roomCount * occupancyRate * basePrice;
    const revenueChange = ((dailyRevenue - baselineRevenue) / baselineRevenue) * 100;
    
    // Update Dashboard Metrics (Current Performance)
    document.getElementById('adr').textContent = '$' + basePrice.toFixed(2);
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
    
    // 7-day projection.
    //
    // This used to be Math.random() on every redraw: since the chart is
    // redrawn on every slider move, the curve jumped around at random and
    // the effect of the lever you were actually moving got lost in the
    // noise -- which is the one thing this simulator exists to show.
    //
    // The weekly profile is fixed and it is the shape of an urban hotel:
    // quiet Monday to Thursday, full on Friday and Saturday, checkout
    // Sunday. The seven factors average exactly 1.0, so the week adds up
    // to seven times the daily revenue shown in the metrics and the chart
    // cannot drift away from the numbers next to it.
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const WEEKLY_PROFILE = [0.92, 0.94, 0.97, 1.02, 1.12, 1.15, 0.88];
    const revenues = WEEKLY_PROFILE.map(factor => currentRevenue * factor);
    
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
