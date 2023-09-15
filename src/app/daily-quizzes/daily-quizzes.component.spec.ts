import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyQuizzesComponent } from './daily-quizzes.component';

describe('DailyQuizzesComponent', () => {
  let component: DailyQuizzesComponent;
  let fixture: ComponentFixture<DailyQuizzesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyQuizzesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
