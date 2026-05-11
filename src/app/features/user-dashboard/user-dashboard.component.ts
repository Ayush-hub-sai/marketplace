import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-dashboard">
      <h1>User Dashboard</h1>
      <p>This is the user dashboard for managing bookings and profile.</p>
    </div>
  `,
  styles: []
})
export class UserDashboardComponent {}
