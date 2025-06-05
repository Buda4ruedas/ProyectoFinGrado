import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// 👇 Importar y registrar el locale español
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs); // ✅ Debe ir antes del bootstrap

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));