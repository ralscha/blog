import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {v4} from "uuid"
import {Todo} from "../../swagger/model/Todo";
import {TodoServiceService} from "../../swagger/api/todoService.service";

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html'
})
export class EditPage {
  todo: Todo;

  constructor(private readonly navCtrl: NavController,
              private readonly navParams: NavParams,
              private readonly todoService: TodoServiceService) {
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
    this.todoService.saveUsingPOST(this.todo).subscribe(() => this.navCtrl.pop());
  }
}
