import {Component} from "@angular/core";
import {NavController, ItemSliding} from "ionic-angular";
import {EditPage} from "../edit/edit";
import {Todo} from "../../swagger/model/Todo";
import {TodoServiceService} from "../../swagger/api/todoService.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  todos: Todo[];

  constructor(private readonly navCtrl: NavController,
              private readonly todoService: TodoServiceService) {
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
