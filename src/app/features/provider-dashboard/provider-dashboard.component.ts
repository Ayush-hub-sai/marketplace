import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="provider-dashboard">
      <h1>Provider Dashboard</h1>
      <p>This is the provider dashboard for managing services and bookings.</p>
    </div>
  `,
  styles: []
})
export class ProviderDashboardComponent {}
