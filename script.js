const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 7,
  velocityX: 5,
  velocityY: 5,
  color: "white",
};

const user = {
  x: 10,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 100,
  score: 0,
  color: "yellow",
};

const ai = {
  x: canvas.width - 20,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 100,
  score: 0,
  color: "red",
};

const net = {
  x: canvas.width / 2 - 1,
  y: 0,
  width: 2,
  height: 10,
  color: "white",
};

let gameStatus = false;

function drawNet() {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "75px fantasy";
  ctx.fillText(text, x, y);
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 7;
  ball.velocityX = -ball.velocityX;
  ball.velocityY = -ball.velocityY;
}

function drawScore() {
  drawText(user.score, canvas.width / 4, canvas.height / 5, "white");
  drawText(ai.score, (3 * canvas.width) / 4, canvas.height / 5, "white");
}

function collision(b, p) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  return (
    b.right > p.left &&
    b.bottom > p.top &&
    b.left < p.right &&
    b.top < p.bottom
  );
}

function update() {
  if (gameStatus) {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
      ball.velocityY = -ball.velocityY;
    }

    let player = ball.x < canvas.width / 2 ? user : ai;

    if (collision(ball, player)) {
      let collidePoint = ball.y - (player.y + player.height / 2);
      collidePoint = collidePoint / (player.height / 2);

      let angleRad = (Math.PI / 4) * collidePoint;
      let direction = ball.x < canvas.width / 2 ? 1 : -1;

      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad);

      ball.speed += 0.2;
    }

    if (ball.x - ball.radius < 0) {
      ai.score++;
      resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
      user.score++;
      resetBall();
    }

    if (ai.score >= 20) {
      drawText("AI Wins!", canvas.width / 2 - 150, canvas.height / 2, "red");
      gameStatus = false;
    } else if (user.score >= 20) {
      drawText("User Wins!", canvas.width / 2 - 150, canvas.height / 2, "yellow");
      gameStatus = false;
    }
  }
}

function game() {
  update();
  render();
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, "black");
  drawScore();
  drawNet();
  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function init() {
  resetBall();
  gameStatus = false;
  drawText("Press SPACEBAR to Start", canvas.width / 2 - 300, canvas.height / 2, "white");

  canvas.addEventListener("mousedown", function (event) {
    if (!gameStatus) {
      gameStatus = true;
      setInterval(game, 1000 / 50);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
      if (!gameStatus) {
        gameStatus = true;
        setInterval(game, 1000 / 50);
      }
    }
  });
}

init();
