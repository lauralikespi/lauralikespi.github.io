// SETUP //
// Get all the values needed for the simulation (these are the default varaibles from the inputs)
n = document.getElementById("boids").value; // number of boids
r = document.getElementById("radius").value;  // radius of neighbourhood
v = document.getElementById("velocity").value; // velocity of boids

weight_ali = document.getElementById("alignment").value ; // weight of alignment
weight_coh = document.getElementById("cohesion").value; // weight of cohesion
weight_sep = document.getElementById("separation").value; // weight of separation

// variables that don't change
w = 800; // width of area
h = 800; // height of area
sep_cof = 100; // separation coefficient

// display variables on website
document.getElementById("boidsOutput").innerHTML = n; // number of boids
document.getElementById("radiusOutput").innerHTML = r;  // radius of neighbour
document.getElementById("aliOutput").innerHTML = Math.round(weight_ali*100) + "%" ; // weight of alignment as percentage
document.getElementById("cohOutput").innerHTML = Math.round(weight_coh*100) + "%" ; // weight of cohesion as percentage
document.getElementById("sepOutput").innerHTML = Math.round(weight_sep*100) + "%" ; // weight of separation as percentage
document.getElementById("velOutput").innerHTML = v; // velocity of boids

// Class for creating Boids, each boid has an x and y starting value that is a random number between 0 and 100
function Boid(){
    this.x = w * (Math.round(Math.random()) * 2 - 1) * Math.random(); 
    this.y = h * (Math.round(Math.random()) * 2 - 1) * Math.random(); 
    this.theta = 360 * Math.random() * Math.PI / 180; 
}

// Empty array to hold the boids
var boids = []; // array of all the n boids in the simulation

// Add a Boid object for each boid in the array
for (i = 0 ; i < n ; i++){
    boids[i] = new Boid();
}

// Make a variable for x and y for plotting
function plotBoids(n){
    var x_plot = [];
    var y_plot = [];
    for (i = 0 ; i < n ; i++){
        x_plot.push(boids[i].x);
        y_plot.push(boids[i].y);
    }
    return [x_plot, y_plot];
}
// Is the above function necessary?

// Work out the neighbourhood of each boid 
// I.e. is another boid within a certain distance (r) from that boid
// Uses Pythagoras theorem
function neighbourhood(agent,boids,n){
    neighbours = []
    r = document.getElementById("radius").value; 
    document.getElementById("radiusOutput").innerHTML = r; 
    for (i = 0 ; i < n ; i++){
        if (i != agent && Math.sqrt((boids[agent].x - boids[i].x)^2 + (boids[agent].y - boids[i].y)^2) < r){
            neighbours.push(boids[i]);
        }
    }
    return neighbours;
}

// Work out the magnitude and angle of cohesion
// Find the average position of all neighbours
// Use this to compute angle necessary to steer towards this centre
function cohesion(agent,neighbours){
    x_coh = 0;
    y_coh = 0;
    num = neighbours.length; // number of neighbours
    for (i = 0 ; i < num ; i++){
        x_coh += neighbours[i].x;
        y_coh += neighbours[i].y;
    }
    x_coh = x_coh / num;
    y_coh = y_coh / num;

    mag_coh = Math.sqrt(x_coh^2 + y_coh^2);
    ang_coh = Math.atan2(y_coh, x_coh);
    if (ang_coh == NaN){
        ang_coh = 0;
    }
    return [mag_coh, ang_coh];
}

// Work out the magnitude and angle of separation
// 
function separation(agent,neighbours,boids,sep_cof){

    x_sep = 0;
    y_sep = 0;
    count = 0;
    num = neighbours.length; // number of neighbours
    for (i = 0 ; i < num ; i++){
        if (Math.sqrt((boids[agent].x - neighbours[i].x)^2 + (y_sep += boids[agent].y - neighbours[i].y)^2) < sep_cof){
            x_sep += neighbours[i].x;
            y_sep += neighbours[i].y;
            count++
        }
    }
    if (count > 0){
        x_sep = x_sep / count;
        y_sep = y_sep / count;
    }
    
    mag_sep = x_sep^2 + y_sep^2;
    ang_sep = Math.atan2(y_sep, x_sep);
    return [mag_sep, ang_sep];
}

function alignment(agent,neighbours,boids){
    angle = 0;
    num = neighbours.length; // number of neighbours
    for (i = 0 ; i < num ; i++){
        angle += neighbours[i].theta;
    }
    ang_ali = angle / num;
    return ang_ali;
}

