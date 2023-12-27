# Sensor de humedad 💧

## ¿Cómo clonar y ejecutar este proyecto?

Primero, verifica que tienes el siguiente software instalado en tu computadora:

1. [Node.js](https://nodejs.org)
2. Un editor de código.

Una vez comprobado que se tiene instalado el software necesario, deberás dirigirte a la carpeta del proyecto y ejecuta el siguiente comando:

```bash
npm install
```

Este comando instalará todas las dependencias necesarias para que el proyecto pueda ejecutarse.

Posteriormemte, conecta el circuito del sensor e identifica el puerto serial virtual que ha abierto. Luego, en el archivo [`sensor.js`](https://github.com/emmanuel-valentin/humidity-sensor/blob/1c4595e8c90edc0f4b884ec211c5d43542807f86/sensor.js#L37C1-L38C38) coloca el puerto correspondiente:

```js
// suponiendo que el circuito ha abierto el puerto /dev/ttyUSB0
initializePort('/dev/ttyUSB0', 9600);
```

Finalmente, ejecuta el siguiente comando:

```bash
npm run dev
```

Este comando ejecutará la aplicación y tan pronto se conecte con el puerto serial, empezará a interpretar la información enviada por el circuito.
