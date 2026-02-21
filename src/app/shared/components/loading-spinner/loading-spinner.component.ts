import { Component } from '@angular/core';

@Component({
    selector: 'app-loading-spinner',
    standalone: true,
    template: `
    <div class="spinner-overlay">
      <div class="spinner-container">
        <div class="spinner"></div>
        <p class="spinner-text">Chargement...</p>
      </div>
    </div>
  `,
    styles: [`
    .spinner-overlay {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem 0;
    }
    .spinner-container {
      text-align: center;
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(99,102,241,0.2);
      border-top: 4px solid #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }
    .spinner-text {
      color: rgba(255,255,255,0.6);
      font-size: 0.9rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent { }
