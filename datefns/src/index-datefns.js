import format from 'date-fns/format';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import differenceInDays from 'date-fns/differenceInDays';
import differenceInHours from 'date-fns/differenceInHours';
import formatDistance from 'date-fns/formatDistance';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import isLeapYear from 'date-fns/isLeapYear';
import addDays from 'date-fns/addDays';
import fr from 'date-fns/locale/fr'

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');

inputEl.addEventListener('change', () => {
    const out = [];

    const now = new Date();
    const inputDate = new Date(inputEl.value);

    out.push(format(inputDate, "MMMM dd, yyyy, HH:mm:ss a"));
    
    out.push(`Before today: ${isBefore(inputDate, now)}`);
    out.push(`After today: ${isAfter(inputDate, now)}`);
    
    out.push(`Difference in days: ${differenceInDays(inputDate, now)}`);
    out.push(`Difference in hours: ${differenceInHours(inputDate, now)}`);

    out.push(`Difference human readable: ${formatDistance(inputDate, now, {addSuffix:true})}`);

    out.push(`Start of week: ${startOfWeek(inputDate)}`);
    out.push(`End of week: ${endOfWeek(inputDate)}`);

    out.push(`Is Leap Year: ${isLeapYear(inputDate)}`);

    out.push(`In 13 days: ${addDays(inputDate, 13)}`);

    out.push(`In French:  ${formatDistance(inputDate, now, {addSuffix:true, locale: fr})}`);

    outputEl.innerHTML = out.join('<br>');
});


