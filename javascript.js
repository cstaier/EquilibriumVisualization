var canvas = document.getElementById("myCanvas");
if (canvas.getContext) var ctx = canvas.getContext("2d");
var canvasLeft, canvasTop;

var centerX = 400, centerY = 200, buffer = 14;
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
    length: 640,
    width: 10,
    left: canvas.width/2 - 640/2,
    right: canvas.width/2 + 640/2,
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

var reactants = {
    size: 20,
    x: seesaw.left + buffer,
    y: fulcrum.y - seesaw.width,
    percent: 50,
    color: "rgb(200, 0, 0)",
    draw: function() {
        if ( this.size < MIN_SIZE ) this.size = MIN_SIZE;
        else if ( this.size > MAX_SIZE ) this.size = MAX_SIZE;
        this.x = seesaw.left + buffer - 10;
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

/*  Performs necessary mathematics that alter the state of the animations.
 */
function math() {

    // Retrieves reactant and product percentage values.
    var perc_reac = document.getElementsByName("%reac")[0].value;
    var perc_prod = document.getElementsByName("%prod")[0].value;
    var k_const = document.getElementsByName("equil")[0].value;

    ctx.strokeText("perc_reac: " + perc_reac, 350, 100);
    ctx.strokeText("perc_prod: " + perc_prod, 350, 110);
    ctx.strokeText("k_const: " + k_const, 350, 120);

    
    // Updates reactant and product percentage values in objects.
    if ( perc_reac != reactants.percent && perc_reac >= 0 && perc_reac <= 100) {
        ctx.strokeText("reactants", 100, 50);
        reactants.percent = perc_reac;
        products.percent = 100 - perc_reac;
        fulcrum.k = reactants.percent != 0 ? products.percent / reactants.percent : 100;
    } else if ( perc_prod != products.percent && perc_prod >= 0 && perc_prod <= 100) {
        ctx.strokeText("products", 100, 50);
        products.percent = perc_prod;
        reactants.percent = 100 - perc_prod;
        fulcrum.k = reactants.percent != 0 ? products.percent / reactants.percent : 100;
    } else if ( k_const != fulcrum.k ) {
        ctx.strokeText("constant", 100, 50);
        if ( k_const <= 0 || k_const == null ) {
          fulcrum.k = 0;
          products.percent = 100;
          reactants.percent = 0;
        } else {
          fulcrum.k = k_const;
          products.percent = ( 100 / ( Number(fulcrum.k) + 1 ) ) * Number(fulcrum.k);
          ctx.strokeText("products.percent = " + products.percent, 100, 60);
          reactants.percent = 100 - products.percent;
        }
    }

    ctx.strokeText("products.percent = 100 / ( fulcrum.k )     " + (100 / fulcrum.k), 350, 50);
    ctx.strokeText("fulcrum.k + 1: " + (100 / ( Number(fulcrum.k) + 1 )), 350, 60);

    // Updates reactant and product percentage values in HTML elements.
    document.getElementsByName("%reac")[0].value = reactants.percent;
    document.getElementsByName("%prod")[0].value = products.percent;
    document.getElementsByName("equil")[0].value = fulcrum.k;

    // Updates sizes of reactants and products.
    reactants.size = MIN_SIZE  + (MAX_SIZE - MIN_SIZE) * (reactants.percent / 100);
    products.size = MIN_SIZE + (MAX_SIZE - MIN_SIZE) * (products.percent / 100);


    /* Determines Fulcrum Angle */
    /* Currently only works with the two variable percentage of reactant and products */
    if( document.getElementsByName("mode")[0].checked ){
        seesaw.angle = 0;
    } else if( reactants.percent == products.percent ) {
        seesaw.angle = 0;
    } else if ( reactants.percent >= products.percent ) {
        seesaw.angle = -90;
    } else if ( products.percent <= products.percent ) {
        seesaw.angle = 90;
    }
}

function showDetails() {
    //.strokeText("x: " + fulcrum.x, fulcrum.x - 10, fulcrum.y + 70);
    //ctx.strokeText("y: " + fulcrum.y, fulcrum.x - 10, fulcrum.y + 80);
    //ctx.strokeText("x: " + mouse.x, mouse.x, mouse.y + 50);
    //ctx.strokeText("y: " + mouse.y, mouse.x, mouse.y + 60);
    //ctx.strokeText("drag: " + drag, 0, 40);
    //ctx.strokeText("outOfRange: " + fulcrum.outOfRange(), 0, 50);
    //ctx.strokeText("%reac: " + reactants.percent, reactants.x, 100);
    //ctx.strokeText("%prod: " + products.percent, products.x, 100);
    //ctx.strokeText("max_left: " + max_left, seesaw.left, 300);
    //ctx.strokeText("max_right: " + max_right, seesaw.right, 300);
    //ctx.strokeText("dist_left: " + (fulcrum.x - reactants.x), centerX - 100, centerY);
    //ctx.strokeText("dist_right: " + (products.x - fulcrum.x), centerX + 100, centerY);
    //ctx.strokeText("k_const: " + fulcrum.k, fulcrum.x, fulcrum.y - 30);
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
    if( document.getElementsByName("mode")[0].checked ){
        drag = false;
        fulcrum.x = centerX;
        fulcrum.y = centerY + 50;
    }   


    // Set angle according to limit (Seesaw cannot tip below the bottom of the fulcrum).
    var maxAngle = Math.asin( (fulcrum.h) / (seesaw.length - (fulcrum.x - seesaw.left)) );
    if ( maxAngle > 50 * (Math.PI / 180) ) maxAngle = 50 * (Math.PI / 180);
    var angle = seesaw.angle * (Math.PI / 180);
    if ( angle > maxAngle ) angle = maxAngle;
    else if ( angle < -maxAngle ) angle = -maxAngle;
 
    // Draws objects to screen.
    var time = new Date();
    var angle_dx = 0; // (time.getMilliseconds() / 1000) * 360 * (Math.PI / 180);

    math();

     // Clears canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //showDetails(); //removed for stable build

    //ctx.strokeText("maxAngle:" + (maxAngle * (180 / Math.PI)), fulcrum.x, fulcrum.y - 20); //this should also be in showDetails()
    
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
    
    //obj.draw(); //removed for stable build
    
    ctx.save();

    ctx.translate(fulcrum.x, fulcrum.y);
    ctx.rotate(angle + angle_dx); // Rotates seesaw, products, and reactants.
    ctx.translate(-fulcrum.x, -fulcrum.y);

    seesaw.draw();

    //Makes 0% reactants and products disappear
    if( reactants.percent != 0 ){
        reactants.draw();
    } 
    if( products.percent != 0 ){
        products.draw();
    } 
    
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