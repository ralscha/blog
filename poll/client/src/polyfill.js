import { EventSourcePolyfill } from 'event-source-polyfill';
import "whatwg-fetch";
import "classlist-polyfill";

window.EventSource = EventSourcePolyfill;