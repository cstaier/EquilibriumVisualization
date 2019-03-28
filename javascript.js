var canvas = document.getElementById("myCanvas");
if (canvas.getContext) var ctx = canvas.getContext("2d");
var canvasLeft, canvasTop;

var centerX = 400, centerY = 200, buffer = 20;
var drag = false;
var max_left = 250, max_right = 550;

const MIN_SIZE = 10, MAX_SIZE = 150;

// Objects

var mouse = {
    x: -100,
    y: -100
};

var fulcrum = {
    x: centerX,
    y: centerY + 50,
    w: 20,
    h: 60,
    k: 1,
    color: "rgb(0, 0, 0)",
    draw: function() {
        ctx.lineWidth = 1;
        ctx.lineCap = "butt";
        ctx.fillStyle = this.color;

         if ( this.k < 0 ) this.k = 0;
        //else if ( this.k >  )

        // Keeps fulcrum position within range.
        if ( this.x < max_left ) {
            this.x = max_left + 1;
            drag = false;
        }
        else if ( this.x > max_right ){
            this.x = max_right - 1;
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
    percent: 50,
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
    percent: 50,
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
    // Retrieves reactant and product percentage values.
    var perc_reac = document.getElementsByName("%reac")[0].value;
    var perc_prod = document.getElementsByName("%prod")[0].value;
    
    // Updates reactant and product percentage values in objects.
    if ( reactants.percent != perc_reac && perc_reac >= 0 && perc_reac <= 100) {
        reactants.percent = perc_reac;
        products.percent = 100 - perc_reac;
    } else if ( products.percent != perc_prod && perc_prod >= 0 && perc_prod <= 100) {
        products.percent = perc_prod;
        reactants.percent = 100 - perc_prod;
    }

    // Updates reactant and product percentage values in HTML elements.
    document.getElementsByName("%reac")[0].value = reactants.percent;
    document.getElementsByName("%prod")[0].value = products.percent;

    // Updates sizes of reactants and products.
    reactants.size = MIN_SIZE  + (MAX_SIZE - MIN_SIZE) * (reactants.percent / 100);
    products.size = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * (products.percent / 100);

    /*
    var reac_force = (fulcrum.x - reactants.x) * reactants.size;
    var prod_force = (products.x - fulcrum.x) * products.size;

    if ( reac_force > prod_force ) {

    } else {

    }

    ctx.strokeText("reac_force: " + reac_force, centerX - 100, centerY - 20);
    ctx.strokeText("prod_force: " + prod_force, centerX + 100, centerY - 20);
    */

    // Retrieves equilibrium constant value.
    fulcrum.k = document.getElementsByName("equil")[0].value;
    if ( drag ) {
        if ( fulcrum.k <= 1 ) {
            document.getElementsByName("equil")[0].value = ( fulcrum.x - max_left ) / ( centerX - max_left);
        } else {

        }
    } else {
        if ( fulcrum.k <= 1 ) {
            fulcrum.x = max_left + (centerX - max_left) * fulcrum.k;
        } else {

        }
    }
}

function showDetails() {
    //.strokeText("x: " + fulcrum.x, fulcrum.x - 10, fulcrum.y + 70);
    //ctx.strokeText("y: " + fulcrum.y, fulcrum.x - 10, fulcrum.y + 80);
    ctx.strokeText("x: " + mouse.x, mouse.x, mouse.y + 50);
    ctx.strokeText("y: " + mouse.y, mouse.x, mouse.y + 60);
    //ctx.strokeText("drag: " + drag, 0, 40);
    //ctx.strokeText("outOfRange: " + fulcrum.outOfRange(), 0, 50);
    ctx.strokeText("%reac: " + reactants.percent, reactants.x, 100);
    ctx.strokeText("%prod: " + products.percent, products.x, 100);
    //ctx.strokeText("max_left: " + max_left, seesaw.left, 300);
    //ctx.strokeText("max_right: " + max_right, seesaw.right, 300);
    //ctx.strokeText("dist_left: " + (fulcrum.x - reactants.x), centerX - 100, centerY);
    //ctx.strokeText("dist_right: " + (products.x - fulcrum.x), centerX + 100, centerY);
    ctx.strokeText("k_const: " + fulcrum.k, fulcrum.x, fulcrum.y - 30);
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

    // Set angle according to limit (Seesaw cannot tip below the bottom of the fulcrum).
    var maxAngle = Math.asin( (fulcrum.h) / (seesaw.length - (fulcrum.x - seesaw.left)) );
    if ( maxAngle > 50 * (Math.PI / 180) ) maxAngle = 50 * (Math.PI / 180);
    var angle = seesaw.angle * (Math.PI / 180);
    if ( angle > maxAngle ) angle = maxAngle;
    else if ( angle < -maxAngle ) angle = -maxAngle;


     
    // Draws objects to screen.
    var time = new Date();
    var angle_dx = 0; //(time.getMilliseconds() / 1000) * 360 * (Math.PI / 180);

    math();

     // Clears canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    showDetails();

    ctx.strokeText("maxAngle:" + (maxAngle * (180 / Math.PI)), fulcrum.x, fulcrum.y - 20);
    
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
  
    window.requestAnimationFrame(draw);
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