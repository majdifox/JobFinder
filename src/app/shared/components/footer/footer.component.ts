import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    template: `
    <footer class="app-footer">
      <div class="container text-center">
        <p class="mb-0">
          <span class="brand">JobFinder</span> &copy; {{ currentYear }} — Trouvez l'emploi de vos rêves
        </p>
      </div>
    </footer>
  `,
    styles: [`
    .app-footer {
      background: rgba(15, 15, 25, 0.95);
      border-top: 1px solid rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.5);
      padding: 1.5rem 0;
      font-size: 0.9rem;
      margin-top: auto;
    }
    .brand {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
    }
  `]
})
export class FooterComponent {
    currentYear = new Date().getFullYear();
}
