const mySubjects = [
    'operating system',
    'web fundamentals',
    'object-oriented',
    // 'artificial intelligence'
];

// Get all slots
function getAllSlots() {
    const allSlots = [];
    document.querySelectorAll('.mySubject').forEach(subject => {
        const name = isMySubject(subject);
        if (name) {
            const slots = scrapeSubject(subject, name);
            allSlots.push(...slots);
        }
    })
    return allSlots;
}

function isMySubject(subject) {
    const name = subject.querySelector('label').innerText;

    if (mySubjects.some(s => name.toLowerCase().includes(s))) {
        return name;
    }
    return null;
}

function scrapeSubject(subject, name) {
    const slots = [];
    const panelGroups = subject.querySelectorAll('.panel-group');
    panelGroups.forEach(panelGroup => {
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

// Generate all combinations
function toMinutes(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}

function clash(a, b) {
    if (a.day !== b.day) return false;

    const aStart = toMinutes(a.start);
    const aEnd   = toMinutes(a.end);
    const bStart = toMinutes(b.start);
    const bEnd   = toMinutes(b.end);

    return aStart < bEnd && bStart < aEnd;
}

function clashesWithAny(slot, selected) {
    return selected.some(s => clash(slot, s));
}

function generateComb(groups) {
    const results = [];

    function backtrack(index, selected) {
        if (index === groups.length) {
            results.push([...selected]);
            return;
        }
        for (const slot of groups[index]) {
            if (!clashesWithAny(slot, selected)) {
                selected.push(slot);
                backtrack(index + 1, selected);
                selected.pop();
            }
        }
    }
    backtrack(0, []);
    return results;
}

// Main
allSlots = getAllSlots();
combs = generateComb(allSlots);
// console.log(JSON.stringify(allSlots, null, 2));
// console.log(combs);
console.log(JSON.stringify(combs, null, 2))
