import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Ensure the AppModule is correctly bootstrapped
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));