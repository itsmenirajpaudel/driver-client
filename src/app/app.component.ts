import { Component, OnInit } from '@angular/core';
import { DriverService } from './driver.service';
import { SocketioService } from './socketio.service';

interface IDriver {
  id: number, 
  name: string,
  latlng: Array<number>
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
  .card {
    max-width: 400px;
    border: 1px solid;
    margin-top: 10px;
  }
  
  `]
})
export class AppComponent implements OnInit {
  title = 'CLIENT';
  public drivers:IDriver[] = [];
  public connected = false;

  constructor(private _driverService: DriverService,
    private _socketService: SocketioService
    ) {
      this.subscribeMessage = this.subscribeMessage.bind(this);
    }

  ngOnInit() {
    this._driverService.getDrivers()
        .subscribe(data => {
          if(data.success && data.payload) {
            this.drivers = data.payload;
            this._socketService.setupSocketConnection(data.payload, this.subscribeMessage);

          } else {
            console.log('error while fetching...');
          }
        });

  }

  startMotions() {
    this._driverService.startMotions()
        .subscribe(data => {
          if(data.success) {
            console.log('....started');
            this._socketService.setupSocketConnection(this.drivers, this.subscribeMessage);
            this.connected = true;
          } else {
            console.log('error while fetching...');
          }
        });
  }

  stopMotions() {
    this.connected = false;
    this._socketService.disconnect();
  }

  subscribeMessage(message: string) {
    try {
    let driver: IDriver;
      driver = JSON.parse(message);
    
    if(driver && driver.id) {
      const index = this.drivers.findIndex(d => d.id === driver.id);
      if(index > -1) {
        this.drivers[index] = driver;
        this.connected = true;
      }
    }
    } catch(error) {
      console.log(error);
    }
  }

  ngOnDestroy() {
    this._socketService.disconnect();
  }


}
