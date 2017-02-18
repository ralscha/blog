import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {TodoService} from "../../providers/todo-service";
import {Todo} from "../../todo";

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html'
})
export class EditPage {
  todo: Todo;

  constructor(private readonly navCtrl: NavController,
              private readonly navParams: NavParams,
              private readonly todoService: TodoService) {
    this.todo = {
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
    this.todoService.save(this.todo);
    this.navCtrl.pop();
  }
}
