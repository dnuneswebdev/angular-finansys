import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-server-errror-messages',
  templateUrl: './server-errror-messages.component.html',
  styleUrls: ['./server-errror-messages.component.css']
})
export class ServerErrrorMessagesComponent implements OnInit {

  @Input('server-errors-messages') serverErrorsMessages: string[] = null;

  constructor() { }

  ngOnInit() {
  }

}
