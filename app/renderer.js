const edgesTextArea = document.getElementById('edges-area');
const terminalsTextArea = document.getElementById('terminals-area');
const drawGraph = document.getElementById("draw-graph");
const nextGen = document.getElementById("next-gen");
const preGen = document.getElementById("prev-gen");
let numGen = document.getElementById("num-gen");
const autoGen = document.getElementById("auto-gen");
const openFile = document.getElementById("open-file");
const resetGen = document.getElementById("reset-gen");
const clearGraph = document.getElementById("clear-graph");
const disableGrid = document.getElementById("dis-grid");
const container = document.getElementById('myNetwork');
// const nodeSize = document.getElementById("node-size");
// const edgeSize = document.getElementById("edge-size");



let _nodes = [];
let _edges = [];
let genCount = 0;

let network;


disableGrid.addEventListener("click", () => {
    const isGridEnabled = container.classList.contains("en-grid");

    // Nếu có lớp "en-grid", loại bỏ nó; nếu không, thêm vào
    if (isGridEnabled) {
        container.classList.remove("en-grid"); // Ẩn lưới
        disableGrid.innerText = 'Enable Grid'
    } else {
        container.classList.add("en-grid"); // Hiển thị lưới
        disableGrid.innerText = 'Disable Grid'

    }
})



openFile.addEventListener("click", () => {
    file.openFile()
        .then(([rEdges, terminals]) => {
            edgesTextArea.value = rEdges;
            terminalsTextArea.value = terminals;

            numGen.innerHTML = String(0);


        }).then(() => {
        drawGraph.addEventListener("click", async () => {

            _nodes = []
            _edges = []
            const rawData = edgesTextArea.value;
            if (rawData !== "") {
                const lines = rawData.split("\n");
                for (const line of lines) {
                    const trimmedLine = line.trim();
                    const [u, v, w] = trimmedLine.split(" ");

                    if (!_nodes.some(_nodes => _nodes.id === u)) {
                        _nodes.push({id: u, label: u, color: '#178d17'});
                    }
                    if (!_nodes.some(_nodes => _nodes.id === v)) {
                        _nodes.push({id: v, label: v, color: '#178d17'});
                    }
                    _edges.push({
                        from: u,
                        to: v,
                        color: 'black',
                        label: w,
                        font: {
                            color: '#be2ab3'
                        }
                    });
                }
            }
            const terData = terminalsTextArea.value;
            if (terData !== "") {
                const terLines = terData.split("\n");
                for (const line of terLines) {
                    const t = line.trim();
                    if (!_nodes.some(_nodes => _nodes.id === t)) {
                        _nodes.push({
                            id: t,
                            label: t,
                            color: 'red'
                        });
                        //
                        // console.log({
                        //     id: t,
                        //     label: t,
                        //     color: 'red'
                        // })
                    } else {
                        _nodes.map(node => {
                            if (node.id === t) {
                                node.color = '#2154d3'
                            }
                        })
                    }

                }
            }

            // nodeSize.innerText = _nodes.length;
            // edgeSize.innerText = _edges.length;

            const gNodes = new vis.DataSet(_nodes);
            const gEdges = new vis.DataSet(_edges);

            const data = {
                nodes: gNodes,
                edges: gEdges
            };
            const options = {

                interaction: {
                    navigationButtons: true,
                    hover: true,
                },
                manipulation: {
                    enabled: true,
                },
                autoResize: true,
                height: '100%',
                width: '100%',

                edges: {
                    color: 'black',
                    scaling: {
                        label: true,
                    },
                    shadow: true,
                    smooth: {
                        type: "dynamic"
                    },
                    width: 3,
                    length: 1.5,
                },
                nodes: {
                    font: {
                        bold: {
                            color: '#343434',
                            size: 14, // px
                            face: 'arial',
                            vadjust: 0,
                            mod: 'bold'
                        },
                    },
                    borderWidth: 1.5,
                    color: {
                        border: 'black',
                        background: 'white',
                        highlight: {
                            border: '#2B7CE9',
                            background: '#D2E5FF'
                        },
                        hover: {
                            border: '#2B7CE9',
                            background: '#D2E5FF'
                        }

                    },
                    // size: 60,
                    shape: 'ellipse',
                }
            };
            network = new vis.Network(container, data, options);
            await graph.runIGA();
        })
    }).then(async () => {
            let gens = await window.graph.convertGen();
            genCount = -1;

            autoGen.addEventListener("click", async () => {
                for (genCount; genCount <= 100; genCount += 1) {
                    await Promise.all([
                        network.setData({nodes: new vis.DataSet(_nodes), edges: updateCurrentGen(gens[genCount], _edges)}),
                        new Promise(resolve => {
                            numGen.innerHTML = String(genCount+1);
                            resolve();
                        })
                    ]);
                }
            })
            preGen.addEventListener('click', () => {
                if (genCount > 0) {
                    genCount -= 1;
                    numGen.innerHTML = String(genCount+1);
                    network.setData({
                        nodes: new vis.DataSet(_nodes),
                        edges: updateCurrentGen(gens[genCount], _edges)
                    });
                    console.log("gen: " + genCount + " " + gens[genCount])

                    // console.log(_edges);
                }
            })
            nextGen.addEventListener("click", async () => {


                if (genCount <= 100) {
                    genCount += 1;
                    numGen.innerHTML = String(genCount+1);
                    // console.log("next_gen"+JSON.stringify( _edges));

                    console.log("gen: " + genCount + " " + gens[genCount])
                    await network.setData({
                        nodes: new vis.DataSet(_nodes),
                        edges: updateCurrentGen(gens[genCount], _edges)
                    });
                }
            });

            resetGen.addEventListener("click", () => {
                genCount = 0;
                numGen.innerHTML = genCount;
                network.setData({
                    nodes: new vis.DataSet(_nodes),
                    edges: new vis.DataSet(_edges)
                });

            });

            clearGraph.addEventListener("click", () => {
                genCount = 0;
                numGen.innerHTML = genCount;
                _nodes = [];
                _edges = [];
                network.setData({
                    nodes: new vis.DataSet(_nodes),
                    edges: new vis.DataSet(_edges)
                });
            });
        }
    )
});


function updateCurrentGen(genBit, gEdges) {
    let count = 0;
    let price = 0;
    let redEdges = [];
    // genBit = genBit.split('').reverse().join('');
    // console.log("Reverse Gen Bit: " + genBit)
    if (gEdges !== []) {
        for (const edge of gEdges) {
            if (String(genBit[count]) === "1") {
                edge.color = 'red';
                price += Number(edge.label);
                redEdges.push(`${edge.from} ${edge.to} ${edge.label}\n`);
            }
            count += 1;
        }
        // console.log(gEdges)
        console.log("Price of gen: " + price);
        console.log("Optimal Path: " + redEdges);
        console.log("Gen" + JSON.stringify(gEdges));
        return new vis.DataSet(gEdges);
    }

}





