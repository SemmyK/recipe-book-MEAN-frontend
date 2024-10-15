import { Component } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-loading-page',
  standalone: true,
  imports: [NgxSpinnerModule],
  templateUrl: './loading-page.component.html',
  styleUrl: './loading-page.component.css',
})
export class LoadingPageComponent {
  constructor(private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }
}
