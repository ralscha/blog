import { EventSourcePolyfill } from 'event-source-polyfill';
import "whatwg-fetch";

window.EventSource = EventSourcePolyfill;