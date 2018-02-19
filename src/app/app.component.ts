import { Component, OnInit } from '@angular/core';
import { AngularFirestore,
  AngularFirestoreCollection  } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

export interface Todo {
  id?: string;
  name: string;
  age: number;
  nat: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  todoCollectionRef: AngularFirestoreCollection<Todo>;
  todo$: Observable<Todo[]>;

  constructor(private db: AngularFirestore) {
      this.todoCollectionRef = this.db.collection<Todo>('items');
      this.todo$ = this.todoCollectionRef.snapshotChanges().map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Todo;
          const id = action.payload.doc.id;
          return { id, data };
        });
      });
  }

  addTodo(todoDesc: string) {
    if (todoDesc && todoDesc.trim().length) {
      this.todoCollectionRef.add({ name: todoDesc, age: 20, nat: 'De' });
    }
  }

  updateTodo(todo: Todo) {
    this.todoCollectionRef.doc(todo.id).update({ name: todo.name, age: todo.age, nat: todo.nat });
  }

  deleteTodo(todo: Todo) {
    this.todoCollectionRef.doc(todo.id).delete();
  }

  ngOnInit() {
  }
}
