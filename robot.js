const robot = document.getElementById("robot");

function robotIdle() {
  robot.setAttribute("src", "robot-idle.json");
}

function robotThinking() {
  robot.setAttribute("src", "robot-thinking.json");
}

function robotTalking() {
  robot.setAttribute("src", "robot-talking.json");
}

function robotAlert() {
  robot.setAttribute("src", "robot-alert.json");
}
