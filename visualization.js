let advancedMode = true
let showIO = true
const neuronRadius = 40
let nn
const neuronNames = ['Juge Jonas', 'Milde Mille', 'Random Rick', 'Crazy Carl', 'Silly Sally', 'Boring Bob', 'Lazy Larry', 'Happy Harry']

const networkInput = [0.3, 0.8, 0.4]
const networkOptions = {
  neuronsByLayer: [3, 1],
  zeroBias: true
}


function setup() {
  createCanvas(800, 600)
  nn = new NeuralNetwork(networkOptions)
}

function draw() {
  background(256)
  drawNetwork(nn)
  noLoop()
}

function getNeuronName(neuron, neuronIndex, layer) {
  if (advancedMode) {
    if (layer.isInputLayer) {
      return neuronNames[neuronIndex] || `${neuronIndex + 1}`
    } else if (layer.isOutputLayer) {
      return 'You'
    }
    return ''
  }
  return `${neuron.name}\nb: ${neuron.bias.toFixed(2)}`
}

function handleStart() {
  background(256)
  nn.start(networkInput)
  drawNetwork(nn)
  console.log('Results:', nn.getResults())
}

function handleToggleMode() {
  advancedMode = !advancedMode
  background(256)
  drawNetwork(nn)
}

function handleToggleIO() {
  showIO = !showIO
  background(256)
  drawNetwork(nn)
}

function drawNetwork(network) {
  const layerSpacing = width / (network.layers.length + 1) // Horizontal space between layers

  for (let i = 0; i < network.layers.length; i++) {
    const layer = network.layers[i]

    // Layer background rectangle based on number of layers
    noStroke()
    fill(200, 200, 200, 100)
    rectMode(CENTER)
    rect((i + 1) * layerSpacing, height / 2, 100, height - 20, 10)

    // Layer name
    fill(0)
    textAlign(CENTER, CENTER)
    text(`Layer ${i + 0}`, (i + 1) * layerSpacing, 20)

    const neuronSpacing = height / (layer.neurons.length + 1) // Vertical space between neurons in a layer

    for (let j = 0; j < layer.neurons.length; j++) {
      const neuron = layer.neurons[j]
      const neuronName = getNeuronName(neuron, j, layer)

      // Calculate neuron position
      const x = (i + 1) * layerSpacing
      const y = (j + 1) * neuronSpacing

      // Neuron
      noStroke()
      fill(150, 150, 255)
      ellipse(x, y, neuronRadius * 2)

      // Neuron name and bias
      fill(0)
      textAlign(CENTER, CENTER)
      text(neuronName + (showIO ? `\n${neuron.activation({ usePreviousRun: true }).toFixed(2)}` : ''), x, y)

      // Draw connections to the next layer
      if (!layer.isOutputLayer) {
        const nextLayer = network.layers[i + 1]
        const nextNeuronSpacing = height / (nextLayer.neurons.length + 1) // Spacing for next layer neurons

        neuron.signalPaths.forEach((signalPath, nextIndex) => {
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

      if (showIO) {
        neuron.previousInputs.forEach((input, index) => {
          const yOffset = (index - 1) * neuronRadius / 2
          // Semi-transparent background for the input label
          noStroke()
          fill(1, 175, 1, 150)
          rectMode(CENTER)
          rect(x - neuronRadius, y + yOffset, 40, 18, 2)

          // Label for input
          fill(0)
          textAlign(CENTER, CENTER)
          text(input.toFixed(2), x - neuronRadius, y + yOffset)
        })
      }
    }
  }
}
