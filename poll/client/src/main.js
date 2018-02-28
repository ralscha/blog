import {init} from './app';
import "core-js/modules/es6.promise";
import "core-js/modules/es6.array.iterator";

if (browserSupportsAllFeatures()) {
    init();
} else {
    import('./polyfill').then(() => init()).catch(e => console.log(e));
}

function browserSupportsAllFeatures() {
    return window.EventSource && window.fetch;
}