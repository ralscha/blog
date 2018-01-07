import tingle from 'tingle.js';

export function showAbout() {
    const modal = new tingle.modal();
    modal.setContent('<h1>About me</h1>');
    modal.open();
}