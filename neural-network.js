class NeuralNetwork {
  // neuronsByLayer is typically [2, 3, 1]
  constructor(options) {
    const { neuronsByLayer, zeroBias } = options
    console.log('Creating neural network with layers:', neuronsByLayer)
    this.layers = new Array(neuronsByLayer.length)

    // Begin with output layer and work backwards
    // Why? Because it's easier to point to a neuron that already exists
    for (let layerIndex = neuronsByLayer.length - 1; layerIndex >= 0; layerIndex--) {
      const numberOfNeurons = neuronsByLayer[layerIndex]
      const layer = new Layer(
        {
          level: layerIndex,
          isInputLayer: layerIndex === 0,
          isOutputLayer: layerIndex === neuronsByLayer.length - 1
        }
      )
      this.layers[layerIndex] = layer

      // Create neurons for this layer
      for (let i = 0; i < numberOfNeurons; i++) {
        const neuron = new Neuron(
          {
            name: `L${layerIndex}-N${i}`,
            numberOfIncomingSignals: layerIndex === 0 ? 1 : neuronsByLayer[layerIndex - 1],
            bias: zeroBias ? 0 : Math.random()
          }
        )
        layer.addNeuron(neuron)

        // Create signalPaths from this neuron to all neurons in next layer
        if (!layer.isOutputLayer) {
          const nextLayer = this.layers[layerIndex + 1]
          nextLayer.neurons.forEach(nextNeuron => {
            const signalPath = new SignalPath({ weight: Math.random(), nextNeuron })
            neuron.addSignalPath(signalPath)
          })
        }
      }
    }
  }

  // input is an array of numbers, on for each neuron in the input layer
  start(input) {
    const layerZeroNeurons = this.layers[0].neurons
    if (input.length !== layerZeroNeurons.length) {
      console.error('Input length does not match number of neurons in input layer', input, layerZeroNeurons.length)
    } else {
      layerZeroNeurons.forEach((neuron, index) => {
        neuron.receiveInput(input[index])
      })
    }
  }

  getResults() {
    console.log('Getting results', this.layers[this.layers.length - 1].neurons)
    return this.layers[this.layers.length - 1].neurons.map(neuron => neuron.activation({ usePreviousRun: true }))
  }
}

class Layer {
  constructor(data) {
    this.level = data.level
    this.neurons = []
    this.isInputLayer = data.isInputLayer
    this.isOutputLayer = data.isOutputLayer
  }

  addNeuron(neuron) {
    this.neurons.push(neuron)
  }
}

class Neuron {
  constructor(data) {
    this.name = data.name
    this.numberOfIncomingSignals = data.numberOfIncomingSignals
    this.bias = data.bias || 0
    this.signalPaths = []
    this.inputs = []
    this.previousInputs = []
  }

  addSignalPath(signalPath) {
    this.signalPaths.push(signalPath)
  }

  receiveInput(input) {
    this.inputs.push(input)
    if (this.inputs.length === this.numberOfIncomingSignals) {
      // final input received, now send signal
      this.send()
    }
  }

  activation(options = { usePreviousRun: false }) {
    const { usePreviousRun } = options
    let x = 0
    const arr = usePreviousRun ? this.previousInputs : this.inputs
    arr.forEach(input => {
      x += input
    })
    x += this.bias
    const result = Math.max(0, x)
    return result
  }

  send() {
    this.signalPaths.forEach(signalPath => {
      const output = this.activation()
      signalPath.relayOutput(output)
    })
    this.previousInputs = [...this.inputs]
    this.inputs = []
  }
}

class SignalPath {
  constructor(data) {
    this.weight = data.weight
    this.nextNeuron = data.nextNeuron
  }

  calculateOutput(output) {
    return output * this.weight
  }

  relayOutput(output) {
    this.nextNeuron.receiveInput(this.calculateOutput(output))
  }
}

// const nn = new NeuralNetwork([2, 4, 1])
// nn.start([0.3, 0.8])
// console.log('results', nn.getResults())
