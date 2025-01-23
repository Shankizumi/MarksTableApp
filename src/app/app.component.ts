import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MarksComponent } from "./marks/marks.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MarksComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MarkSheet';
}
