const mySubjects = [
    'artificial intelligence',
    'digital image',
    'communication skills',
    'corruption',
    'object-oriented programming',
];

chrome.runtime.onMessage.addListener((msg) => {
	switch (msg.type) {
		case 'SCRAPED_DATA':
			combs = msg.payload;

			// Error handling
			if (!combs[0]) {
				showPopup('error', 'No valid combinations found. (Try checking if subject names are unique)');
				break;
			}

			renderTimetable(currentIndex);
			const len = combs.length;
			document.getElementById('total').innerText = `/ ${len}`;
			showPopup('success', `Refreshed (${len} combinations found)`);
			break;

		case 'POPUP':
			showPopup(msg.status, msg.payload);
	}
});

const colorMap = new Map();
let colorIndex = 0;
let currentIndex = 0;
let combs = [];
let popupTimeout;

const COLORS = [
	'#FF9AA2',
	'#12F48E',
	'#FFCC80',
	'#4FC3F7',
	'#C792EA',
	'#64B5F6'
]

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

// toLower
mySubjects.forEach((mySubject, i) => {
    mySubjects[i] = mySubject.toLowerCase();
});

// Create empty timetable
function createTimetable() {
    const table = document.querySelector('#table');

    // Create thead
	const header = createHeader();
	table.appendChild(header);

    // Create tbody
	const cols = header.querySelectorAll('th').length - 1;
	const tbody = createTbody(cols);
	table.appendChild(tbody);
}

function createHeader() {
    const header = document.createElement('thead');
    const headerRow = document.createElement('tr');
	const emptyCell = document.createElement('th');
	emptyCell.id = 'empty';
	headerRow.classList.add('table-primary');
    headerRow.appendChild(emptyCell);
    header.appendChild(headerRow);

    let time = 800;
    while (time < 1900) {
        const timeStr = time.toString();
        const splitAt = timeStr.length - 2;
        const hour = timeStr.slice(0, splitAt);
        const min = timeStr.slice(splitAt);

        let hour2, min2;
        if (min == '00') {
            hour2 = hour;
            min2 = '30';
        } else {
            hour2 = parseInt(hour) + 1;
            min2 = '00';
        }
        
        const th = document.createElement('th');
        th.innerHTML = `${hour}:${min}<br>-<br>${hour2}:${min2}`;
        headerRow.appendChild(th);
        
        time += (min == '00') ? 30 : 70;
    }
    return header;
}

function createTbody(cols) {
	const tbody = document.createElement('tbody');
	tbody.classList.add('table-group-divider');

	for (const day of DAYS) {
		// Add th
		const tr = document.createElement('tr');
		const th = document.createElement('th');
		tr.id = day;
		th.innerHTML = day;
		th.classList.add('table-primary');
		tr.appendChild(th);

		// Add td
		for (let i = 0; i < cols; i++) {
			const td = document.createElement('td');
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	return tbody;
}

function cleanTime(timeStr) {
	const time = timeStr.replace('30', '50').replace(':', '');
	return parseInt(time);
}

function timeToIndex(timeStr) {
    const time = cleanTime(timeStr);
    return (time - 800) / 50;
}

function calcColSpan(startStr, endStr) {
    const start = cleanTime(startStr);
    const end = cleanTime(endStr);
    return (end - start) / 50;
}

function setupNavButtons() {
	indexSpan = document.getElementById('index');

	document.getElementById('prev').addEventListener('click', () => {
		if (currentIndex > 0) {
			currentIndex--;
			indexSpan.textContent = currentIndex + 1;
			renderTimetable(currentIndex);
		}
	});

	document.getElementById('next').addEventListener('click', () => {
		if (currentIndex < combs.length - 1) {
			currentIndex++;
			indexSpan.textContent = currentIndex + 1;
			renderTimetable(currentIndex);
		}
	});
}

function setupConnectors() {
    // Refresh
    document.getElementById('refresh').addEventListener('click', () => {
        chrome.runtime.sendMessage({
			type: 'SCRAPE',
			payload: mySubjects
		});
		currentIndex = 0;
		indexSpan.textContent = currentIndex + 1;
    });

    // Select
    document.getElementById('select').addEventListener('click', () => {
        if (combs[0].length !== 0 && combs[currentIndex]) {
            chrome.runtime.sendMessage({
                type: 'SELECT',
                payload: combs[currentIndex]
            });
			showPopup('success', `Selected Timetable ${currentIndex + 1}`);
        } else {
			showPopup('error', 'Cannot be selected');
		}
    });
}

function clearTimetable() {
	document.querySelectorAll('td').forEach(td => {
		td.textContent = '';
		td.colSpan = 1;
		td.style.display = '';
		td.style.backgroundColor = '';
	});
}

function hideCols(cols, colIndex, colSpan) {
	for (let i = 1; i < colSpan; i++) {
		cols[colIndex + i].style.display = 'none';
	}
}

function getColor(name) {
    if (!colorMap.has(name)) {
        colorMap.set(name, COLORS[colorIndex++]);
    }
    return colorMap.get(name);
}

function renderTimetable(index) {
	clearTimetable();

	// Get current comb
    const comb = combs[index];
    if (!comb) {
		showPopup('neutral', 'Click "Refresh" to start');
		return;
	}
	console.log('Current comb:', JSON.stringify(comb, null, 2));

	for (const cl of comb) {
        const name = cl.name;
        const color = getColor(name);

		const cleanName = name.split(' - ')[1];
		for (const p of cl.periods) {
			const targetRow = document.getElementById(p.day);
			const cols = targetRow.querySelectorAll('td');
			const colIndex = timeToIndex(p.start);
			const colSpan = calcColSpan(p.start, p.end);
			const col = cols[colIndex];

			const isOnline = cl.location.toLowerCase().includes('online');
			col.innerHTML = `${cleanName}<br>(${cl.type}${cl.group})${isOnline ? ' Online' : ''}`;
			col.colSpan = colSpan;
			col.style.backgroundColor = color;
			hideCols(cols, colIndex, colSpan);
		}
	}
}

function showPopup(status, msg, duration=3000) {
	const popup = document.getElementById('popup');

	popup.classList.toggle('alert-success', status === 'success');
	popup.classList.toggle('alert-danger', status === 'error');
	popup.classList.toggle('alert-primary', status === 'neutral');
	popup.classList.remove('hidden');

	window.scrollTo(0, 0);
	popup.textContent = msg;

	clearTimeout(popupTimeout);
	popupTimeout = setTimeout(() => {
		popup.classList.add('hidden');
	}, duration);
}

// Main
function timetable() {
    setupNavButtons();
	setupConnectors();
    createTimetable();
    renderTimetable(currentIndex);
}

timetable();
