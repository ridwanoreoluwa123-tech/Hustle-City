const canvas = document.getElementById("gameCanvas");
alert("Hustle City JavaScript is running!");
const ctx = canvas.getContext("2d");

const moneyDisplay = document.getElementById("money");
const locationTag = document.getElementById("locationTag");
const gameTip = document.getElementById("gameTip");
const message = document.getElementById("message");

const WORLD_W = 900;
const WORLD_H = 1200;
const ROAD_W = 150;

canvas.width = 450;
canvas.height = 600;

let player = {
x: 450,
y: 590,
speed: 190,
cash: 50000
};

let camera = {
x: 0,
y: 0
};

const keys = {
up: false,
down: false,
left: false,
right: false
};

let lastTime = 0;
let currentPlace = "City Streets";

const buildings = [
{
x: 55, y: 100, w: 220, h: 145,
color: "#c78e5a", name: "JOB CENTRE",
icon: "💼", type: "job"
},
{
x: 625, y: 100, w: 220, h: 145,
color: "#8a91a8", name: "BUSINESS",
icon: "🏢", type: "business"
},
{
x: 55, y: 390, w: 220, h: 150,
color: "#c9ad77", name: "PROPERTY",
icon: "🏠", type: "house"
},
{
x: 625, y: 390, w: 220, h: 150,
color: "#7896a9", name: "GARAGE",
icon: "🚘", type: "garage"
},
{
x: 55, y: 700, w: 220, h: 150,
color: "#b47e66", name: "MARKET",
icon: "🛍️", type: "market"
},
{
x: 625, y: 700, w: 220, h: 150,
color: "#8f9f71", name: "CAFE",
icon: "☕", type: "cafe"
},
{
    x: 315, y: 930, w: 270, h: 145,
    color: "#9b86b8", name: "CITY PLAZA",
    icon: "🏙️", type: "plaza"
},
{
    x: 625, y: 970, w: 220, h: 145,
    color: "#438b72", name: "HUSTLE BANK",
    icon: "🏦", type: "bank"
 }
];
const trees = [];

for (let y = 50; y < WORLD_H; y += 110) {
trees.push({ x: 22, y: y });
trees.push({ x: 875, y: y + 35 });
}

function roundedRect(x, y, w, h, r, color) {
ctx.fillStyle = color;
ctx.beginPath();
ctx.roundRect(x, y, w, h, r);
ctx.fill();
}

