import {Component, OnInit} from '@angular/core';
import {Todo} from '../todo';
import {ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';
import {TodoService} from '../todo.service';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.page.html',
    styleUrls: ['./edit.page.scss'],
    standalone: false
})
export class EditPage implements OnInit {

  todo: Todo | undefined;

  constructor(private readonly navCtrl: NavController,
              private readonly route: ActivatedRoute,
              private readonly todoService: TodoService) {

  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.todo = this.todoService.getTodo(parseInt(id, 10));
    } else {
      this.todo = {
        title: '',
        description: ''
      };
    }
  }

  save(): void {
    if (this.todo) {
      this.todoService.save(this.todo);
    }
    this.navCtrl.navigateBack(['home']);
  }

}
