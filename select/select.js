const comb = [
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
    "group": "4",
    "day": "TUE",
    "start": "10:00",
    "end": "12:00",
    "location": "UW-2-6"
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
    "group": "2",
    "day": "MON",
    "start": "10:00",
    "end": "12:00",
    "location": "UW-2-1"
  },
  {
    "name": "SEG1201 - Database Fundamentals",
    "type": "L",
    "group": "1",
    "day": "WED",
    "start": "08:00",
    "end": "10:00",
    "location": "JC 1"
  },
  {
    "name": "SEG1201 - Database Fundamentals",
    "type": "P",
    "group": "12",
    "day": "TUE",
    "start": "08:00",
    "end": "10:00",
    "location": "UW-2-2"
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
    "group": "8",
    "day": "TUE",
    "start": "16:00",
    "end": "18:00",
    "location": "UE-2-16"
  }
]

function injectButton() {
    // Create the button
    const button = document.createElement('button');
    button.textContent = 'Click Me!';

    // Style the button to always stay visible
    Object.assign(button.style, {
    position: 'fixed',   // Stick to the viewport
    bottom: '20px',      // 20px from bottom
    right: '20px',       // 20px from right
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: '1000',      // Make sure it's on top
    });

    // Append the button to the body
    document.body.appendChild(button);

    button.addEventListener('click', submit);
}

function selectAllSubjects() {
    document.querySelectorAll('.mySubject').forEach(subject => {
        const name = subject.querySelector('label').innerText;
        if (comb.some(item => item.name === name)) {
            expandDropdown(subject);
            selectSubject(subject, name);
        }
    })
}

function expandDropdown(subject) {
    setTimeout(() => {
        subject.querySelectorAll('.glyphicon-chevron-down').forEach(arrow => {
            arrow.click();
        });
    }, 500);
}

function selectSubject(subject, name) {
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
injectButton();
selectAllSubjects();
