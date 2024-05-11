# PyForecast (pyforecast)

PyForecast system for BSCS undergrad thesis.

## Notes before running the project
```bash
- Make sure that Python and the relevant libraries are installed.
- Same goes with Node.js and NPM.
```

## Install the dependencies for frontend
```bash
yarn
# or
npm install
```

## Install the dependencies for backend
```bash
For Python:
pip install numpy 1.26.2
pip install scikit-learn 1.3.2 
pip install requests pymongo

For Node.js:
npm install node express mongoose cors bcryptjs jsonwebtoken dotenv
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Start the backend app
```bash
In src/server directory, run: 
node server.js
```

### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
