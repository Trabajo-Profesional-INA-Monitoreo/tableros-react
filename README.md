# INA Monitoreo - Tableros

## Ejecución
La aplicación se puede ejecutar de forma local o contanerizada. 

Se provee un  `Makefile` para simplificar la ejecución de los comandos. Se puede ejecutar como `make <target>`

El `Makefile` tiene las acciones:
* `make run`: Descarga las dependencias y levanta la aplicación de forma local.
* `make docker-run`: Realiza el build del container de docker a partir de la imagen en el Dockerfile y levanta el contenedor.

La aplicación utiliza el puerto 3000.

### Configuración
Se debe configurar la URL de la API en el archivo `.env`:

```
REACT_APP_API_URL = '<API_URL>'
```

Incluir en la URL el path base `/api/v1`

### Herramientas

Se dejan referencias a la documentación de herramientas utilizadas:
* [React](https://react.dev/)
* [MUI](https://mui.com/)
