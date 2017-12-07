/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { Component, OnInit } from '@angular/core';
import {News} from "../news";
import {NewsService} from "../news.service";
import { Router, ActivatedRoute, Params} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import "rxjs/add/observable/timer"

@Component({
  selector: 'app-news-form',
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.scss']
})
export class NewsFormComponent implements OnInit {

  private newId;
  private newsForm: FormGroup;

  private subscriptions = [];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private newsService: NewsService) {
      this.newsForm= fb.group({
          title: ['', [<any>Validators.required]],
          description: ['', [<any>Validators.required]],
          link: ['', [<any>Validators.required]],
          image: ['', [<any>Validators.required]]
      })
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.newId = params['id'];
      var subRss = this.newsService.getRss().subscribe( result => {
        this.newsService.setRssId(result._id);
        if (this.newId) {
          this.newsService.getNew(this.newId).subscribe( newInfo => {
            this.newsForm.patchValue(newInfo);
            this.newId = newInfo._id;
          } );
        }
      });
      this.subscriptions.push(subRss);
    });

    this.newsForm.controls['link'].valueChanges
      .debounce(() => Observable.timer(500))
      .subscribe(value => {
        this.loadDefaultImage();
      });

    this.newsForm.controls['image'].valueChanges
      .debounce(() => Observable.timer(500))
      .subscribe(value => {
        if (!value) {
          this.loadDefaultImage();
        }
      })
  }

  newItem () {
    return this.newId == null;
  }

  submitForm(form) {
    if (form.valid) {
      if (this.newId) {
        this.editNews();
      } else {
        this.addNews();
      }
    }
  }

  loadDefaultImage () {
      if (this.newsForm.controls['link'].value) {
          this.newsService.getImagePreview(this.newsForm.controls['link'].value)
              .subscribe( result => {
                  if (result.image) {
                      this.newsForm.controls['image'].setValue(result.image);
                  }
              })
      }
  }

  addNews() {
      var subPostNews = this.newsService.postNews(this.newsForm.value).subscribe( result => {
        if (result.status == 201) {
          this.router.navigate(['/news']);
        }
      });
      this.subscriptions.push(subPostNews);
  }

  editNews() {
      var subPostNews = this.newsService.editNewsItem(this.newId, this.newsForm.value).subscribe( result => {
        if (result.status == 200) {
          this.router.navigate(['/news']);
        }
      });
      this.subscriptions.push(subPostNews);
  }

  getImage() {
    if (this.newsForm.controls['image'].value) {
        return this.newsForm.controls['image'].value;
    } else {
        return 'assets/img/no_available.png';
    }
  }

  ngOnDestroy(): void {
    for (var subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
