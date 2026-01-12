let combs;
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'SCRAPED_DATA') {
        combs = msg.payload;
    }
});

const COLORS = [
	'#12f48e',
	'#1ac1e7',
	'#e5bd38',
	'#dd3b49',
	'#3772e6'
]

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

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
	emptyCell.style.visibility = 'hidden';
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

function setupButtons() {
	indexSpan = document.getElementById('index');

	document.getElementById('prev').addEventListener('click', () => {
		if (currentIndex > 0) {
			currentIndex--;
			indexSpan.textContent = currentIndex + 1;
			renderTimetable(currentIndex);
		}
	})

	document.getElementById('next').addEventListener('click', () => {
		if (currentIndex < combs.length - 1) {
			currentIndex++;
			indexSpan.textContent = currentIndex + 1;
			renderTimetable(currentIndex);
		}
	})

    // Select button
    document.getElementById('select').addEventListener('click', () => {
        chrome.runtime.sendMessage({
            type: 'SELECTED',
            payload: combs[currentIndex]
        });
    })
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

	if (!combs) return;
    const comb = combs[index];

	for (const cl of comb) {
        const name = cl.name;
        const color = getColor(name);

		const targetRow = document.getElementById(cl.day);
		const cols = targetRow.querySelectorAll('td');
		const colIndex = timeToIndex(cl.start);
		const colSpan = calcColSpan(cl.start, cl.end);
		const col = cols[colIndex];

		col.innerHTML = `${name} (${cl.type})<br>Group ${cl.group}`;;
		col.colSpan = colSpan;
        col.style.backgroundColor = color;
		hideCols(cols, colIndex, colSpan);
	}
}

// Main
function timetable() {
    console.log('[timetable] loaded');
    const colorMap = new Map();
    let colorIndex = 0;
    let currentIndex = 0;
    setupButtons();
    createTimetable();
    renderTimetable(currentIndex);
}

console.log('[timetable] loaded');
timetable();
