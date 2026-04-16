chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'SELECT') {
        selectAllSubjects(msg.payload.comb);
    }
});

function expandDropdown(subject) {
    setTimeout(() => {
        subject.querySelectorAll('.glyphicon-chevron-down').forEach(arrow => {
            arrow.click();
        });
    }, 500);
}

function selectSubject(subject, name, comb) {
    const options = subject.querySelectorAll('input[type="radio"]');

    comb.forEach(cl => {
        if (cl.name != name) return;
        options.forEach(option => clickIfMatch(option, cl));
    })
}

function clickIfMatch(option, cl) {
    if (option.classList.contains('radio-exclude')) return;

    const matchType = option.getAttribute('class-type').startsWith(cl.type);
    const matchGroup = option.getAttribute('data-groupno').split(' ')[1] == cl.group;

    if (matchType && matchGroup) {
        if (option.disabled) {
            chrome.runtime.sendMessage({
                type: 'POPUP',
                status: 'error',
                payload: {
                    popupContent: `${cl.type} class for ${cl.name} is full. Choose again.`,
                    isPriority: true
                }
            });

            // Scrape again
            chrome.runtime.sendMessage({ type: 'CLASS_FULL' });
            throw new Error(`Missing ${cl.type} class for ${cl.name}`);
        }
        option.click();
    }
}

function submit() {
    document.getElementById('chk_confirm').click();

    setTimeout(() => {
        document.getElementById('btn_submit').click();
    }, 500);
}

// Main
function selectAllSubjects(comb) {
    try {
        document.querySelectorAll('.mySubject').forEach(subject => {
            const name = subject.querySelector('label').innerText;
            if (comb.some(item => item.name === name)) {
                expandDropdown(subject);
                selectSubject(subject, name, comb);
            }
        })
        console.log('Selected:', JSON.stringify(comb, null, 2));
        submit();
    } catch(err) {
        console.log(`Error: ${err}`);
    }
}
