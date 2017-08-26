import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Todo} from "../../model/Todo";
import {TodocontrollerApi} from "../../api/TodocontrollerApi";
import {v4} from "uuid"

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html'
})
export class EditPage {
  todo: Todo;

  constructor(private readonly navCtrl: NavController,
              private readonly navParams: NavParams,
              private readonly todoCtrl: TodocontrollerApi) {
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
    this.todoCtrl.saveUsingPOST(this.todo).subscribe(() => this.navCtrl.pop());
  }
}
