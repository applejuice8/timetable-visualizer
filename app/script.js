const mySubjects = [
    'operating system',
    'web fundamentals'
];

function isMySubject(subject) {
    const id = subject.getAttribute('data-id');

    if (mySubjects.some(s => id.includes(s.toUpperCase()))) {
        return true;
    }
}

function scrapeData(options) {
    const data = [];

    options.forEach(option => {
        input = option.querySelector('input[type="radio"]');

        const [group, teacher] = option.querySelector('strong').innerText.split(':');
        const [day, start, end] = input.getAttribute('period-time-str').split('-');

        const info = {
            group: group.split(' ')[1].trim(),
            teacher: teacher.trim(),
            code: input.getAttribute('alias-subject-code'),
            type: input.getAttribute('class-type').slice(0, 1),
            day: day,
            start: start.replace(':00', ''),
            end: end.replace(':00', '')
        };
        data.push(info);
    });
    console.log(data);
    return data;
}

document.querySelectorAll('.mySubject').forEach(subject => {
    if (isMySubject(subject)) {
        panels = subject.querySelectorAll('.panel-group table');
        console.log(panels.length);
        subject.querySelectorAll('input[type="radio"]');
        options = subject.querySelectorAll('.radio');

        data = scrapeData(options);

    }
});
