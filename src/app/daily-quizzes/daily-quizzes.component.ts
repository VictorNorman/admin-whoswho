import { Component, OnInit } from '@angular/core';
import { DailyQuizRecord, DataService } from '../data.service';

@Component({
  selector: 'app-daily-quizzes',
  templateUrl: './daily-quizzes.component.html',
  styleUrls: ['./daily-quizzes.component.scss']
})
export class DailyQuizzesComponent implements OnInit {
  public dailyQuizzes: DailyQuizRecord[] = [];
  public checks: boolean[];
  public allCheckboxesSelected = false;

  constructor(private dataSvc: DataService) { }

  ngOnInit(): void {
    this.dataSvc.getAllDailyQuizzes();

    this.dataSvc.dailyQuizzesSubj.subscribe((dq: DailyQuizRecord[]) => {
      if (dq) {
        this.dailyQuizzes = dq.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
        this.checks = Array(this.dailyQuizzes.length).fill(false);
      }
    });

  }

  checkboxChanged() {
    // fix the "all checkboxes checked checkbox"
    this.allCheckboxesSelected = (this.checks.every(x => x));
  }

  toggleAllCheckboxes() {
    this.checkboxChanged();
    this.allCheckboxesSelected = !this.allCheckboxesSelected;
    this.checks = this.checks.fill(this.allCheckboxesSelected);
  }

  // delete all daily quizzes that have been selected.
  deleteSelections() {
    const quizzes2del = this.checks
      .map((c, idx) => {
        if (c) {
          return this.dailyQuizzes[idx].id;
        }
      })
      .filter(t => t);    // remove empty entries
    this.dataSvc.delQuizzes(quizzes2del);
  }


}
