const mySubjects = [
    'operating system',
    'web fundamentals',
    'object-oriented',
    // 'artificial intelligence'
];

function isMySubject(subject) {
    const id = subject.getAttribute('data-id');

    if (mySubjects.some(s => id.includes(s.toUpperCase()))) {
        return true;
    }
    return false;
}

function scrapeData(subject) {
    const data = [];
    let available = false;

    subject.querySelectorAll('.izoneThead').forEach(thead => {
        input = thead.querySelector('input[type="radio"]');

        if (!input.disabled) {
            available = true;
            const [group, teacher] = thead.querySelector('strong').innerText.split(':');
            const [day, start, end] = input.getAttribute('period-time-str').split('-');
            const tds = thead.nextElementSibling.querySelectorAll('td');

            const info = {
                code: input.getAttribute('alias-subject-code'),
                type: input.getAttribute('class-type').slice(0, 1),
                group: group.split(' ')[1].trim(),
                teacher: teacher.trim(),
                location: tds[tds.length - 1].innerText,
                day: day,
                start: start.replace(':00', ''),
                end: end.replace(':00', ''),
            };
            data.push(info);
        }
    });
    console.log(data);
    return available ? data : null;
}

// Main method
const all = {};
document.querySelectorAll('.mySubject').forEach(subject => {
    if (isMySubject(subject)) {
        data = scrapeData(subject);

        if (!data) return;

        all[data[0].code] = data;
    }
});
console.log(all);
if (mySubjects.length !== Object.keys(all).length) {
    console.log('1 or more subjects are full.');
} else {
    console.log('Done');
}
