
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';
import { Component, OnInit } from '@angular/core';
import { timestamp } from 'rxjs';

import { format, toZonedTime } from 'date-fns-tz';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  newMessage: string = '';
  sender: string = '';  // Empty initial value
  receiver: string = '';  // Empty initial value


  constructor(private messageService: MessageService) { }

  ngOnInit(): void {}

  loadMessages(): void {
    console.log("sender ", this.sender);
    this.messageService.getMessages(this.sender)
      .subscribe(messages => {
        this.messages = messages;
        console.log("messages ", messages);
      });
  }
  sendMessage(): void {
    if (!this.sender || !this.receiver || !this.newMessage) {
      return; // Optionally, handle empty fields with a warning message
    }
    const timeZone = 'America/Guayaquil'; // Zona horaria de Ecuador
    const currentDate = new Date();
    const zonedDate = toZonedTime(currentDate, timeZone);

    const message: Message = {
      senderUsername: this.sender,
      receiverUsername: this.receiver,
      content: this.newMessage,
      timestamp: zonedDate
    };
    console.log("fecha ",timestamp);
    this.messageService.sendMessage(message)
      .subscribe(newMsg => {
        this.messages.push(newMsg);
        this.newMessage = '';
      });
  }
}
