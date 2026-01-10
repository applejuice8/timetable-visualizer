const slots = [
  [
    {
      "name": "OSS1014 - Operating System Fundamentals",
      "type": "L",
      "group": "1",
      "day": "MON",
      "start": "08:00",
      "end": "10:00",
      "location": "JC 1"
    }
  ],
  [
    {
      "name": "OSS1014 - Operating System Fundamentals",
      "type": "P",
      "group": "2",
      "day": "THU",
      "start": "08:00",
      "end": "10:00",
      "location": "UW-2-8"
    },
    {
      "name": "OSS1014 - Operating System Fundamentals",
      "type": "P",
      "group": "3",
      "day": "WED",
      "start": "16:00",
      "end": "18:00",
      "location": "UE-2-16"
    },
    {
      "name": "OSS1014 - Operating System Fundamentals",
      "type": "P",
      "group": "4",
      "day": "TUE",
      "start": "10:00",
      "end": "12:00",
      "location": "UW-2-6"
    }
  ],
  [
    {
      "name": "PRG1203 - Object-oriented Programming Fundamentals",
      "type": "L",
      "group": "1",
      "day": "WED",
      "start": "14:00",
      "end": "16:00",
      "location": "JC 1"
    }
  ],
  [
    {
      "name": "PRG1203 - Object-oriented Programming Fundamentals",
      "type": "P",
      "group": "1",
      "day": "WED",
      "start": "08:00",
      "end": "10:00",
      "location": "UW-2-10"
    },
    {
      "name": "PRG1203 - Object-oriented Programming Fundamentals",
      "type": "P",
      "group": "2",
      "day": "MON",
      "start": "08:00",
      "end": "10:00",
      "location": "UW-2-1"
    },
    {
      "name": "PRG1203 - Object-oriented Programming Fundamentals",
      "type": "P",
      "group": "3",
      "day": "MON",
      "start": "10:00",
      "end": "12:00",
      "location": "UW-2-1"
    }
  ],
  [
    {
      "name": "WEB1201 - Web Fundamentals",
      "type": "L",
      "group": "1",
      "day": "THU",
      "start": "16:00",
      "end": "18:00",
      "location": "JC 1"
    }
  ],
  [
    {
      "name": "WEB1201 - Web Fundamentals",
      "type": "P",
      "group": "8",
      "day": "TUE",
      "start": "16:00",
      "end": "18:00",
      "location": "UE-2-16"
    },
    {
      "name": "WEB1201 - Web Fundamentals",
      "type": "P",
      "group": "10",
      "day": "MON",
      "start": "16:00",
      "end": "18:00",
      "location": "UW-2-8"
    },
    {
      "name": "WEB1201 - Web Fundamentals",
      "type": "P",
      "group": "12",
      "day": "MON",
      "start": "14:00",
      "end": "16:00",
      "location": "UW-2-9"
    }
  ]
]

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const table = document.querySelector('#table');

function createHeader() {
    const header = document.createElement('thead');
    const headerRow = document.createElement('tr');
    header.appendChild(headerRow);
    headerRow.appendChild(document.createElement('th'));

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

function createDayRow(day) {
	const tr = document.createElement('tr');
	const th = document.createElement('th');
	th.innerHTML = day;
	tr.appendChild(th);
	return tr;
}

function createTbody(cols) {
    const tbody = document.createElement('tbody');
    tbody.classList.add('table-group-divider');

    for (const day of days) {
		const tr = createDayRow(day);

        let i = 0;
        while (i < cols) {
            const td = document.createElement('td');

            for (const slot of slots) {
                if (slot.day == day && timeToIndex(slot.start) == i) {
                    td.innerHTML = `${slot.name} (${slot.type})<br>Group ${slot.group}`;
                    const colSpan = calcColSpan(slot.start, slot.end);
					td.colSpan = colSpan;
                    i += colSpan - 1;
                    break;
                }
            }
            tr.appendChild(td);
            i++;
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

function calcColSpan(start, end) {
    start = cleanTime(start);
    end = cleanTime(end);
    return (end - start) / 50;
}

let currentIndex = 0;
document.getElementById('prev').addEventListener('click', () => {
	if (currentIndex > 0) {
		currentIndex--;
		console.log(slots[currentIndex]);
	}
})

document.getElementById('next').addEventListener('click', () => {
	if (currentIndex < slots.length - 1) {
		currentIndex++;
		console.log(slots[currentIndex]);
	}
})


// Main
function displayTimetable() {
	const header = createHeader();
	table.appendChild(header);

	const cols = header.querySelectorAll('th').length - 1;
	const tbody = createTbody(cols);
	table.appendChild(tbody);
}

// displayTimetable();

