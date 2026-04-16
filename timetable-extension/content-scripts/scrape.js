chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'SCRAPE') {
        mySubjects = msg.payload.subjects;
        includeFull = msg.payload.includeFull;
        scrape();
    }
});

let mySubjects;

function getAllSubjectSlots() {
    resetAll();

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

function resetAll() {
    document.querySelectorAll('button.btn-danger').forEach(dropBtn => {
        dropBtn.click();
    });
}

function isMySubject(subject) {
    const name = subject.querySelector('label').innerText;
    const nameLower = name.toLowerCase()

    if (mySubjects.some(s => nameLower.includes(s))) {
        return name;
    }
}

function expandDropdown(subject) {
    subject.querySelectorAll('.glyphicon-chevron-down').forEach(arrow => {
        arrow.click();
    });
}

function getSubjectSlots(subject, name) {
    const slots = [];

    subject.querySelectorAll('.panel-group').forEach(panelGroup => {
        const type = panelGroup.querySelector('.panel-title').innerText.split(' ')[3].slice(0,1);
        const typeSlots = [];

        panelGroup.querySelectorAll('.izoneThead').forEach(thead => {
            const input = thead.querySelector('input');

            if (!input.disabled || includeFull) {
                const group = input.getAttribute('data-groupno').split(' ')[1];
                const periodStr = input.getAttribute('period-time-str');
                if (!periodStr) return;
                const periods = periodStr.split('|').map(p => {
                    const [day, start, end] = p.split('-');
                    return { day, start: start?.slice(0, 5), end: end?.slice(0, 5) };
                });

                const tds = thead.nextElementSibling.querySelectorAll('td');
                const location = tds[tds.length - 1].innerText;

                const info = {
                    name: name,
                    type: type,
                    group: group,
                    periods: periods,
                    location: location
                };
                typeSlots.push(info);
            }
        })
        if (typeSlots.length === 0) {
            chrome.runtime.sendMessage({
                type: 'POPUP',
                status: 'error',
                payload: {
                    popupContent: `Missing ${type} class for ${name}`
                }
            });
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
    return slot.periods.some(p =>
        selected.some(s =>
            s.periods.some(sp => {
                if (p.day !== sp.day) return false;
                return toMinutes(p.start) < toMinutes(sp.end) &&
                       toMinutes(sp.start) < toMinutes(p.end);
            })
        )
    );
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

function rankCombs(combs) {
    const DAY_ORDER = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4 };

    function getClassesByDay(comb) {
        const map = {};
        for (const cl of comb) {

            // Skip online class
            if (cl.location.toLowerCase().includes('online')) continue;

            for (const p of cl.periods) {
                if (!map[p.day]) map[p.day] = [];
                map[p.day].push(p);
            }
        }
        return map;
    }

    function hasLunch(periods) {
        const sorted = [...periods].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

        // Free before 11: first class starts at/after 11:30 (can eat before)
        if (toMinutes(sorted[0].start) >= toMinutes('11:30')) return true;

        // Free after 13:30: last class ends by 13:30 (can eat after)
        if (toMinutes(sorted[sorted.length - 1].end) <= toMinutes('13:30')) return true;

        // All classes end by 11: free rest of day
        if (toMinutes(sorted[sorted.length - 1].end) <= toMinutes('11:00')) return true;

        // All classes start at/after 14: free before
        if (toMinutes(sorted[0].start) >= toMinutes('14:00')) return true;

        // Gap within 11:00-14:00 of at least 30 min
        for (let i = 0; i < sorted.length - 1; i++) {
            const gapStart = toMinutes(sorted[i].end);
            const gapEnd = toMinutes(sorted[i + 1].start);
            const overlapStart = Math.max(gapStart, toMinutes('11:00'));
            const overlapEnd = Math.min(gapEnd, toMinutes('14:00'));
            if (overlapEnd - overlapStart >= 30) return true;
        }

        return false;
    }

    function countBigGaps(periods) {
        const sorted = [...periods].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
        let count = 0;
        for (let i = 0; i < sorted.length - 1; i++) {
            if (toMinutes(sorted[i + 1].start) - toMinutes(sorted[i].end) > 180) count++;
        }
        return count;
    }

    function totalGapMinutes(byDay) {
        return Object.values(byDay).reduce((sum, periods) => {
            const sorted = [...periods].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
            for (let i = 0; i < sorted.length - 1; i++) {
                sum += toMinutes(sorted[i + 1].start) - toMinutes(sorted[i].end);
            }
            return sum;
        }, 0);
    }

    function scheduleKey(byDay) {
        return Object.keys(byDay).sort().map(day => {
            const sorted = [...byDay[day]].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
            return day + ':' + sorted.map(p => `${p.start}-${p.end}`).join(',');
        }).join('|');
    }

    // 1. Filter out combos with no valid lunch on any school day
    const filtered = combs.filter(comb => {
        const byDay = getClassesByDay(comb);
        return Object.values(byDay).every(periods => hasLunch(periods));
    });

    // 2. Sort
    filtered.sort((a, b) => {
        const aDays = getClassesByDay(a);
        const bDays = getClassesByDay(b);

        // Rule 2: fewest big gaps
        const aGaps = Object.values(aDays).reduce((sum, p) => sum + countBigGaps(p), 0);
        const bGaps = Object.values(bDays).reduce((sum, p) => sum + countBigGaps(p), 0);
        if (aGaps !== bGaps) return aGaps - bGaps;

        // Rule 3: fewest school days
        const aDayCount = Object.keys(aDays).length;
        const bDayCount = Object.keys(bDays).length;
        if (aDayCount !== bDayCount) return aDayCount - bDayCount;

        // Rule 4: prefer latest day to be as early as possible
        const aLatest = Math.max(...Object.keys(aDays).map(d => DAY_ORDER[d]));
        const bLatest = Math.max(...Object.keys(bDays).map(d => DAY_ORDER[d]));
        if (aLatest !== bLatest) return aLatest - bLatest;

        // Rule 5: minimize total gap minutes (keeps identical-schedule combs together)
        const aTotal = totalGapMinutes(aDays);
        const bTotal = totalGapMinutes(bDays);
        if (aTotal !== bTotal) return aTotal - bTotal;

        // Rule 6: group identical schedules together
        return scheduleKey(aDays).localeCompare(scheduleKey(bDays));
    });

    return filtered;
}

// Main
function scrape() {
    try {
        slots = getAllSubjectSlots();
        combs = rankCombs(generateComb(slots));

        chrome.runtime.sendMessage({
            type: 'SCRAPED_DATA',
            payload: {
                combs: combs
            }
        });
    } catch(err) {
        console.log(`Error: ${err}`);
    }
}
