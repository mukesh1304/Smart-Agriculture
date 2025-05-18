// 🌍 Get User's Current Location for Weather & Map
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // ✅ Update Map with Current Location
                updateMap(lat, lon);

                // ✅ Fetch Weather for Current Location
                await fetchWeatherByCoordinates(lat, lon);
            },
            (error) => {
                alert("Unable to fetch location. Please enable GPS.");
                console.error(error);
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// 🌦️ Fetch Weather by Coordinates
async function fetchWeatherByCoordinates(lat, lon) {
    const apiKey = "63f1c5113f3df514a1433106b99852b0";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather data not available.");

        const data = await response.json();

        // ✅ Update Weather Info
        document.getElementById("temperature").textContent = data.main.temp;
        document.getElementById("humidity").textContent = data.main.humidity;
        document.getElementById("conditions").textContent = data.weather[0].description;
    } catch (error) {
        alert(error.message);
    }
}
function logout() {
    // Clear any stored user session (if applicable)
    localStorage.clear(); // Clear local storage
    sessionStorage.clear(); // Clear session storage

    // Redirect to index.html
    window.location.href = "index.html";
}

function soil() {
    // Redirect to soil.html
    window.location.href = "soil-monitoring/soil-monitoring.html";
}

function irrigation() {
    // Redirect to irrigation.html
    window.location.href = "irrigation-control/irrigation-control.html";
}

function pest() {
    // Redirect to pest.html   
    window.location.href = "pest-detection/pest-detection.html";
}


function goToProcess() {
    const cropPage = document.getElementById("cropSelect").value;
    if (cropPage) {
      window.location.href = cropPage;
    } else {
      alert("Please select a crop.");
    }
  }
  function updateMap(lat, lon) {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng: lon },
        zoom: 12,
    });

    new google.maps.Marker({
        position: { lat, lng: lon },
        map: map,
        title: "Your Location",
    });
}

function initMap() {
    new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 5,
    });
}

// 🌿 Fetch Data from Backend for Dashboard
async function fetchData() {
    try {
        const res = await fetch('http://localhost:8080/api/dashboard/data');
        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        // ✅ Update Weather Info
        document.getElementById('temperature').textContent = data.temperature ?? '--';
        document.getElementById('humidity').textContent = data.humidity ?? '--';
        document.getElementById('conditions').textContent = data.conditions ?? '--';

        // ✅ Update Progress Bars
        const soilMoisture = data.soilMoisture ?? 0;
        document.getElementById('soilMoisture').value = soilMoisture;
        document.getElementById('soilMoistureValue').textContent = `${soilMoisture}%`;

        const cropHealth = data.cropHealth ?? 0;
        document.getElementById('cropHealth').value = cropHealth;
        document.getElementById('cropHealthValue').textContent = `${cropHealth}%`;

        // ✅ Update Crop Health Chart
        updateCropHealthChart(cropHealth);

        // ✅ Populate Sensor Logs
        updateSensorLogs(data);

        // ✅ Manage Alerts
        updateAlerts(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        showErrorAlert();
    }
}

// ✅ Update Sensor Logs Table
function updateSensorLogs(data) {
    const tableBody = document.getElementById('sensorData');
    const newRow = `
        <tr>
            <td>${new Date().toLocaleTimeString()}</td>
            <td>${data.temperature ?? '--'}</td>
            <td>${data.humidity ?? '--'}</td>
            <td>${data.soilMoisture ?? '--'}</td>
            <td>${data.conditions ?? '--'}</td>
        </tr>
    `;
    tableBody.insertAdjacentHTML('afterbegin', newRow);

    // ✅ Keep only last 5 entries
    while (tableBody.rows.length > 5) {
        tableBody.deleteRow(-1);
    }
}

// ✅ Manage Alerts
function updateAlerts(data) {
    const alertsList = document.getElementById('alertsList');
    alertsList.innerHTML = ''; // Clear previous alerts

    if (data.soilMoisture < 30) {
        alertsList.insertAdjacentHTML('beforeend', `<li>🚨 Low soil moisture detected!</li>`);
    }
    if (data.cropHealth < 50) {
        alertsList.insertAdjacentHTML('beforeend', `<li>🚨 Crop health is below optimal level!</li>`);
    }
    if (data.temperature > 40) {
        alertsList.insertAdjacentHTML('beforeend', `<li>🚨 High temperature alert!</li>`);
    }
}

// ✅ Show Error Alert
function showErrorAlert() {
    const alertsList = document.getElementById('alertsList');
    if (!document.getElementById('alert-error')) {
        alertsList.insertAdjacentHTML('beforeend', `<li id="alert-error">❌ Failed to fetch data. Check backend connection.</li>`);
    }
}

// ✅ Initialize Crop Health Chart
let cropHealthChart;
function initCropHealthChart() {
    const ctx = document.getElementById('cropHealthChart').getContext('2d');
    cropHealthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Crop Health (%)',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                fill: true,
                tension: 0.3,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Time' }
                },
                y: {
                    title: { display: true, text: 'Crop Health (%)' },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

// ✅ Update Crop Health Chart
const cropHealthHistory = [];
const MAX_DATA_POINTS = 10;

function updateCropHealthChart(cropHealth) {
    const currentTime = new Date().toLocaleTimeString();
    cropHealthHistory.push({ time: currentTime, value: cropHealth });

    if (cropHealthHistory.length > MAX_DATA_POINTS) {
        cropHealthHistory.shift();
    }

    cropHealthChart.data.labels = cropHealthHistory.map(entry => entry.time);
    cropHealthChart.data.datasets[0].data = cropHealthHistory.map(entry => entry.value);
    cropHealthChart.update();
}

// 🔄 Auto Fetch Data Every 5 Seconds
setInterval(fetchData, 5000);
