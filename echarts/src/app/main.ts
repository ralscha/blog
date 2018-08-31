import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import 'echarts/theme/dark.js';

platformBrowserDynamic().bootstrapModule(AppModule);
