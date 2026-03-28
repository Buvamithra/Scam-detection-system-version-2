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
        plugins: { legend: { display: false } }
    }
});

function analyzeOffer() {

    let data = {
        offer_title: document.getElementById("offer_title").value,
        website: document.getElementById("website").value,
        description: document.getElementById("description").value,
        discount: document.getElementById("discount").value,
        asks_otp: document.getElementById("asks_otp").value,
        asks_payment: document.getElementById("asks_payment").value,
        limited_time: document.getElementById("limited_time").value
    };

    fetch('/predict-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {

        let risk = response.risk;
        document.getElementById("riskLabel").innerText = response.status;
        document.getElementById("probability").innerText =
            "Fraud Probability: " + risk.toFixed(2) + "%";

        riskChart.data.datasets[0].data = [risk, 100 - risk];

        let color = risk < 30 ? "#00ffcc"
                  : risk < 60 ? "#ffcc00"
                  : "#ff0033";

        riskChart.data.datasets[0].backgroundColor[0] = color;
        riskChart.update();

        addToHistory(data.offer_title, risk);

    })
    .catch(err => console.error(err));
}

function addToHistory(title, risk) {
    let li = document.createElement("li");
    li.innerText = `${title} - ${risk.toFixed(2)}%`;
    document.getElementById("historyList").prepend(li);
}
