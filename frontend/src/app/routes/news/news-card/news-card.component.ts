/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss'],
})
export class NewsCardComponent implements OnInit {
  @Input() data;
  @Output() remove = new EventEmitter();
  @Output() edit = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  editClicked() {
    this.edit.emit(this.data);
  }

  removeClicked() {
    this.remove.emit(this.data);
  }

}