function drawRoads() {
ctx.fillStyle = "#78965b";
ctx.fillRect(0, 0, WORLD_W, WORLD_H);

// Small grass details
ctx.fillStyle = "rgba(30, 75, 37, 0.22)";

for (let y = 0; y < WORLD_H; y += 45) {
    for (let x = 0; x < WORLD_W; x += 65) {
        if ((x + y) % 3 === 0) {
            ctx.fillRect(x + 8, y + 8, 3, 3);
        }
    }
}

// Main road
ctx.fillStyle = "#b4b2a6";
ctx.fillRect(300, 0, ROAD_W, WORLD_H);

ctx.fillStyle = "#555c5c";
ctx.fillRect(309, 0, ROAD_W - 18, WORLD_H);

// Road lane markings
ctx.strokeStyle = "#f4d97b";
ctx.lineWidth = 4;
ctx.setLineDash([24, 22]);
ctx.beginPath();
ctx.moveTo(375, 0);
ctx.lineTo(375, WORLD_H);
ctx.stroke();
ctx.setLineDash([]);

// Side streets
for (const y of [310, 620, 890]) {
    ctx.fillStyle = "#b4b2a6";
    ctx.fillRect(0, y, WORLD_W, 85);

    ctx.fillStyle = "#626766";
    ctx.fillRect(0, y + 7, WORLD_W, 71);

    ctx.strokeStyle = "#e7d5a0";
    ctx.lineWidth = 3;
    ctx.setLineDash([22, 20]);
    ctx.beginPath();
    ctx.moveTo(0, y + 42);
    ctx.lineTo(WORLD_W, y + 42);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Sidewalks
ctx.fillStyle = "#c9c5b4";
ctx.fillRect(283, 0, 16, WORLD_H);
ctx.fillRect(451, 0, 16, WORLD_H);

for (const y of [310, 620, 890]) {
    ctx.fillRect(0, y - 7, WORLD_W, 7);
    ctx.fillRect(0, y + 85, WORLD_W, 7);
}

}

function drawTrees() {
for (const tree of trees) {
ctx.fillStyle = "#654b35";
ctx.fillRect(tree.x - 3, tree.y + 8, 6, 15);

    ctx.fillStyle = "#315b35";
    ctx.beginPath();
    ctx.arc(tree.x, tree.y, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#477a41";
    ctx.beginPath();
    ctx.arc(tree.x - 4, tree.y - 4, 10, 0, Math.PI * 2);
    ctx.fill();
}

}

function drawBuilding(building) {
const { x, y, w, h, color, name, icon } = building;

// Building shadow
roundedRect(x + 7, y + 8, w, h, 8, "rgba(0,0,0,0.22)");

// Main structure
roundedRect(x, y, w, h, 8, color);

// Roof border
ctx.strokeStyle = "rgba(255,255,255,0.35)";
ctx.lineWidth = 3;
ctx.strokeRect(x + 7, y + 7, w - 14, h - 14);

// Windows
for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
        roundedRect(
            x + 22 + col * 58,
            y + 18 + row * 36,
            34, 23, 3, "#9bd0d0"
        );

        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(
            x + 39 + col * 58,
            y + 18 + row * 36,
            2, 23
        );
    }
}

// Entrance
roundedRect(x + w / 2 - 17, y + h - 39, 34, 39, 3, "#4c382c");

ctx.fillStyle = "#f7f0d7";
ctx.font = "bold 17px Arial";
ctx.textAlign = "center";
ctx.fillText(icon, x + w / 2, y + h - 51);

roundedRect(x + 8, y + h + 5, w - 16, 25, 5, "#15231a");

ctx.fillStyle = "#ffffff";
ctx.font = "bold 11px Arial";
ctx.fillText(name, x + w / 2, y + h + 22);

}

function drawPlayer() {
const x = player.x;
const y = player.y;

// Shadow
ctx.fillStyle = "rgba(0,0,0,0.25)";
ctx.beginPath();
ctx.ellipse(x, y + 11, 12, 6, 0, 0, Math.PI * 2);
ctx.fill();

// Legs
ctx.fillStyle = "#202735";
roundedRect(x - 8, y + 2, 6, 13, 2, "#202735");
roundedRect(x + 2, y + 2, 6, 13, 2, "#202735");

// Body
roundedRect(x - 12, y - 13, 24, 23, 6, "#35ce79");

// Head
ctx.fillStyle = "#8f593b";
ctx.beginPath();
ctx.arc(x, y - 19, 9, 0, Math.PI * 2);
ctx.fill();

// Hair
ctx.fillStyle = "#29201b";
ctx.beginPath();
ctx.arc(x, y - 23, 8, Math.PI, Math.PI * 2);
ctx.fill();

// Player name
roundedRect(x - 36, y - 43, 72, 17, 5, "#132018");

ctx.fillStyle = "#ffffff";
ctx.font = "bold 9px Arial";
ctx.textAlign = "center";
ctx.fillText("YOU", x, y - 31);

}

function drawWorld() {
ctx.save();

ctx.translate(-camera.x, -camera.y);

drawRoads();
drawTrees();

for (const building of buildings) {
    drawBuilding(building);
}

drawPlayer();

ctx.restore();

}

function updateCamera() {
camera.x = player.x - canvas.width / 2;
camera.y = player.y - canvas.height / 2;

camera.x = Math.max(0, Math.min(WORLD_W - canvas.width, camera.x));
camera.y = Math.max(0, Math.min(WORLD_H - canvas.height, camera.y));

}

function getNearbyBuilding() {
let nearest = null;
let nearestDistance = Infinity;

for (const building of buildings) {
    const centerX = building.x + building.w / 2;
    const centerY = building.y + building.h / 2;

    const distance = Math.hypot(
        player.x - centerX,
        player.y - centerY
    );

    if (distance < nearestDistance) {
        nearest = building;
        nearestDistance = distance;
    }
}

return nearestDistance < 115 ? nearest : null;

}

