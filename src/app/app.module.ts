import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './views/search/search/search.component';
import { RaceComponent } from './views/race/race/race.component';
import { TextPreviewComponent } from './views/search/text-preview/text-preview.component';
import { ResultComponent } from './views/result/result/result.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    RaceComponent,
    TextPreviewComponent,
    ResultComponent,
  ],  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
