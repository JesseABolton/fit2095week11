import { Component } from "@angular/core";
import * as io from "socket.io-client";
import { ChartType, ChartOptions } from 'chart.js';

import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';





@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  

  

  question = '';
  selection: '0';
  messageText: string;
  messages: Array<any> = [];
  poll = {};
  options = [];
  labels = [];
  data = [];
  pollArray = []
  questions = []
  currentpoll = 0;

  public pieChartLabels: Label[] = this.labels;
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors = [
    {
      backgroundColor: [
        'rgba(0, 63, 92, 1)',
        'rgba(47, 75, 124, 1)',
        'rgba(102, 81, 145, 1)',
        'rgba(160, 81, 149, 1)',
        'rgba(212, 80, 135, 1)',
        'rgba(249, 93, 106, 1)',
        'rgba(255, 124, 67, 1)',
        'rgba(255, 166, 0, 1)'
      ]
    }
  ];


  socket: SocketIOClient.Socket;
  constructor() {
    this.socket = io.connect();
  }
  ngOnInit() {
    monkeyPatchChartJsLegend();
    monkeyPatchChartJsTooltip();

    this.messages = new Array();
    this.socket.on("poll", (data) =>{
      this.pollArray = data;
      this.questions = this.pollArray.map(a=>a.question);
      this.data = this.pollArray.map(a=>a.options.map(a=>a.count));
      this.labels = this.pollArray.map(a=>a.options.map(a=>a.text));
      this.createGraph(this.currentpoll);
      

      //this.question = data.question;
      //this.options = data.options;
      //this.labels = data.options.map(a=>a.text);
      //this.pieChartLabels = data.options.map(a=>a.text);
      //this.pieChartData = data.options.map(a=>a.count);
      
    });
    

  }

  sendVote(pollNum){
    this.createGraph(pollNum);
    this.socket.emit("vote", { num: pollNum, selection: this.selection});
    

  }

  createGraph(pollNum){
    this.pieChartLabels = this.labels[pollNum];
    this.pieChartData = this.data[pollNum];    
    this.currentpoll = pollNum;

  }

  track (index:number, poll: any): string{
    return poll.question
  }
    
  




}