const mySubjects = [
    'operating system',
    'web fundamentals',
    'object-oriented',
    'artificial intelligence'
];

document.querySelectorAll('.mySubject').forEach(subject => {
    const name = isMySubject(subject);
    if (name) {
        scrapeSubject(subject, name);
    }
})

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
            const group = input.getAttribute('data-groupno');
            const [day, start, end] = input.getAttribute('period-time-str').split('-');
            
            const tds = thead.nextElementSibling.querySelectorAll('td');
            const location = tds[tds.length - 1].innerText;

            info = {
                group: group,
                day: day,
                start: start,
                end: end,
                location: location
            };

            if (slots[name][type]) {
                slots[name][type].push(info);
            } else {
                slots[name][type] = [info];
            }
            
        })
        // console.log(slots);
        


    })
    console.log(JSON.stringify(slots, null, 2));
}

// function scrapeData(subject) {
//     const data = {};
//     let available = false;
//     const code = subject.querySelector('input[type="radio"]').getAttribute('alias-subject-code');

//     subject.querySelectorAll('.izoneThead').forEach(thead => {
//         input = thead.querySelector('input[type="radio"]');

//         if (!input.disabled) {
//             available = true;
//             const [group, teacher] = thead.querySelector('strong').innerText.split(':');
//             const [day, start, end] = input.getAttribute('period-time-str').split('-');
//             const tds = thead.nextElementSibling.querySelectorAll('td');
//             const type = input.getAttribute('class-type').slice(0, 1);

//             const info = {
//                 code: code,
//                 group: group.split(' ')[1].trim(),
//                 teacher: teacher.trim(),
//                 location: tds[tds.length - 1].innerText,
//                 day: day,
//                 start: start.replace(':00', ''),
//                 end: end.replace(':00', ''),
//             };

//             if (data[type]) {
//                 data[type].push(info);
//             } else {
//                 data[type] = [info];
//             }
//         }
//     });
//     return available ? {[code]: data} : null;
// }

// // Main method
// const all = {};
// document.querySelectorAll('.mySubject').forEach(subject => {
//     if (isMySubject(subject)) {
//         data = scrapeData(subject);
//         console.log(data);

//         if (!data) return;

//         all[Object.keys(data)[0].code] = data;
//     }
// });
// console.log(all);

