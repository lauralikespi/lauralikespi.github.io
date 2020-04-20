// SETUP //
// Get all the values needed for the simulation (these are the default varaibles from the inputs)
var n = document.getElementById("boids").value; // number of boids
// var r = document.getElementById("radius").value;  // radius of neighbourhood
// var v = document.getElementById("velocity").value; // velocity of boids

// var weight_ali = document.getElementById("alignment").value ; // weight of alignment
// var weight_coh = document.getElementById("cohesion").value; // weight of cohesion
// var weight_sep = document.getElementById("separation").value; // weight of separation

// variables that don't change
var w = 800; // width of area
var h = 800; // height of area
var sep_cof = 100; // separation coefficient

// display variables on website
document.getElementById("boidsOutput").innerHTML = n; // number of boids
// document.getElementById("radiusOutput").innerHTML = r;  // radius of neighbour
// document.getElementById("aliOutput").innerHTML = Math.round(weight_ali*100) + "%" ; // weight of alignment as percentage
// document.getElementById("cohOutput").innerHTML = Math.round(weight_coh*100) + "%" ; // weight of cohesion as percentage
// document.getElementById("sepOutput").innerHTML = Math.round(weight_sep*100) + "%" ; // weight of separation as percentage
// document.getElementById("velOutput").innerHTML = v; // velocity of boids

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
function plotBoids(n,boids){
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
function neighbourhood(n,agent,boids){
    var neighbours = []
    var r = document.getElementById("radius").value; 
    document.getElementById("radiusOutput").innerHTML = r; 
    for (i = 0 ; i < n ; i++){
        // if (i != agent && Math.sqrt((boids[agent].x - boids[i].x)^2 + (boids[agent].y - boids[i].y)^2) < r){
        if (i != agent && Math.sqrt((Math.pow(boids[agent].x - boids[i].x,2) + Math.pow(boids[agent].y - boids[i].y,2))) < r){
            neighbours.push(boids[i]);
        }
    }
    return neighbours;
}

// Work out the magnitude and angle of cohesion
// Find the average position of all neighbours
// Use this to compute angle necessary to steer towards this centre
function cohesion(agent,neighbours){
    var x_coh = 0;
    var y_coh = 0;
    var num = neighbours.length; // number of neighbours
    for (i = 0 ; i < num ; i++){
        x_coh += neighbours[i].x;
        y_coh += neighbours[i].y;
    }
    x_coh = x_coh / num;
    y_coh = y_coh / num;

    var mag_coh = Math.sqrt(x_coh^2 + y_coh^2);
    var ang_coh = Math.atan2(y_coh, x_coh);
    if (ang_coh == NaN){
        ang_coh = 0;
    }
    return [mag_coh, ang_coh];
}

// Work out the magnitude and angle of separation
// 
function separation(agent,neighbours,boids,sep_cof){

    var x_sep = 0;
    var y_sep = 0;
    var count = 0;
    var num = neighbours.length; // number of neighbours
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
    
    var mag_sep = x_sep^2 + y_sep^2;
    var ang_sep = Math.atan2(y_sep, x_sep);
    return [mag_sep, ang_sep];
}

function alignment(agent,neighbours,boids){
    var angle = 0;
    var num = neighbours.length; // number of neighbours
    for (i = 0 ; i < num ; i++){
        angle += neighbours[i].theta;
    }
    var ang_ali = angle / num;
    return ang_ali;
}

function updateBoid(agent,boids){
    var neighbours = neighbourhood(boids,n);
    const v = document.getElementById("velocity").value;
    
    if (neighbours.length > 0){
        var ang_coh, ang_sep, ang_ali, new_x, new_y= 0;
        // var new_x, new_y;
        // var mag_coh, ang_coh, mag_sep, ang_sep, ali_ang = 0;

       // var mag_coh = cohesion(agent,neighbours)[0];
        ang_coh = cohesion(agent,neighbours)[1];
       // var mag_sep = separation(agent,neighbours,boids,sep_cof)[0];
        ang_sep = separation(agent,neighbours,boids,sep_cof)[1];
        ang_ali = alignment(agent,neighbours,boids);

        const weight_ali = document.getElementById("alignment").value ;
        const weight_coh = document.getElementById("cohesion").value;
        const weight_sep = document.getElementById("separation").value;
        

        document.getElementById("sepOutput").innerHTML = Math.round(weight_sep*100) + "%"; 
        document.getElementById("aliOutput").innerHTML = Math.round(weight_ali*100) + "%";
        document.getElementById("cohOutput").innerHTML = Math.round(weight_coh*100) + "%"; 
        document.getElementById("velOutput").innerHTML = v;
 
        const new_ang = weight_coh*ang_coh - weight_sep*ang_sep + weight_ali*ang_ali;

        new_x = boids[agent].x + v*Math.cos(new_ang);
        new_y = boids[agent].y + v*Math.sin(new_ang);
    
    
    }
    else {
        new_x = boids[agent].x - v * (Math.round(Math.random()) * 2 - 1) * Math.random(); 
        new_y = boids[agent].y - v * (Math.round(Math.random()) * 2 - 1) * Math.random(); 
    }

    switch(true){
        case new_x > w:
            boids[agent].x = (new_x - w) - w;
            break;
        case new_x < -w:
            boids[agent].x = (new_x + w) + w;
            break;
        default:
            boids[agent].x = new_x;
            break;

    }

    switch(true){
        case new_y > h:
            boids[agent].y = (new_y - h) - h;
            break;
        case new_y < -h:
            boids[agent].h = (new_y + h) + h;
            break;
        default:
            boids[agent].y = new_y;
            break;

    }

    // boids[agent].x = new_x;
    // boids[agent].y = new_y;
    return boids;
}



function updateSim(n,boids){
    // var n = document.getElementById("boidsOutput").innerHTML;
    const new_n = document.getElementById("boids").value;
    switch(new_n){
        case n:
            document.getElementById("updateNeeded").innerHTML = ""; 
            break;
        default:
            document.getElementById("updateNeeded").innerHTML = "Please stop and restart to update number of boids"; 
            break;
    }
    
    // if (new_n === n) {
    //     var count = 0;
    //     for (var boid in boids){
    //         updateBoid(count,boids);
    //         count++;
    //     }
    //     plotBoids(n,boids);
    //     updatePlot(boids,n,h,w);
        
    // }
    // else {
    //     n = document.getElementById("boids").value; // number of boids
    //     document.getElementById("boidsOutput").innerHTML = n; 
    //     boids = []; // array of all the n boids in the simulation

    //     // Add a Boid object for each boid in the array
    //     for (i = 0 ; i < n ; i++){
    //         boids[i] = new Boid();
    //     }
    //     plotBoids(n,boids);
    //     updatePlot(boids,n,h,w)
    // }

    // if (new_n != n){
    //     document.getElementById("updateNeeded").innerHTML = "Please stop and restart to update number of boids"; 
    // }
    // else {
    //     document.getElementById("updateNeeded").innerHTML = ""; 
    // }

    var count = 0;
    for (var boid in boids){
        updateBoid(count,boids);
        count++;
    }
    
    // boids.forEach(boid => {
    // //    agent = boids.indexOf(boid);
    //     console.log(boids.indexOf(boid));
    // //    updateBoid(agent,boids);
    // });

    plotBoids(n,boids);
    updatePlot(boids,n,h,w);
    return boids;
}

function updatePlot(boids,n,h,w){
    Plotly.react( graph, [{
        x: plotBoids(n,boids)[0],
        y: plotBoids(n,boids)[1],
        mode: 'markers',
        type: 'scatter' 
    }], 
    {
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


const graph = document.getElementById('flockingSim');
Plotly.plot( graph, [{
    x: plotBoids(n,boids)[0],
    y: plotBoids(n,boids)[1],
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
  }, 5);

var startButton = document.getElementById("start");
var stopButton = document.getElementById("stop");
var restartButton = document.getElementById("restart");
startButton.disabled=true;
stopButton.disabled=false;
restartButton.disabled=true;

var startSim = function(){
    // console.log("Start");
    updating = window.setInterval(function(){
        updateSim(n,boids)
      }, 1);
    startButton.disabled=true;
    stopButton.disabled=false;
    restartButton.disabled=true;
}

var stopSim = function(){
    // console.log("Stop");
    window.clearInterval(updating) // clear the timer and so stop the clock
    stopButton.disabled=true;
    startButton.disabled=false;
    restartButton.disabled=false;
}

var restartSim = function(){
    // console.log("Restart");
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