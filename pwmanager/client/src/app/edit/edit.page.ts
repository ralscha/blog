import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {v4} from 'uuid';
import {PasswordService} from '../password.service';
import {Password} from '../password';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss']
})
export class EditPage implements OnInit {
  password: Password;

  constructor(private readonly navCtrl: NavController,
              private readonly route: ActivatedRoute,
              private readonly passwordService: PasswordService) {

  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.password = this.passwordService.getPassword(id);
    } else {
      this.password = {
        id: null,
        url: '',
        username: '',
        password: '',
        description: ''
      };
    }
  }

  async save() {
    if (!this.password.id) {
      this.password.id = v4();
    }
    await this.passwordService.savePassword(this.password);
    this.navCtrl.navigateBack(['home']);
  }

  deletePassword() {
    if (this.password.id) {
      this.passwordService.deletePassword(this.password);
      this.navCtrl.navigateBack(['home']);
    }
  }
}
