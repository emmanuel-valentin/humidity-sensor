const { SerialPort, ReadlineParser } = require('serialport');

const humidityLabel = document.querySelector('.humidity-text');

const humidityContainer = document.getElementById('humidity-figure');
const configurationForm = document.getElementById('config-form');

configurationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(configurationForm);
  const pathPortA = formData.get('port-a');
  const pathPortB = formData.get('port-b');
  const baudRate = formData.get('baud-rate');

  const readerPort = new SerialPort({
    path: pathPortA,
    baudRate: Number.parseInt(baudRate),
    autoOpen: false,
    lock: false,
  });

  const writerPort = new SerialPort({
    path: pathPortB,
    baudRate: Number.parseInt(baudRate),
    autoOpen: false,
    lock: false,
  });

  initializePort(writerPort, readerPort);
  render(/* isPortConfigured = */ true);
});

const render = (isPortConfigured = false) => {
  const configSection = document.getElementById('humidity-configuration');
  const humiditySection = document.getElementById('humidity');

  if (isPortConfigured) {
    configSection.hidden = true;
    humiditySection.hidden = false;
  } else {
    configSection.hidden = false;
    humiditySection.hidden = true;
  }

  console.log({
    configSection: configSection.hidden,
    humiditySection: humiditySection.hidden,
  });
};

const initializePort = (readerPort, writerPort) => {
  readerPort.pipe(new ReadlineParser());

  readerPort.open((err) => {
    if (err) {
      render(/* isPortConfigured = */ false);
      throw new Error(`Error al abrir el puerto serial: ${err.message}`);
    }
    console.log(`Port ${readerPort.path} connected`);
  });

  readerPort.on('data', (data) => {
    const [receivedData] = data;

    // Binary combination sent by the microcontroller
    // const receivedDataToDecimal = Number.parseInt(receivedData);
    const receivedDataToDecimal = Number.parseInt(data);
    const resolutionVoltage = 0.019607;
    const outputVoltage = receivedDataToDecimal * resolutionVoltage;
    const sensorVoltage = outputVoltage / 1.5151;
    const humidity = sensorVoltage / 0.033;

    humidityLabel.textContent = `${humidity.toFixed(2)}%HR`;
    humidityContainer.style = `background: linear-gradient(-45deg, var(--primary-200) ${humidity.toFixed(
      2
    )}%, var(--bg-300) 0%);`;
  });

  writerPort.open((err) => {
    if (err) {
      throw new Error(`Error al abrir el puerto serial: ${err.message}`);
    }

    let count = 0b00000000;

    setInterval(() => {
      if (count === 0b11111111) {
        count = 0b00000000;
      }

      count += 0b00000001;
      console.log(count.toString());
      readerPort.write(count.toString());
    }, 100);
  });
};

render(/* isPortConfigured = */ false);
