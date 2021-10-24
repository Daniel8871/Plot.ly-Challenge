function init() {
    var selector = d3.select("#selDataset");
    d3.json("static/samples.json").then(function(data){

        selector.append("option").text("Select Value").property("value");
        var names = data.names

        names.forEach(function(sample){
            selector.append("option").text(sample).property("value", sample);
        })
    });
}

function optionChanged(){
    var selector = d3.select("#selDataset");
    
    var id = selector.property("value");

    buildPlot(id)
}

function buildPlot(idSet){
    d3.json("static/samples.json").then(function(data){

    samples = data.samples;

    var filteredResults = samples.filter(s => s.id == idSet);

    filteredResults.sort((a,b) => b.sample_values - a.sample_values);
    var result = filteredResults[0];

    var otu_ids = result.otu_ids.slice(0,10);
    var otu_ids2 = otu_ids.map(String);
        otu_ids2 = otu_ids2.map(x => "OTU "+x)

    var sample_values = result.sample_values.slice(0,10);
    var otu_labels = result.otu_labels.slice(0,10);

    console.log(sample_values);

    var trace = {
        x: sample_values,
        y: otu_ids2,
        type: "bar",
        orientation:"h",
        mode: 'markers',
        marker: {size:16},
        text: otu_labels
    }  

    var layout = {
        title: "10 Most Prevalent OTU's",
        xaxis: { title: "OTUs"},
        yaxis: { autorange:'reversed'}
    }
    
    var data1 = [trace];    

    Plotly.newPlot("bar", data1, layout);

    // Building bubble plot 
    var trace2 = {
        x: result.otu_ids,
        y: result.sample_values,
        text: result.otu_labels,
        mode: "markers",
        marker: {size: result.sample_values}
        
    };
    var layout2 = {
        title: `All OTU Found in Belly Button of Patient ${idSet}`,
        xaxis: { title: "OTUs"},
        };

var data2 = [trace2];

Plotly.newPlot("bubble", data2, layout2);

// var metadata = data.metadata;
//     metadata = metadata.filter(m => m.id == idSet)

var metadata = data.metadata.filter(m => m.id == idSet)[0]

console.log(metadata);

var sample_metadata = d3.select("#sample-metadata");
  
// Clear existing metadata
sample_metadata.html("");

Object.entries(metadata).forEach(([key, value]) => {
    var row = sample_metadata.append("p");
    row.text(`${key}: ${value}`)
});

    })};

init();
