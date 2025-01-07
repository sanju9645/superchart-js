import * as tf from '@tensorflow/tfjs';

export class PredictiveAnalysis {
  static async predictFutureValues(values, periodsToPredict = 3) {
    // Prepare data for training
    const sequenceLength = 3;
    const xs = [];
    const ys = [];
    
    for (let i = 0; i < values.length - sequenceLength; i++) {
      xs.push(values.slice(i, i + sequenceLength));
      ys.push(values[i + sequenceLength]);
    }

    // Convert to tensors
    const xsTensor = tf.tensor2d(xs);
    const ysTensor = tf.tensor1d(ys);

    // Create and compile model
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 8, inputShape: [sequenceLength], activation: 'relu' }),
        tf.layers.dense({ units: 1 })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError'
    });

    // Train the model
    await model.fit(xsTensor, ysTensor, {
      epochs: 100,
      verbose: 0
    });

    // Make predictions
    let lastSequence = values.slice(-sequenceLength);
    const predictions = [];

    for (let i = 0; i < periodsToPredict; i++) {
      const prediction = model.predict(tf.tensor2d([lastSequence]));
      const predictedValue = await prediction.data();
      predictions.push(Number(predictedValue[0].toFixed(2)));
      lastSequence = [...lastSequence.slice(1), predictedValue[0]];
    }

    // Cleanup
    model.dispose();
    xsTensor.dispose();
    ysTensor.dispose();

    return predictions;
  }
}