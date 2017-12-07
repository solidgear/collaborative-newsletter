/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { NgModule } from '@angular/core';
import { NewsComponent } from './news/news.component';
import { Routes, RouterModule } from '@angular/router';
import {SharedModule} from "../../shared/shared.module";
import { NewsCardComponent } from './news-card/news-card.component';
import { NewsFormComponent } from './news-form/news-form.component';

const routes: Routes = [
  { path: '', component: NewsComponent },
  { path: 'form', component: NewsFormComponent },
  { path: 'form/:id', component: NewsFormComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [NewsComponent, NewsCardComponent, NewsFormComponent],
  exports: [
    RouterModule
  ]
})
export class NewsModule { }
