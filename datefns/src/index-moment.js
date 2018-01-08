import moment from "moment"
import 'moment/src/locale/fr';

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');

inputEl.addEventListener('change', () => {
    const out = [];

    const now = moment();
    const inputMoment = moment(inputEl.value);

    out.push(inputMoment.format("dddd, MMMM Do YYYY, h:mm:ss a"));
    out.push(`Before today: ${inputMoment.isBefore(now)}`);
    out.push(`After today: ${inputMoment.isAfter(now)}`);
    
    out.push(`Difference in days: ${now.diff(inputMoment, 'days')}`);
    out.push(`Difference in hours: ${now.diff(inputMoment, 'hours')}`);

    out.push(`Difference human readable: ${inputMoment.locale('en').fromNow()}`);

    out.push(`Start of week: ${inputMoment.startOf('week')}`);
    out.push(`End of week: ${inputMoment.endOf('week')}`);

    out.push(`Is Leap Year: ${inputMoment.isLeapYear()}`);

    out.push(`In 13 days: ${inputMoment.add(13, 'days')}`);
   
    out.push(`In French: ${inputMoment.locale('fr').fromNow()}`);

    outputEl.innerHTML = out.join('<br>');
});


