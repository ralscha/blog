import {Component, OnInit} from '@angular/core';
import {Todo, TodoServiceService} from '../swagger';
import {NavController} from '@ionic/angular';
import {v4} from 'uuid';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.page.html',
    styleUrls: ['./edit.page.scss'],
    standalone: false
})
export class EditPage implements OnInit {

  todo!: Todo;

  constructor(private readonly navCtrl: NavController,
              private readonly todoService: TodoServiceService) {
  }

  ngOnInit(): void {
    const todo = this.todoService.selectedTodo;
    if (todo) {
      this.todo = todo;
    } else {
      this.todo = {
        id: v4(),
        title: '',
        description: ''
      };
    }
  }

  save(): void {
    this.todoService.saveUsingPOST(this.todo).subscribe(() => this.navCtrl.navigateBack(['home']));
  }

}
