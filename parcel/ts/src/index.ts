import 'whatwg-fetch';
import "core-js/modules/es.promise";
import "core-js/modules/es.string.pad-start";

import numberURL from "./config";

async function fetchNumber(): Promise<void> {
    const response = await fetch(numberURL + Math.floor(Math.random() * 100));
    const txt = await response.text();
    document.getElementById('output').innerHTML = txt.padStart(100, '-');
}

fetchNumber();

