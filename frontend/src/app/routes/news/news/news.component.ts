/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import {NewsService} from "../news.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  providers:[NewsService]
})
export class NewsComponent implements OnInit, OnDestroy {

  private news = [];
  private subscriptions = [];

  private newToRemove;

  constructor(private router: Router,
              private newsService: NewsService) { }

  ngOnInit() {
    var subRss = this.newsService.getRss().subscribe( result => {
      this.newsService.setRssId(result._id);
      var subNews = this.newsService.getNews().subscribe( news => {
        this.news = news;
      });
      this.subscriptions.push(subNews);
    });
    this.subscriptions.push(subRss);
  }

  ngOnDestroy(): void {
    for (var subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  editNew(data) {
    this.router.navigate(['/news/form/' + data._id]);
  }

  selectNewToRemove(data) {
    this.newToRemove = data;
  }

  removeNew() {
    var subRemove = this.newsService.removeNew(this.newToRemove._id).subscribe( result => {
      if (result.status == '204') {
        var subNews = this.newsService.getNews().subscribe( news => {
          this.news = news;
        });
        this.subscriptions.push(subNews);
      }
    });
    this.subscriptions.push(subRemove);
  }

}
