// SETUP //
// Get all the values needed for the simulation (these are the default varaibles from the inputs)
var n = 100; //document.getElementById("boids").value; // number of boids

// variables that don't change
var w = 800; // width of area
var h = 800; // height of area

// display variables on website
document.getElementById("boidsOutput").innerHTML = n; // number of boids

// Empty array to hold the boids
var boids = []; // array of all the n boids in the simulation


// Class Boid - creates a boid with three properties:
// - x and y co-ordinates (set to a random value inside the h * w grid)
// - theta (an angle of direction)
function Boid(){
    this.x = w * (Math.round(Math.random()) * 2 - 1) * Math.random(); 
    this.y = h * (Math.round(Math.random()) * 2 - 1) * Math.random(); 
    this.theta = 360 * Math.random() * Math.PI / 180; 
}

// Iniatialising the Boids with a loop to add a Boid object for each boid in the array
for (i = 0 ; i < n ; i++){
    boids[i] = new Boid();
}

// Make a variable for x and y for plotting
function plotBoids(boids){
    var x_plot = [];
    var y_plot = [];
    var n = boids.length;
    for (i = 0 ; i < n ; i++){
        x_plot.push(boids[i].x);
        y_plot.push(boids[i].y);
    }
    return [x_plot, y_plot];
}

// Create a distance matrix for the Euclidean distances between boids
function distance_matrix(boids){
    var distance = [];
    for (i = 0 ; i < n ; i++){
        distance[i] = [];
        for (j = 0; j < n; j++){
            if (i < j){
                distance[i][j] = Math.sqrt((Math.pow(boids[j].x - boids[i].x,2) + Math.pow(boids[j].y - boids[i].y,2)));                
            }
            else {
                distance[i][j] = 0;
            }
        }
    }
    return distance;
}



function neighbourhood(boids){
    var neighbours = [];
    var x,y, ang_coh, ang_sep, ang_ali = 0;
    var r = document.getElementById("radius").value; 
    const v = document.getElementById("velocity").value;
    var n = boids.length;
    var distances = distance_matrix(boids,n);
    document.getElementById("radiusOutput").innerHTML = r; 
    for (i = 0 ; i < n ; i++){
        neighbours[i] = [];
        x = boids[i].x;
        y = boids[i].y;
        for (j = 0; j < n; j++){
            if (i < j & distances[i][j]<r){
                neighbours[i].push(boids[j]); 
            }
            else if (i > j & distances[j][i]<r){
                neighbours[i].push(boids[j]);     
            }
        }
        
        if (neighbours[i].length > 0){
            ang_coh = cohesion(neighbours[i])[1];
            ang_sep = separation(neighbours[i],x,y)[1];
            ang_ali = alignment(neighbours[i]); 
    
            const weight_ali = document.getElementById("alignment").value ;
            const weight_coh = document.getElementById("cohesion").value;
            const weight_sep = document.getElementById("separation").value;
            
    
            document.getElementById("sepOutput").innerHTML = Math.round(weight_sep*100) + "%"; 
            document.getElementById("aliOutput").innerHTML = Math.round(weight_ali*100) + "%";
            document.getElementById("cohOutput").innerHTML = Math.round(weight_coh*100) + "%"; 
            document.getElementById("velOutput").innerHTML = v;
     
            const new_ang = weight_coh*ang_coh - weight_sep*ang_sep + weight_ali*ang_ali;
    
            new_x = x + v*Math.cos(new_ang);
            new_y = y + v*Math.sin(new_ang); 
        }
        else {
            new_x = x - v * (Math.round(Math.random()) * 2 - 1) * Math.random(); 
            new_y = y - v * (Math.round(Math.random()) * 2 - 1) * Math.random(); 
        }  
        // console.log(i);
        // console.log("x: ", new_x);
        // console.log("y: ", new_y);


        switch(true){
            case new_x > w:
                boids[i].x = (new_x - w) - w;
                break;
            case new_x < -w:
                boids[i].x = (new_x + w) + w;
                break;
            default:
                boids[i].x = new_x;
                break;
    
        }
    
        switch(true){
            case new_y > h:
                boids[i].y = (new_y - h) - h;
                break;
            case new_y < -h:
                boids[i].h = (new_y + h) + h;
                break;
            default:
                boids[i].y = new_y;
                break;
    
        }
    
    }



    return boids;
}

function cohesion(neighbours){
    var x_coh = 0;
    var y_coh = 0;
    var num = neighbours.length; // number of neighbours
    for (j = 0 ; j < num ; j++){
        x_coh += neighbours[j].x;
        y_coh += neighbours[j].y;
    }
    x_coh = x_coh / num;
    y_coh = y_coh / num;

    var mag_coh = Math.sqrt(x_coh^2 + y_coh^2);
    var ang_coh = Math.atan2(y_coh, x_coh);
    if (ang_coh == NaN){
        ang_coh = 0;
    }
    // console.log("Cohesion: ", mag_coh, ang_coh);
    return [mag_coh, ang_coh];
}

function separation(neighbours,x,y){
    var sep_cof = 100;
    var x_sep = 0;
    var y_sep = 0;
    var count = 0;
    var num = neighbours.length; // number of neighbours
    for (j = 0 ; j < num ; j++){
        if (Math.sqrt((Math.pow(x - neighbours[j].x),2) + Math.pow(y - neighbours[j].y,2)) < sep_cof){
            x_sep += neighbours[j].x;
            y_sep += neighbours[j].y;
            count++
        }
    }
    if (count > 0){
        x_sep = x_sep / count;
        y_sep = y_sep / count;
    }
    
    var mag_sep = x_sep^2 + y_sep^2;
    var ang_sep = Math.atan2(y_sep, x_sep);
    // console.log("Separation: ", mag_sep, ang_sep);
    return [mag_sep, ang_sep];
}

function alignment(neighbours){
    var angle = 0;
    var num = neighbours.length;// number of neighbours
    for (j = 0 ; j < num ; j++){
        angle += neighbours[j].theta;
    }
    
    var ang_ali = angle / num;
    // console.log("Alignment: ", ang_ali);
    return ang_ali;
}

const graph = document.getElementById('flockingSim');
Plotly.plot( graph, [{
    x: plotBoids(boids)[0],
    y: plotBoids(boids)[1],
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

function updatePlot(boids,h,w){
    Plotly.react( graph, [{
        x: plotBoids(boids)[0],
        y: plotBoids(boids)[1],
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

function updateSim(boids)
{
    var n = document.getElementById("boidsOutput").innerHTML;
    const new_n = document.getElementById("boids").value;
    if (new_n != n){
        document.getElementById("updateNeeded").innerHTML = "Please stop and restart to update number of boids"; 
    }   
    old_boids = boids;
    boids = neighbourhood(old_boids);
    updatePlot(boids,h,w);
    console.log("DONE");
}

var updating = window.setInterval(function(){
    updateSim(boids)
  }, 50);

var startButton = document.getElementById("start");
var stopButton = document.getElementById("stop");
var restartButton = document.getElementById("restart");
startButton.disabled=true;
stopButton.disabled=false;
restartButton.disabled=true;

var startSim = function(){
    // console.log("Start");
    updating = window.setInterval(function(){
        updateSim(boids)
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
    updatePlot(boids,h,w)
    startSim()
}