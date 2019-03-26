var canvas = document.getElementById("myCanvas");
if (canvas.getContext) var ctx = canvas.getContext("2d");
var canvasLeft;
var canvasTop;
var raf;

var centerX = 400, centerY = 200, buffer = 20;
var drag = false;
var max_left = 240, max_right = 560;

const MIN_SIZE = 20, MAX_SIZE = 100;

// Objects

var mouse = {
    x: 0,
    y: 0
};

var dragBox = {
    x: max_left,
    y: 0,
    width: max_right - max_left,
    height: canvas.height,
    draw: function() {

    }
};

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
        if ( this.x < max_left ) {
            this.x = max_left;
            this.x = max_left + 3;
            drag = false;
        }
        else if ( this.x > max_right ){
            this.x = max_right;
            this.x = max_right - 3;
            drag = false;
        } 

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo( (this.x + this.w/2), this.y + this.h);
        ctx.lineTo( (this.x - this.w/2), this.y + this.h);
        ctx.fill();
    },
    contains: function() {
        return ctx.isPointInPath(arguments[0], arguments[1]);
    },
    outOfRange: function() {
        return this.x < max_left || this.x > max_right;
    }
};

var seesaw = {
    length: 600,
    width: 10,
    left: canvas.width/2 - 600/2,
    right: canvas.width/2 + 600/2,
    color: "rgb(0, 0, 0)",
    angle: 100,
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

var reactants = {
    size: 20,
    x: seesaw.left + buffer,
    y: fulcrum.y - seesaw.width,
    color: "rgb(200, 0, 0)",
    draw: function() {
        if ( this.size < MIN_SIZE ) this.size = MIN_SIZE;
        else if ( this.size > MAX_SIZE ) this.size = MAX_SIZE;

        this.y = fulcrum.y - seesaw.width - this.size;
        max_left = seesaw.left + this.size + 2 * buffer;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.x + seesaw.width/2, this.y + seesaw.width, this.size, this.size);
        ctx.fill();
    }
};

var products = {
    size: 100,
    x: seesaw.right - buffer,
    y: fulcrum.y - seesaw.width,
    color: "rgb(0, 0, 200)",
    draw: function() {
        if ( this.size < MIN_SIZE ) this.size = MIN_SIZE;
        else if ( this.size > MAX_SIZE ) this.size = MAX_SIZE;

        this.x = seesaw.right - buffer - this.size;
        this.y = fulcrum.y - seesaw.width - this.size;
        max_right = seesaw.right - this.size - 2 * buffer;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.x + seesaw.width/2, this.y + seesaw.width, this.size, this.size);
        ctx.fill();
    }
};

var obj = {
    size: 20,
    x: 0,
    y: 0,
    color: "rgb(0, 200, 0)",
    draw: function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();
    }
};

var positions = {
    pageX: 0,
    pageY: 0,
    clientX: 0,
    clientY: 0,
    screenX: 0,
    screenY: 0
};

/*  Initializes important variables for animation.
 */
function init() {
  window.requestAnimationFrame(draw);
}

function getPosition( element ) {
    var rect = element.getBoundingClientRect();
    return {x: rect.left,
            y:rect.top};
}

/*  Performs necessart mathematics that alter the state of the animations.
 */
function math() {

}

function showDetails() {
    ctx.strokeText("x: " + fulcrum.x, fulcrum.x - 10, fulcrum.y + 70);
    ctx.strokeText("y: " + fulcrum.y, fulcrum.x - 10, fulcrum.y + 80);
    ctx.strokeText("x: " + mouse.x, mouse.x, mouse.y + 50);
    ctx.strokeText("y: " + mouse.y, mouse.x, mouse.y + 60);
    ctx.strokeText("drag: " + drag, 0, 40);
    ctx.strokeText("outOfRange: " + fulcrum.outOfRange(), 0, 50);
    ctx.strokeText("%reac: " + arguments[0], reactants.x, 100);
    ctx.strokeText("%prod: " + arguments[1], products.x, 100);
    ctx.strokeText("max_left: " + max_left, seesaw.left, 300);
    ctx.strokeText("max_right: " + max_right, seesaw.right,300);
}

/*  Draw animation to canvas.
 *
 *  Dynamic variables:
 *    fulcrum.x: moves fulcrum left/right (Recommended values: [-200, 200])
 *    reactants.size: size of reactants box (Recommended values: [20, 120])
 *    products.size: (products): size of products box (Recommended values: [20, 120])
 */
function draw() {
    canvasLeft = getPosition(canvas).x;
    canvasTop = getPosition(canvas).y;

    var old_prod;
    var old_reac;

    var perc_prod = document.getElementsByName("%prod")[0].value;
    var perc_reac = document.getElementsByName("%reac")[0].value;

    // Set angle according to limit (Seesaw cannot tip below the bottom of the fulcrum).
    var maxAngle = Math.asin( (fulcrum.h) / (seesaw.length - (fulcrum.x - seesaw.left)) );
    var angle = seesaw.angle * (Math.PI / 180);
    if ( angle > maxAngle ) angle = maxAngle;
    else if ( angle < -maxAngle ) angle = -maxAngle;
     
    // Draws objects to screen.
    var time = new Date();
    var angle_dx = 0; //(time.getMilliseconds() / 1000) * 360 * (Math.PI / 180);

    //math();

     // Clears canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    showDetails(perc_reac, perc_prod);
    
    /*
    ctx.strokeText("clientX" + positions.clientX, mouse.x, mouse.y + 70);
    ctx.strokeText("clientY" + positions.clientY, mouse.x, mouse.y + 80);
    ctx.strokeText("pageX" + positions.pageX, mouse.x, mouse.y + 90);
    ctx.strokeText("pageY" + positions.pageY, mouse.x, mouse.y + 100);
    ctx.strokeText("screenX" + positions.screenX, mouse.x, mouse.y + 110);
    ctx.strokeText("screenY" + positions.screenY, mouse.x, mouse.y + 120);
    ctx.strokeText("canvasLeft" + canvasLeft, mouse.x, mouse.y + 130);
    ctx.strokeText("canvasTop" + canvasTop, mouse.x, mouse.y + 140);
    */
    
    obj.draw();
    
    ctx.save();
    
    ctx.translate(fulcrum.x, fulcrum.y);
    ctx.rotate(angle + angle_dx); // Rotates seesaw, products, and reactants.
    ctx.translate(-fulcrum.x, -fulcrum.y);
    
    seesaw.draw();
    reactants.draw();
    products.draw();
    
    ctx.restore();

    fulcrum.draw();
  
  raf = window.requestAnimationFrame(draw);
}

canvas.addEventListener('keydown', function(e) {
    
});

canvas.addEventListener('mouseover', function(e) {
    
});

canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX - canvasLeft;
    mouse.y = e.clientY - canvasTop;
    //positions.pageX = e.pageX;
    //positions.pageY = e.pageY;
    //positions.clientX = e.clientX;
    //positions.clientY = e.clientY;
    //positions.screenX = e.screenX;
    //positions.screenY = e.screenY;

    //obj.x = mouse.x;
    //obj.y = mouse.y;
    if (drag && !fulcrum.outOfRange()) fulcrum.x = mouse.x;
});

canvas.addEventListener('mousedown', function(e) {
    if ( fulcrum.contains(mouse.x, mouse.y) ) drag = true;
});

canvas.addEventListener('mouseup', function(e) {
    drag = false;
});

canvas.addEventListener('mouseleave', function(e) {
    drag = false;
});

init();