const { SerialPort, ReadlineParser } = require('serialport');

const humidityLabel = document.querySelector('.humidity-text');

const humidityContainer = document.getElementById('humidity-figure');
const configurationForm = document.getElementById('config-form');

configurationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(configurationForm);
  const pathPortA = formData.get('port-a');
  const baudRate = formData.get('baud-rate');

  const port = new SerialPort({
    path: pathPortA,
    baudRate: Number.parseInt(baudRate),
    autoOpen: false,
    lock: false,
  });

  initializePort(port);
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

const initializePort = (port) => {
  port.pipe(new ReadlineParser());

  port.open((err) => {
    if (err) {
      render(/* isPortConfigured = */ false);
      throw new Error(`Error al abrir el puerto serial: ${err.message}`);
    }
    console.log(`Port ${port.path} connected`);
  });

  port.on('data', (data) => {
    const [receivedData] = data;

    const receivedDataToDecimal = Number.parseInt(receivedData);
    const resolutionVoltage = 0.019607;
    const outputVoltage = receivedDataToDecimal * resolutionVoltage;
    const sensorVoltage = outputVoltage / 1.5151;
    const humidity = sensorVoltage / 0.033;

    humidityLabel.textContent = `${humidity.toFixed(2)}%HR`;
    humidityContainer.style = `background: linear-gradient(-45deg, var(--primary-200) ${humidity.toFixed(
      2
    )}%, var(--bg-300) 0%);`;
  });
};

render(/* isPortConfigured = */ false);