function updateLocation() {
const nearby = getNearbyBuilding();

if (nearby) {
    currentPlace = nearby.name;
    locationTag.textContent = "📍 " + nearby.name;
    gameTip.textContent = "Near " + nearby.name + " — tap the matching activity below!";
} else {
    currentPlace = "City Streets";
    locationTag.textContent = "📍 City Streets";
    gameTip.textContent = "Keep exploring the city!";
}

}

function updateMoney() {
moneyDisplay.textContent =
"₦" + player.cash.toLocaleString("en-NG");
}

function draw(time) {
if (!lastTime) lastTime = time;

const delta = Math.min((time - lastTime) / 1000, 0.05);
lastTime = time;

let dx = 0;
let dy = 0;

if (keys.left) dx -= 1;
if (keys.right) dx += 1;
if (keys.up) dy -= 1;
if (keys.down) dy += 1;

if (dx !== 0 && dy !== 0) {
    dx *= Math.SQRT1_2;
    dy *= Math.SQRT1_2;
}

player.x += dx * player.speed * delta;
player.y += dy * player.speed * delta;

player.x = Math.max(18, Math.min(WORLD_W - 18, player.x));
player.y = Math.max(25, Math.min(WORLD_H - 25, player.y));

updateCamera();
updateLocation();

ctx.clearRect(0, 0, canvas.width, canvas.height);
drawWorld();

requestAnimationFrame(draw);

}

document.querySelectorAll("[data-dir]").forEach(button => {
const direction = button.dataset.dir;

button.addEventListener("pointerdown", event => {
    event.preventDefault();
    keys[direction] = true;

    if (button.setPointerCapture) {
        try {
            button.setPointerCapture(event.pointerId);
        } catch (_) {}
    }
});

const stop = event => {
    event.preventDefault();
    keys[direction] = false;
};

button.addEventListener("pointerup", stop);
button.addEventListener("pointercancel", stop);
button.addEventListener("lostpointercapture", () => {
    keys[direction] = false;
});

});

document.addEventListener("keydown", event => {
const keyMap = {
ArrowUp: "up",
ArrowDown: "down",
ArrowLeft: "left",
ArrowRight: "right",
w: "up",
s: "down",
a: "left",
d: "right"
};

const direction = keyMap[event.key];

if (direction) {
    event.preventDefault();
    keys[direction] = true;
}

});

document.addEventListener("keyup", event => {
const keyMap = {
ArrowUp: "up",
ArrowDown: "down",
ArrowLeft: "left",
ArrowRight: "right",
w: "up",
s: "down",
a: "left",
d: "right"
};

const direction = keyMap[event.key];

if (direction) {
    keys[direction] = false;
}

});

function showMessage(text) {
message.textContent = text;
message.classList.add("show");
}

// ================================
// HUSTLE CITY JOB SYSTEM
// ================================

let jobSystem = {
    currentJob: null,
    shiftActive: false,
    shiftStart: 0,
    shiftDuration: 15000
};

const availableJobs = [
    {
        name: "Delivery Rider",
        salary: 8000,
        description: "Deliver packages around the city."
    },
    {
        name: "Shop Assistant",
        salary: 6000,
        description: "Help customers at a local shop."
    },
    {
        name: "Security Guard",
        salary: 10000,
        description: "Protect businesses around the city."
    }
];