function updateBoid(agent,boids){
    neighbours = neighbourhood(agent,boids,n);
    
    if (neighbours.length > 0){

        var mag_coh, ang_coh, mag_sep, ang_sep, ali_ang = 0;

        mag_coh = cohesion(agent,neighbours)[0];
        ang_coh = cohesion(agent,neighbours)[1];
        mag_sep = separation(agent,neighbours,boids,sep_cof)[0];
        ang_sep = separation(agent,neighbours,boids,sep_cof)[1];
        ang_ali = alignment(agent,neighbours,boids);

        weight_ali = document.getElementById("alignment").value ;
        weight_coh = document.getElementById("cohesion").value;
        weight_sep = document.getElementById("separation").value;
        v = document.getElementById("velocity").value; 

        document.getElementById("sepOutput").innerHTML = Math.round(weight_sep*100) + "%"; 
        document.getElementById("aliOutput").innerHTML = Math.round(weight_ali*100) + "%";
        document.getElementById("cohOutput").innerHTML = Math.round(weight_coh*100) + "%"; 
        document.getElementById("velOutput").innerHTML = v;
 
        new_ang = weight_coh*ang_coh - weight_sep*ang_sep + weight_ali*ang_ali;

        new_x = boids[agent].x + v*Math.cos(new_ang);
        new_y = boids[agent].y + v*Math.sin(new_ang);
    
    
    }
    else {
        new_x = boids[agent].x - v * (Math.round(Math.random()) * 2 - 1) * Math.random(); 
        new_y = boids[agent].y - v * (Math.round(Math.random()) * 2 - 1) * Math.random(); 
    }

    if (new_x > w){
        new_x = (new_x - w) - w;
    }

    if (new_y > h){
        new_y = (new_y - h) - h;
    }

    if (new_x < - w){
        new_x = (new_x + w) + w;
    }

    if (new_y < - h){
        new_y = (new_y + h) + h;
    }

    boids[agent].x = new_x;
    boids[agent].y = new_y;
    return;
}



function updateSim(n,boids,h,w){
    var new_n = document.getElementById("boids").value;
    if (new_n != n){
        document.getElementById("updateNeeded").innerHTML = "Please stop and restart to update number of boids"; 
    }
    else {
        document.getElementById("updateNeeded").innerHTML = ""; 
    }

    boids.forEach(boid => {
       agent = boids.indexOf(boid);
       updateBoid(agent,boids);
    });

    plotBoids(n);
    updatePlot(boids,n,h,w);
    return;
}

function updatePlot(boids,n,h,w){
    Plotly.react( graph, [{
        x: plotBoids(n)[0],
        y: plotBoids(n)[1],
        mode: 'markers',
        type: 'scatter' }], {
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 4
            },
        plot_bgcolor : '#E6E6FA',
        xaxis: {
            range: [-w, w],
            showgrid: false,
            zeroline: false,
            showline: false,
            ticks: '',
            showticklabels: false,
        }
        ,
        yaxis: {
            range: [-h, h],
            showgrid: false,
            zeroline: false,
            showline: false,
            ticks: '',
            showticklabels: false,
        },
        hovermode: false,
     })
}


graph = document.getElementById('flockingSim');
Plotly.plot( graph, [{
    x: plotBoids(n)[0],
    y: plotBoids(n)[1],
    mode: 'markers',
    type: 'scatter' }], {
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 4
        },
    displayModeBar: false,
    plot_bgcolor : '#E6E6FA',
    xaxis: {
        range: [-w, w],
        showgrid: false,
        zeroline: false,
        showline: false,
        ticks: '',
        showticklabels: false,
    },
    yaxis: {
        range: [-h, h],
        showgrid: false,
        zeroline: false,
        showline: false,
        ticks: '',
        showticklabels: false,
    },
    hovermode: false,
 });

var updating = window.setInterval(function(){
    updateSim(n,boids)
  }, 2000);

var startButton = document.getElementById("start");
var stopButton = document.getElementById("stop");
var restartButton = document.getElementById("restart");
startButton.disabled=true;
stopButton.disabled=false;
restartButton.disabled=true;

var startSim = function(){
    console.log("Start");
    updating = window.setInterval(function(){
        updateSim(n,boids)
      }, 2000);
    startButton.disabled=true;
    stopButton.disabled=false;
    restartButton.disabled=true;
}

var stopSim = function(){
    console.log("Stop");
    window.clearInterval(updating) // clear the timer and so stop the clock
    stopButton.disabled=true;
    startButton.disabled=false;
    restartButton.disabled=false;
}

var restartSim = function(){
    console.log("Restart");
    n = document.getElementById("boids").value; // number of boids
    document.getElementById("boidsOutput").innerHTML = n; 
    document.getElementById("updateNeeded").innerHTML = ""; 
    // Empty array to hold the boids
    boids = []; // array of all the n boids in the simulation

    // Add a Boid object for each boid in the array
    for (i = 0 ; i < n ; i++){
        boids[i] = new Boid();
    }
    updatePlot(boids,n,h,w)
    startSim()
}


// is separation coefficient correct?
// should all algorithms be calculated just using neighbours?
// 