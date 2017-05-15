import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Todo} from "../../todo";
import {TodoProvider} from "../../providers/todo/todo";

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html'
})
export class EditPage {
  todo: Todo;

  constructor(private readonly navCtrl: NavController,
              private readonly navParams: NavParams,
              private readonly todoProvider: TodoProvider) {
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
    this.todoProvider.save(this.todo);
    this.navCtrl.pop();
  }
}
