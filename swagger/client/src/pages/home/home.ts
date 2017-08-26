import {Component} from "@angular/core";
import {NavController, ItemSliding} from "ionic-angular";
import {EditPage} from "../edit/edit";
import {Todo} from "../../model/Todo";
import {TodocontrollerApi} from "../../api/TodocontrollerApi";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  todos: Todo[];

  constructor(private readonly navCtrl: NavController,
              public readonly todoCtrl: TodocontrollerApi) {
  }

  ionViewDidEnter() {
    this.todoCtrl.listUsingGET().subscribe(data => this.todos = data);
  }

  addTodo() {
    this.navCtrl.push(EditPage);
  }

  editTodo(slidingItem: ItemSliding, todo: Todo) {
    slidingItem.close();
    this.navCtrl.push(EditPage, {
      todo: todo
    });
  }

  deleteTodo(slidingItem: ItemSliding, todo: Todo) {
    slidingItem.close();
    this.todoCtrl.deleteUsingPOST(todo.id).subscribe(() => this.ionViewDidEnter());
  }

}
