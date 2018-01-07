export class EarthquakeDetail {

  constructor(earthquake) {
    this.earthquake = earthquake;
  }

  render() {
    return `<div class="earthquake">
                <div class="mag">${this.earthquake.mag}</div>
                <div class="place">By ${this.earthquake.place}</div>
                <div class="time">${this.earthquake.time}</div>
              </div>`;
  }

}
