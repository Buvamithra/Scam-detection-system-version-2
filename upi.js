// 🔥 DONUT CHART
const ctx = document.getElementById("riskChart").getContext("2d");

const riskChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [10, 90],
            backgroundColor: ['#00ffcc', 'rgba(0,0,0,0.1)'],
            borderWidth: 0
        }]
    },
    options: {
        cutout: '75%',
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        },
        animation: {
            animateRotate: true,
            duration: 1000
        }
    }
});

// 🔥 LEAFLET MAP
var map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);


// 🔥 ANALYZE TRANSACTION
function analyzeTransaction() {

    let data = {
        upi_id: document.getElementById("upi_id").value,
        location: document.getElementById("location").value,
        amount: document.getElementById("amount").value,
        is_new_upi: document.getElementById("is_new_upi").value,
        is_blacklisted: document.getElementById("is_blacklisted").value,
        night_transaction: document.getElementById("night_transaction").value,
        location_risk: document.getElementById("location_risk").value
    };

    fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {

        let risk = response.risk;
        let label = document.getElementById("riskLabel");

        riskChart.data.datasets[0].data = [risk, 100 - risk];

        let color;
        let textClass;

        if (risk < 30) {
            color = "#00ffcc";
            label.innerText = "SAFE";
            textClass = "safe";
        } 
        else if (risk < 60) {
            color = "#ffcc00";
            label.innerText = "RISK";
            textClass = "risk";
        } 
        else {
            color = "#ff0033";
            label.innerText = "SCAM";
            textClass = "scam";
        }

        riskChart.data.datasets[0].backgroundColor[0] = color;
        riskChart.update();

        label.className = "center-text " + textClass;

        // 🔥 Plot real city location
        if (response.location) {
            addFraudLocation(response.location, risk);
        }

    })
    .catch(error => {
        console.error("Frontend Error:", error);
        alert("JavaScript Error. Check Browser Console (F12).");
    });
}


// 🔥 REAL-TIME GEOCODING USING OPENSTREETMAP
function addFraudLocation(city, risk) {

    let color = risk > 60 ? "red" : "orange";

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)
        .then(res => res.json())
        .then(data => {

            if (data.length === 0) {
                alert("Location not found on map.");
                return;
            }

            let lat = parseFloat(data[0].lat);
            let lon = parseFloat(data[0].lon);

            map.setView([lat, lon], 10);

            L.circleMarker([lat, lon], {
                radius: 12,
                color: color,
                fillColor: color,
                fillOpacity: 0.6
            }).addTo(map)
            .bindPopup(`<b>${city}</b><br>Risk: ${risk.toFixed(2)}%`)
            .openPopup();

        })
        .catch(error => {
            console.error("Geocoding error:", error);
        });
}


// 🔥 REPORT BUTTON
function goToCyberCrime() {
    window.open("https://cybercrime.gov.in/", "_blank");
}
