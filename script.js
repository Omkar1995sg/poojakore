function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function openModal(id) {
    document.getElementById(id).style.display = 'block';
}

function loadEventsFromExcel() {
    fetch('https://raw.githubusercontent.com/poojakore0606/eventattmv/main/events.xlsx')
        .then(res => res.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets['Events'];
            const events = XLSX.utils.sheet_to_json(sheet);
            const container = document.getElementById('eventCards');
            events.forEach(event => {
                const card = document.createElement('div');
                card.className = 'event';
                card.innerHTML = `
                    <h4>${event['Event Name']}</h4>
                    <p>Date: ${event['Date']}</p>
                    <p>Location: ${event['Location']}</p>
                    <p>Time: ${event['Time']}</p>
                    <p>Speaker: ${event['Speaker']}</p>
                    <button onclick="showRegister('${event['Event Name']}', '${event['Date']}')">Register</button>
                `;
                container.appendChild(card);
            });
        });
}

function showRegister(eventName, eventDate) {
    document.getElementById('eventName').value = eventName;
    document.getElementById('eventDate').value = eventDate;
    openModal('registerModal');
}

document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const event = document.getElementById('eventName').value;
    const date = document.getElementById('eventDate').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const contact = document.getElementById('contact').value;
    const studentClass = document.getElementById('class').value;
    const year = document.getElementById('year').value;

    const newRow = {
        Event: event,
        Date: date,
        Name: name,
        Email: email,
        Contact: contact,
        Class: studentClass,
        Year: year
    };

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([newRow]);
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
    XLSX.writeFile(wb, 'registration.xlsx');

    alert('Registration saved. Please upload registration.xlsx to GitHub.');
    closeModal('registerModal');
});

window.onload = loadEventsFromExcel;