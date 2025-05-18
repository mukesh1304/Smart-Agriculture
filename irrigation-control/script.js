const irrigationState = document.getElementById('irrigationState');
const startIrrigationBtn = document.getElementById('startIrrigation');
const stopIrrigationBtn = document.getElementById('stopIrrigation');
const scheduleForm = document.getElementById('scheduleForm');

// ✅ Start Irrigation
startIrrigationBtn.addEventListener('click', async () => {
    try {
        const res = await fetch('http://localhost:8080/api/irrigation/start', {
            method: 'POST'
        });
        const data = await res.json();

        if (data.status === 'on') {
            irrigationState.textContent = 'ON';
            irrigationState.style.color = 'green';
        }
    } catch (error) {
        console.error('Failed to start irrigation:', error);
    }
});

// ✅ Stop Irrigation
stopIrrigationBtn.addEventListener('click', async () => {
    try {
        const res = await fetch('http://localhost:8080/api/irrigation/stop', {
            method: 'POST'
        });
        const data = await res.json();

        if (data.status === 'off') {
            irrigationState.textContent = 'OFF';
            irrigationState.style.color = 'red';
        }
    } catch (error) {
        console.error('Failed to stop irrigation:', error);
    }
});

// ✅ Set Irrigation Schedule
scheduleForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    try {
        const res = await fetch('http://localhost:8080/api/irrigation/schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ startTime, endTime })
        });
        const data = await res.json();

        if (data.success) {
            alert(`Irrigation scheduled from ${startTime} to ${endTime}`);
        } else {
            alert('Failed to set schedule');
        }
    } catch (error) {
        console.error('Failed to set irrigation schedule:', error);
    }
});

// ✅ Logout Function
function dashboard() {
    window.location.href = '../dashboard.html';
}
