const slots = [
    {
      "name": "OSS1014 - Operating System Fundamentals",
      "type": "L",
      "group": "1",
      "day": "MON",
      "start": "08:00",
      "end": "10:00",
      "location": "JC 1"
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
      "name": "PRG1203 - Object-oriented Programming Fundamentals",
      "type": "L",
      "group": "1",
      "day": "WED",
      "start": "14:00",
      "end": "16:00",
      "location": "JC 1"
    },
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
      "name": "WEB1201 - Web Fundamentals",
      "type": "L",
      "group": "1",
      "day": "THU",
      "start": "16:00",
      "end": "18:00",
      "location": "JC 1"
    },
    {
      "name": "WEB1201 - Web Fundamentals",
      "type": "P",
      "group": "10",
      "day": "MON",
      "start": "16:00",
      "end": "18:00",
      "location": "UW-2-8"
    }
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

function createTbody(cols) {
    const tbody = document.createElement('tbody');
    for (const day of days) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.innerHTML = day;
        tr.appendChild(th);

        let i = 0;
        while (i < cols) {
            const td = document.createElement('td');
            td.classList.add('p-10');

            for (const slot of slots) {
                if (slot.day == day && timeToIndex(slot.start) == i) {
                    td.innerHTML = `${slot.name} (${slot.type})`;
                    console.log(td.innerHTML);
                    td.colSpan = 4;
                    i += 3;
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

function timeToIndex(timeStr) {
    index = (parseInt(timeStr.replace('30', '50').replace(':', '')) - 800) / 50;
    return index;
}

const header = createHeader();
table.appendChild(header);

const cols = header.querySelectorAll('th').length - 1;
const tbody = createTbody(cols);
table.appendChild(tbody);

