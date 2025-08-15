// Pricing Calculator Logic
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('minutesSlider');
    const minutesDisplay = document.getElementById('minutesDisplay');
    const totalCostDisplay = document.getElementById('totalCost');
    const currentRateDisplay = document.getElementById('currentRate');
    const breakdownDetails = document.getElementById('breakdownDetails');
    
    const tier1 = document.getElementById('tier1');
    const tier2 = document.getElementById('tier2');
    const tier3 = document.getElementById('tier3');

    // Pricing tiers
    const tiers = [
        { min: 0, max: 6000, rate: 0.38, name: 'Starter' },
        { min: 6000, max: 20000, rate: 0.34, name: 'Growth' },
        { min: 20000, max: Infinity, rate: 0.29, name: 'Enterprise' }
    ];

    function formatNumber(num) {
        return num.toLocaleString();
    }

    function formatCurrency(amount) {
        return '$' + amount.toFixed(2);
    }

    function calculateCost(minutes) {
        let totalCost = 0;
        let breakdown = [];
        let remainingMinutes = minutes;
        let currentRate = 0;

        for (let i = 0; i < tiers.length && remainingMinutes > 0; i++) {
            const tier = tiers[i];
            const tierMinutes = Math.min(remainingMinutes, tier.max - tier.min);
            
            if (tierMinutes > 0) {
                const tierCost = tierMinutes * tier.rate;
                totalCost += tierCost;
                currentRate = tier.rate;
                
                breakdown.push({
                    minutes: tierMinutes,
                    rate: tier.rate,
                    cost: tierCost,
                    tier: tier.name
                });
                
                remainingMinutes -= tierMinutes;
            }
        }

        return { totalCost, breakdown, currentRate };
    }

    function updateTierHighlight(minutes) {
        // Reset all tiers
        [tier1, tier2, tier3].forEach(tier => {
            tier.style.background = '';
            tier.style.borderColor = '';
            tier.style.transform = '';
        });

        // Highlight active tier
        let activeTier;
        if (minutes <= 6000) {
            activeTier = tier1;
        } else if (minutes <= 20000) {
            activeTier = tier2;
        } else {
            activeTier = tier3;
        }

        if (activeTier) {
            activeTier.style.background = 'linear-gradient(98.24deg, #F9F9FF 0%, #EBECF7 100%)';
            activeTier.style.borderColor = '#5B6AF0';
            activeTier.style.transform = 'translateY(-4px)';
        }
    }

    function updateDisplay() {
        const minutes = parseInt(slider.value);
        const { totalCost, breakdown, currentRate } = calculateCost(minutes);

        // Update displays
        minutesDisplay.textContent = formatNumber(minutes);
        totalCostDisplay.textContent = formatCurrency(totalCost);
        currentRateDisplay.textContent = formatCurrency(currentRate);

        // Update breakdown
        breakdownDetails.innerHTML = '';
        breakdown.forEach(item => {
            const div = document.createElement('div');
            div.className = 'd-flex justify-content-between mb-2';
            div.innerHTML = `
                <span class="text-muted">${formatNumber(item.minutes)} minutes at ${formatCurrency(item.rate)}/min</span>
                <span class="fw-semibold">${formatCurrency(item.cost)}</span>
            `;
            breakdownDetails.appendChild(div);
        });

        // Add total if multiple tiers
        if (breakdown.length > 1) {
            const totalDiv = document.createElement('div');
            totalDiv.className = 'd-flex justify-content-between pt-2 border-top';
            totalDiv.innerHTML = `
                <span class="fw-semibold">Total</span>
                <span class="fw-bold">${formatCurrency(totalCost)}</span>
            `;
            breakdownDetails.appendChild(totalDiv);
        }

        // Update tier highlighting
        updateTierHighlight(minutes);
    }

    // Event listeners
    slider.addEventListener('input', updateDisplay);

    // Initialize
    updateDisplay();

    // Add smooth slider styling
    const style = document.createElement('style');
    style.textContent = `
        .form-range {
            background: linear-gradient(98.24deg, #FFB36D 0%, #EC5353 50%, #5B6AF0 100%);
            border-radius: 4px;
            outline: none;
            -webkit-appearance: none;
        }
        
        .form-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #fff;
            border: 3px solid #5B6AF0;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
        }
        
        .form-range::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .form-range::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #fff;
            border: 3px solid #5B6AF0;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
        }
        
        .form-range::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(style);
});