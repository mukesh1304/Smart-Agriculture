// Fetch Data from Backend
async function fetchData() {
    try {
        const res = await fetch('http://localhost:8080/api/soil');
        if (!res.ok) throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        const data = await res.json();

        // ✅ Update Soil Data
        document.getElementById('soilMoisture').value = data.moisture ?? 0;
        document.getElementById('soilMoistureValue').textContent = `${data.moisture ?? '--'}%`;

        document.getElementById('soilNutrients').value = data.nutrients ?? 0;
        document.getElementById('soilNutrientsValue').textContent = `${data.nutrients ?? '--'}%`;

        document.getElementById('soilPH').value = data.ph ?? 0;
        document.getElementById('soilPHValue').textContent = `${data.ph ?? '--'}`;

        // ✅ Add Data to Table
        const tableBody = document.getElementById('sensorData');
        const newRow = `
            <tr>
                <td>${new Date().toLocaleTimeString()}</td>
                <td>${data.moisture ?? '--'}</td>
                <td>${data.nutrients ?? '--'}</td>
                <td>${data.ph ?? '--'}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('afterbegin', newRow);

        // ✅ Keep only last 5 entries
        while (tableBody.rows.length > 5) {
            tableBody.deleteRow(-1);
        }

        // ✅ Alerts
        const alertsList = document.getElementById('alertsList');
        alertsList.innerHTML = '';
        if (data.moisture < 30) alertsList.insertAdjacentHTML('beforeend', `<li>⚠️ Low soil moisture!</li>`);
        if (data.nutrients < 40) alertsList.insertAdjacentHTML('beforeend', `<li>⚠️ Low nutrient levels!</li>`);
        if (data.ph < 5 || data.ph > 8) alertsList.insertAdjacentHTML('beforeend', `<li>⚠️ Unbalanced soil pH!</li>`);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();
setInterval(fetchData, 5000);

function dashboard() {
    window.location.href = '../dashboard.html';
}
