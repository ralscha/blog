import {Component} from "@angular/core";
import {NavController, ItemSliding} from "ionic-angular";
import {EditPage} from "../edit/edit";
import {TodoserviceApi} from "../../swagger/api/TodoserviceApi";
import {Todo} from "../../swagger/model/Todo";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  todos: Todo[];

  constructor(private readonly navCtrl: NavController,
              public readonly todoService: TodoserviceApi) {
  }

  ionViewDidEnter() {
    this.todoService.listUsingGET().subscribe(data => this.todos = data);
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
    this.todoService.deleteUsingPOST(todo.id).subscribe(() => this.ionViewDidEnter());
  }

}
