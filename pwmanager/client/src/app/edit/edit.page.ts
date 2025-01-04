import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {v4} from 'uuid';
import {PasswordService} from '../password.service';
import {Password} from '../password';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.page.html',
    styleUrls: ['./edit.page.scss'],
    standalone: false
})
export class EditPage implements OnInit {
  password: Password | undefined = undefined;

  constructor(private readonly navCtrl: NavController,
              private readonly route: ActivatedRoute,
              private readonly passwordService: PasswordService) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.password = this.passwordService.getPassword(id);
      if (this.password === undefined) {
        this.navCtrl.navigateBack(['home']);
      }
    } else {
      this.password = {
        id: '',
        url: '',
        username: '',
        password: '',
        description: ''
      };
    }
  }

  async save(): Promise<void> {
    if (this.password === undefined) {
      return Promise.reject('password empty');
    }

    if (!this.password.id) {
      this.password.id = v4();
    }
    await this.passwordService.savePassword(this.password);
    this.navCtrl.navigateBack(['home']);
  }

  deletePassword(): void {
    if (this.password?.id) {
      this.passwordService.deletePassword(this.password);
      this.navCtrl.navigateBack(['home']);
    }
  }
}
