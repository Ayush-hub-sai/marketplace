import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chat">
      <h1>Chat Page</h1>
      <p>This page handles real-time chat with service providers.</p>
    </div>
  `,
  styles: []
})
export class ChatComponent {}