function openJobCentre() {
    const nearby = getNearbyBuilding();

    if (!nearby || nearby.type !== "job") {
        showMessage(
            "Walk closer to the JOB CENTRE before looking for work!"
        );
        return;
    }

    if (jobSystem.shiftActive) {
        showMessage(
            "You are already working! Finish your current shift first."
        );
        return;
    }

    const jobList = availableJobs
        .map((job, index) => {
            return `${index + 1}. ${job.name} — ₦${job.salary.toLocaleString("en-NG")}`;
        })
        .join("\n");

    const choice = prompt(
        "💼 HUSTLE CITY JOB CENTRE\n\n" +
        "Choose a job:\n\n" +
        jobList +
        "\n\nEnter 1, 2, or 3:"
    );

    if (choice === null) return;

    const selectedIndex = Number(choice) - 1;

    if (
        !Number.isInteger(selectedIndex) ||
        selectedIndex < 0 ||
        selectedIndex >= availableJobs.length
    ) {
        showMessage("Invalid choice! Please choose a job from 1 to 3.");
        return;
    }

    jobSystem.currentJob = availableJobs[selectedIndex];

    const confirmJob = confirm(
        "JOB OFFER\n\n" +
        "Position: " + jobSystem.currentJob.name +
        "\nSalary: ₦" +
        jobSystem.currentJob.salary.toLocaleString("en-NG") +
        "\nShift duration: 15 seconds\n\n" +
        "Start your shift?"
    );

    if (!confirmJob) {
        jobSystem.currentJob = null;
        return;
    }

    jobSystem.shiftActive = true;
    jobSystem.shiftStart = Date.now();

    showMessage(
        "Your shift has started! Complete 15 seconds of work to earn your salary."
    );

    showShiftStatus();
}

function showShiftStatus() {
    if (!jobSystem.shiftActive) return;

    const elapsed = Date.now() - jobSystem.shiftStart;
    const remaining = Math.max(
        0,
        Math.ceil((jobSystem.shiftDuration - elapsed) / 1000)
    );

    if (remaining > 0) {
        gameTip.textContent =
            "💼 Working as " +
            jobSystem.currentJob.name +
            " — " + remaining + " seconds remaining";

        requestAnimationFrame(showShiftStatus);
        return;
    }

    finishJob();
}

function finishJob() {
    if (!jobSystem.shiftActive || !jobSystem.currentJob) return;

    const salary = jobSystem.currentJob.salary;
    const jobName = jobSystem.currentJob.name;

    player.cash += salary;

    jobSystem.shiftActive = false;
    jobSystem.currentJob = null;
    jobSystem.shiftStart = 0;

    updateMoney();
    saveGame();

    gameTip.textContent = "Shift completed! You can find another job.";

    showMessage(
        "🎉 SHIFT COMPLETED!\n\n" +
        "Job: " + jobName +
        "\nYou earned ₦" + salary.toLocaleString("en-NG") +
        "\n\nYour new balance is ₦" +
        player.cash.toLocaleString("en-NG")
    );
}

// Connect the existing activity buttons.
document.querySelectorAll("[data-place]").forEach(button => {
    button.addEventListener("click", () => {
        const place = button.dataset.place;
        const nearby = getNearbyBuilding();

        const matchingBuilding = buildings.find(
            building => building.type === place
        );

        if (matchingBuilding && nearby !== matchingBuilding) {
            showMessage(
                "Walk closer to " +
                matchingBuilding.name +
                " before using this activity!"
            );
            return;
        }

        if (place === "job") {
            openJobCentre();

        } else if (place === "business") {
            showMessage(
                "Welcome to the Business District! Business management is coming soon."
            );

        } else if (place === "house") {
            showMessage(
                "Welcome to the Property Market! House purchases are coming soon."
            );

        } else if (place === "garage") {
            showMessage(
                "Welcome to the Garage! Vehicle purchases are coming soon."
            );
        }
    });
});

function saveGame() {
try {
localStorage.setItem("hustleCityGame", JSON.stringify(player));
} catch (error) {
// The game remains playable if browser storage is unavailable.
}
}

function loadGame() {
try {
const saved = localStorage.getItem("hustleCityGame");

    if (saved) {
        const data = JSON.parse(saved);

        if (
            Number.isFinite(data.cash) &&
            Number.isFinite(data.x) &&
            Number.isFinite(data.y)
        ) {
            player.cash = data.cash;
            player.x = data.x;
            player.y = data.y;
        }
    }
} catch (error) {
    // Start a fresh game if saved data cannot be read.
}

}

document.getElementById("homeButton").addEventListener("click", () => {
showMessage(
"Hustle City Dashboard\n\n" +
"Cash: ₦" + player.cash.toLocaleString("en-NG") +
"\nLocation: " + currentPlace +
"\n\nMore dashboard features are coming soon!"
);
});

loadGame();
updateMoney();
requestAnimationFrame(draw);
