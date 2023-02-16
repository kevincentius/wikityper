import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RaceComponent } from 'src/app/views/race/race/race.component';
import { ResultComponent } from 'src/app/views/result/result/result.component';
import { SearchComponent } from 'src/app/views/search/search/search.component';

const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'race', component: RaceComponent },
  { path: 'result', component: ResultComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
