let nn
const neuronRadius = 30

function setup() {
  createCanvas(800, 600)
  nn = new NeuralNetwork([2, 3, 2])
  nn.start([0.5, 0.8]) // number of inputs need to match neuron count in first layer
  console.log('Results:', nn.getResults())
}

function draw() {
  background(256)
  drawNetwork(nn)
  noLoop()
}

function drawNetwork(network) {
  const layerSpacing = width / (network.layers.length + 1) // Horizontal space between layers

  for (let i = 0; i < network.layers.length; i++) {
    const layer = network.layers[i]
    const neuronSpacing = height / (layer.neurons.length + 1) // Vertical space between neurons in a layer

    for (let j = 0; j < layer.neurons.length; j++) {
      const neuron = layer.neurons[j]

      // Calculate neuron position
      const x = (i + 1) * layerSpacing
      const y = (j + 1) * neuronSpacing

      // Draw connections to the next layer
      if (!layer.isOutputLayer) {
        const nextLayer = network.layers[i + 1]
        const nextNeuronSpacing = height / (nextLayer.neurons.length + 1) // Spacing for next layer neurons

        neuron.signalPaths.forEach((signalPath, nextIndex) => {
          console.log(`${neuron.name} -> ${signalPath.nextNeuron.name} with weight ${signalPath.weight}`)
          const nextX = ((i + 2) * layerSpacing) - neuronRadius
          const nextY = (nextIndex + 1) * nextNeuronSpacing // Structured index for alignment

          // Add line for connection
          stroke(100)
          strokeWeight(1) // Thicker lines for higher weights
          line(x + neuronRadius, y, nextX, nextY)

          // Calculate midpoint of the line
          const midX = (x + nextX) / 2
          const midY = (y + nextY) / 2

          // Semi-transparent background for the weight label
          noStroke()
          fill(255, 1, 255, 100)
          rectMode(CENTER)
          rect(midX, midY, 45, 20, 2)

          // Display weight on the midpoint
          fill(0)
          textAlign(CENTER, CENTER)
          text('w: ' + signalPath.weight.toFixed(2), midX, midY)
        })
      }

      // Neuron
      noStroke()
      fill(150, 150, 255)
      ellipse(x, y, neuronRadius * 2)

      // Neuron name and bias
      fill(0)
      textAlign(CENTER, CENTER)
      text(`${neuron.name}\nb: ${neuron.bias.toFixed(2)}`, x, y)
    }
  }
}
