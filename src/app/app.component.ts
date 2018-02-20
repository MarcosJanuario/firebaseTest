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
  creatingDate = false;
  beingUpdatedData = {};
  updatingObj = {id: '', name: '', age: 0, nat: ''};
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

  addNewData(todoDesc: string) {
    this.creatingDate = true;
  }

  edit(item) {
    this.beingUpdatedData = item;
    this.updatingObj.id = item.id;
    this.updatingObj.name = item.data.name;
    this.updatingObj.age = item.data.age;
    this.updatingObj.nat = item.data.nat;
    this.updatingData = true;
  }

  saveChanges(updatingObj, updating) {
    if (updating) {
      this.todoCollectionRef.doc(updatingObj.id).update({ name: updatingObj.name.toString(), age: Number(updatingObj.age), nat: updatingObj.nat.toString() });
      this.updatingObj.name = '';
      this.updatingObj.age = 0;
      this.updatingObj.nat = '';
      this.updatingData = false;
    } else {
      this.todoCollectionRef.add({ name: updatingObj.name, age: updatingObj.age, nat: updatingObj.nat });
      this.creatingDate = false;
    }
  }

  close() {
    this.updatingObj.name = '';
    this.updatingObj.age = 0;
    this.updatingObj.nat = '';
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
