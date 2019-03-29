import {init} from './app';
import "core-js/modules/es.promise";
import "core-js/modules/es.array.iterator";

if (browserSupportsAllFeatures()) {
    init();
} else {
    import('./polyfill').then(() => init()).catch(e => console.log(e));
}

function browserSupportsAllFeatures() {
    return window.EventSource && window.fetch;
}