import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument  } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Items } from './interfaces/items';
import { Alerts } from './interfaces/alerts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';
  private itemDoc: AngularFirestoreDocument<Items>;
  items: Observable<any[]>;
  alerts: Observable<any[]>;

  constructor(private db: AngularFirestore) {
    this.items = db.collection('items').valueChanges();
  }

  ngOnInit() {
    this.alerts = this.db.collection('alerts').valueChanges();
  }
}
