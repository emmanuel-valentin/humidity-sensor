const { SerialPort, ReadlineParser } = require('serialport');

const humidityLabel = document.getElementById('humidity-label');

const initializePort = (path, baudRate) => {
  const readerPort = new SerialPort({
    path,
    baudRate,
    autoOpen: false,
    lock: false,
  });

  readerPort.pipe(new ReadlineParser());

  readerPort.open((err) => {
    if (err) {
      throw new Error(`Error al abrir el puerto serial: ${err.message}`);
    }
    console.log(`Port ${readerPort.path} connected`);
  });

  readerPort.on('data', (data) => {
    console.log(data[0]);

    // Binary combination sent by the microcontroller
    const receivedData = Number.parseInt(data[0]);
    const resolutionVoltage = 0.019607;
    const outputVoltage = receivedData * resolutionVoltage;
    const sensorVoltage = outputVoltage / 1.5151;
    const humidity = sensorVoltage / 0.033;
    humidityLabel.textContent = `${humidity.toFixed(2)}%HR`;
  });

  readerPort.close();
};

// TODO: Preguntar por el puedo a leer a través de la aplicación
initializePort('/dev/ttyUSB0', 9600);
