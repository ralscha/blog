import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {v4} from "uuid"
import {TodoserviceApi} from "../../swagger/api/TodoserviceApi";
import {Todo} from "../../swagger/model/Todo";

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html'
})
export class EditPage {
  todo: Todo;

  constructor(private readonly navCtrl: NavController,
              private readonly navParams: NavParams,
              private readonly todoservice: TodoserviceApi) {
    this.todo = {
      id: v4(),
      title: '',
      description: ''
    };
  }

  ionViewDidLoad() {
    let todo = this.navParams.get('todo');
    if (todo) {
      this.todo = todo;
    }
  }

  save() {
    this.todoservice.saveUsingPOST(this.todo).subscribe(() => this.navCtrl.pop());
  }
}
