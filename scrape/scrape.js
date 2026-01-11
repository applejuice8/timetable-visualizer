const mySubjects = [
    'operating system',
    'web fundamentals',
    'object-oriented',
    'database fundamentals'
];

function getAllSubjectSlots() {
    const slots = [];
    document.querySelectorAll('.mySubject').forEach(subject => {
        const name = isMySubject(subject);
        if (name) {
            expandDropdown(subject);
            const slot = getSubjectSlots(subject, name);
            slots.push(...slot);
        }
    })
    return slots;
}

function isMySubject(subject) {
    const name = subject.querySelector('label').innerText;

    if (mySubjects.some(s => name.toLowerCase().includes(s))) {
        return name;
    }
}

function expandDropdown(subject) {
    setTimeout(() => {
        subject.querySelectorAll('.glyphicon-chevron-down').forEach(arrow => {
            arrow.click();
        });
    }, 500);
}

function getSubjectSlots(subject, name) {
    const slots = [];

    subject.querySelectorAll('.panel-group').forEach(panelGroup => {
        const type = panelGroup.querySelector('.panel-title').innerText.split(' ')[3].slice(0,1);
        const typeSlots = [];

        panelGroup.querySelectorAll('.izoneThead').forEach(thead => {
            const input = thead.querySelector('input');

            if (!input.disabled) {
                const group = input.getAttribute('data-groupno').split(' ')[1];
                const [day, start, end] = input.getAttribute('period-time-str').split('-');

                const tds = thead.nextElementSibling.querySelectorAll('td');
                const location = tds[tds.length - 1].innerText;

                const info = {
                    name: name,
                    type: type,
                    group: group,
                    day: day,
                    start: start.replace(':00', ''),
                    end: end.replace(':00', ''),
                    location: location
                };
                typeSlots.push(info);
            }
        })
        if (typeSlots.length === 0) {
            throw new Error(`Missing ${type} class for ${name}`);
        }
        slots.push(typeSlots);
    })
    return slots;
}

function toMinutes(time) {
    const [hour, min] = time.split(':').map(Number);
    return hour * 60 + min;
}

function clashesWithAny(slot, selected) {
    return selected.some(s => {
        if (slot.day !== s.day) return false;

        const slotStart = toMinutes(slot.start);
        const slotEnd = toMinutes(slot.end);
        const sStart = toMinutes(s.start);
        const sEnd = toMinutes(s.end);

        return slotStart < sEnd && sStart < slotEnd;
    });
}

function generateComb(slots) {
    const combs = [];

    function backtrack(index, selected) {
        if (index === slots.length) {
            combs.push([...selected]);
            return;
        }
        for (const slot of slots[index]) {
            if (!clashesWithAny(slot, selected)) {
                selected.push(slot);
                backtrack(index + 1, selected);
                selected.pop();
            }
        }
    }
    backtrack(0, []);
    return combs;
}

// Main
slots = getAllSubjectSlots();
combs = generateComb(slots);
// console.log(JSON.stringify(combs, null, 2));
