// Call function dropdown and init
getdropdown();
init();

// Call function init to initiate the webpage with hardcoded Subject Id 940
function init() {
    charts("940");
};

//  Function to plot Bar Graph and Bubble Chart using D3
function charts(subjectId) {
    d3.json("samples.json").then(function (data) {

        // Retrieve Test Id, Top OTU Ids, Sample Values & OTU Labels
        let testId = data.samples.filter(sample => sample.id == subjectId)[0];
        console.log("Test Id:", testId);

        let allOtuIds = testId.otu_ids;
        let topOtuIds = allOtuIds.slice(0, 10);
        console.log("All Otu Ids:", allOtuIds);
        console.log("Top Otu Ids:", topOtuIds);

        let allSampleValues = testId.sample_values;
        let topSampleValues = allSampleValues.slice(0, 10);
        console.log("All Sample Values:", allSampleValues);
        console.log("Top Sample Values:", topSampleValues);

        let allOtuLabels = testId.otu_labels;
        let topOtuLabels = allOtuLabels.slice(0, 10);
        console.log("All Otu Labels:", allOtuLabels);
        console.log("Top Otu Labels:", topOtuLabels);

        // Define Trace for Bar Graph
        let traceBar = {
            x: topSampleValues.reverse(),
            y: topOtuIds.reverse().map(otu => `OTU ${otu}`),
            text: topOtuLabels.reverse(),
            type: "bar",
            orientation: "h"
        };
        console.log(traceBar)
        let traceData = [traceBar];

        //  Layout for Bar Graph
        let layout = {
            font: {
                family: 'Gravitas One',
                size: 14
            },
            margin: {
                l: 100,
                r: 150,
                t: 30,
                b: 30
            }
        };

        Plotly.newPlot("bar", traceData, layout);

        // Trace for Bubble Chart
        var traceBubble = {
            x: allOtuIds,
            y: allSampleValues,
            text: allOtuLabels,
            mode: 'markers',
            marker: {
                color: allOtuIds,
                colorscale: 'Electric',
                size: allSampleValues
            }
        };

        var databubble = [traceBubble];

        // Layout for Bubble Chart
        var layout1 = {
            xaxis: {
                title: {
                    text: 'OTU ID',
                }
            },
            font: {
                family: 'Gravitas One',
                size: 14
            },
            height: 480,
            width: 1300
        };

        Plotly.newPlot("bubble", databubble, layout1);

        // Retrieve Metdata info
        let metadata = data.metadata.filter(samp => samp.id == subjectId)[0];
        console.log("Metadata", metadata)

        // Display metadata info for subject ID
        let demo = d3.select("#sample-metadata");
        demo.html("")
        Object.entries(metadata).forEach(([a, b]) => {
            demo.append("h5").text(`${a}:${b}`);
        });
    });
}

// Function to populate dropdown function
function getdropdown() {
    var dropdownMenu = d3.select("#selDataset");

    d3.json("samples.json").then(function (data) {
        let uniqueIds = data.names;
        console.log(uniqueIds);
        uniqueIds.forEach(element => dropdownMenu.append('option').property('value', element).text(element));
    })
};

// function when dropdown value is changed
function optionChanged(dataset) {
    console.log(dataset);
    charts(dataset);
};