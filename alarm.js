const readline = require("readline");

class Alarm {
  constructor(time, day) {
    this.time = time;
    this.day = day;
    this.active = true;
  }
}

class AlarmClock {
  constructor() {
    this.alarms = [];
    this.snoozeTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    this.start();
  }

  start() {
    console.log("============> Alarm Clock Started <==============");
    this.displayCurrentTime();
    this.listenForCommands();
  }

  displayCurrentTime() {
    setInterval(() => {
      const now = new Date();
      console.log(`Current Time: ${now.toLocaleTimeString()}`);
      this.checkAlarms(now);
    }, 4000);
  }

  checkAlarms(currentTime) {
    this.alarms.forEach((alarm) => {
      if (alarm.active && this.isAlarmTime(alarm, currentTime)) {
        console.log(`ALARM! Time: ${alarm.time}, Day: ${alarm.day}`);
        alarm.active = false; // Deactivate alarm after it rings
      }
    });
  }

  isAlarmTime(alarm, currentTime) {
    const alarmTime = alarm.time.split(":").map(Number);
    return (
      alarmTime[0] === currentTime.getHours() &&
      alarmTime[1] === currentTime.getMinutes() &&
      alarm.day === currentTime.getDay()
    );
  }

  setAlarm(time, day) {
    console.log({ time, day });
    const newAlarm = new Alarm(time, day);
    this.alarms.push(newAlarm);
    console.log(`Alarm set for time ${time} and day ${day}`);
  }

  snoozeAlarm(index) {
    if (this.alarms[index]) {
      setTimeout(() => {
        this.alarms[index].active = true;
        console.log(`Alarm snoozed for ${this.snoozeTime / 60000} minutes.`);
      }, this.snoozeTime);
    } else {
      console.log("Invalid alarm index.");
    }
  }

  listenForCommands() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on("line", (input) => {
      const [command, ...args] = input.split(" ");

      switch (command) {
        case "set":
          const [time, day] = args;
          console.log({ time, day });
          if (time && day) {
            this.setAlarm(time, parseInt(day, 10));
          } else {
            console.log("Usage: set HH:MM day");
          }
          break;

        case "snooze":
          const index = parseInt(args[0], 10);
          if (!isNaN(index)) {
            this.snoozeAlarm(index);
          } else {
            console.log("Please enter snooze index, Like: snooze 1");
          }
          break;
        default:
          console.log("Unknown command.");
      }
    });
  }
}

const alarmClock = new AlarmClock();
