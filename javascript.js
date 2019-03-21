var canvas = document.getElementById("myCanvas");
if (canvas.getContext) var ctx = canvas.getContext("2d");

//strokeText(obj.val, 0, 20);

var centerX = 400, centerY = 200;




// Object

//Fulcrum
var fulcrum = {
    x: centerX,
    y: centerY,
    w: 20,
    h: 60,
    color: "rgb(0, 0, 0)",
    draw: function() {
        ctx.lineWidth = 1;
        ctx.lineCap = "butt";
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo( (this.x + this.w/2), this.y + this.h);
        ctx.lineTo( (this.x - this.w/2), this.y + this.h);
        ctx.fill();
    }
};

// Seesaw
var seesaw = {
    length: 600,
    width: 10,
    left: canvas.width/2 - 600/2,
    right: canvas.width/2 + 600/2,
    color: "rgb(0, 0, 0)",
    angle: 0,
    draw: function() {
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.left, fulcrum.y);
        ctx.lineTo(this.right, fulcrum.y);
        ctx.stroke();
    }
};
    
    
var buffer = 20;

// Reactants
var reactants = {
    size: 20,
    x: seesaw.left + buffer,
    y: fulcrum.y - 20 - seesaw.width,
    color: "rgb(200, 0, 0)",
    draw: function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.x + seesaw.width/2, this.y + seesaw.width, this.size, this.size);
        ctx.fill();
    }
};

// Products
var products = {
    size: 60,
    x: seesaw.right - buffer - 60,
    y: fulcrum.y - 60 - seesaw.width,
    color: "rgb(0, 0, 200)",
    draw: function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.x + seesaw.width/2, this.y + seesaw.width, this.size, this.size);
        ctx.fill();
    }
};



var obj = {
    val: 5
};

/*  Initializes important variables for animation.
 */
function init() {
  window.requestAnimationFrame(draw);
}

/*  Performs necessart mathematics that alter the state of the animations.
 */
function math() {
    
}

/*  Draw animation to canvas.
 *
 *  Dynamic variables:
 *    fulcrum.x: moves fulcrum left/right (Recommended values: [-200, 200])
 *    reactants.size: size of reactants box (Recommended values: [20, 120])
 *    products.size: (products): size of products box (Recommended values: [20, 120])
 */
function draw() {
    
    // Set angle according to limit (Seesaw cannot tip below the bottom of the fulcrum).
    var maxAngle = Math.asin( (fulcrum.h) / (seesaw.length - (fulcrum.x - seesaw.left)) );
    var angle = seesaw.angle * (Math.PI / 180);
    if ( angle > maxAngle ) angle = maxAngle;
    else if ( angle < -maxAngle ) angle = -maxAngle;
    
    // Draws objects to screen.
    var time = new Date();
    var angle_dx = 0; //(time.getMilliseconds() / 1000) * 360 * (Math.PI / 180);

     // Clears canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    fulcrum.draw();
    
    ctx.save();
    
    ctx.translate(fulcrum.x, fulcrum.y);
    ctx.rotate(angle + angle_dx); // Rotates seesaw, products, and reactants.
    ctx.translate(-fulcrum.x, -fulcrum.y);
    
    seesaw.draw();
    reactants.draw();
    products.draw();
    
    ctx.restore();
  

  window.requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', function(e) {
    if ( e.clientX < 400 ) reactants.color = "rgb(0, 23, 46)";
    else reactants.color = "rgb(100, 23, 0)";
});

init();