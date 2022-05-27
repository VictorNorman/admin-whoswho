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

  constructor(
    private router: Router,
    private dataSvc: DataService) {
  }

  ngOnInit(): void {
  }

  public submit(login) {
    console.log('login is ', login);
    console.log('org is', login.value.org);
    console.log('password is ', login.value.password);

    // this.dataSvc.checkOrgAndPassword(login.value.org, login.value.password);

    this.router.navigateByUrl('main');
  }
}
