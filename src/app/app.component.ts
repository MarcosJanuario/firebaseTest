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
  todo$: Observable<any[]>;
  updatingData = false;
  beingUpdatedData = {};
  newObj = {id: '', name: '', age: 0, nat: ''};

  constructor(private db: AngularFirestore) {
      this.todoCollectionRef = this.db.collection<Todo>('items');

      /**
       * The line bellow is used to  query date from the firebase database by using such clauses as "where" for instance
       * it can be used to replace the code line above
       **/
      // this.todoCollectionRef = this.db.collection<Todo>('items', ref => ref.where('name', '==', 'marcos'));
      this.todo$ = this.todoCollectionRef.snapshotChanges().map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data();
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

  edit(item) {
    this.beingUpdatedData = item;
    this.newObj.id = item.id;
    this.newObj.name = item.data.name;
    this.newObj.age = item.data.age;
    this.newObj.nat = item.data.nat;
    this.updatingData = true;
  }

  saveChanges(newObj) {
    this.todoCollectionRef.doc(newObj.id).update({ name: newObj.name.toString(), age: Number(newObj.age), nat: newObj.nat.toString() });
    this.newObj.name = '';
    this.newObj.age = 0;
    this.newObj.nat = '';
    this.updatingData = false;
  }
  close() {
    this.newObj.name = '';
    this.newObj.age = 0;
    this.newObj.nat = '';
    this.updatingData = false;
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
