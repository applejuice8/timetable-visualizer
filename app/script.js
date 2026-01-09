const mySubjects = [
    'operating system',
    'web fundamentals',
    'object-oriented',
    // 'artificial intelligence'
];

// Get all slots
function getAllSlots() {
    allSlots = {}
    document.querySelectorAll('.mySubject').forEach(subject => {
        const name = isMySubject(subject);
        if (name) {
            slots = scrapeSubject(subject, name);
            allSlots = {...allSlots, ...slots};
            console.log(JSON.stringify(slots, null, 2));
        }
    })
    console.log(JSON.stringify(allSlots, null, 2));
}

function isMySubject(subject) {
    const name = subject.querySelector('label').innerText;

    if (mySubjects.some(s => name.toLowerCase().includes(s))) {
        return name;
    }
    return null;
}

function scrapeSubject(subject, name) {
    slots = {[name]: {}}
    panelGroups = subject.querySelectorAll('.panel-group');
    panelGroups.forEach(panelGroup => {
        type = panelGroup.querySelector('.panel-title').innerText.split(' ')[3].slice(0,1);

        panelGroup.querySelectorAll('.izoneThead').forEach(thead => {
            const input = thead.querySelector('input');

            if (!input.disabled) {
                const group = input.getAttribute('data-groupno').split(' ')[1];
                const [day, start, end] = input.getAttribute('period-time-str').split('-');

                const tds = thead.nextElementSibling.querySelectorAll('td');
                const location = tds[tds.length - 1].innerText;

                info = {
                    group: group,
                    day: day,
                    start: start.replace(':00', ''),
                    end: end.replace(':00', ''),
                    location: location
                };

                (slots[name][type] ??= []).push(info);
            }
        })

        if (!slots[name][type]) {
            throw new Error(`Missing ${type} class for ${name}`);
        };
    })
    return slots;
}

// Main
getAllSlots();