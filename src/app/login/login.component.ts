import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  title = 'Who\'s who Admin';
  public feedback = '';

  constructor(
    private router: Router,
    private dataSvc: DataService) {
  }

  ngOnInit(): void {
  }

  public async submit(login) {
    const res = await this.dataSvc.checkOrgAndPassword(login.value.org, login.value.password);
    if (res === 'Success') {
      this.router.navigateByUrl('main');
    } else {
      this.feedback = '';
      this.feedback = res;
    }
  }
}
