
# GOALS 2.0

## Concept

- Rajah to Concentrate GAS-Terminal.
- Provide enough functionality as a console to run Jasmine.
- Use 'console.js' - node core module / Rajah to be process.stdout.

## UI

- tab panel
    - tab #1 : console output
    - tab #2 : Logger.log viewer


## modules

- rajah.js - User Interface Layer using GAS-UiApp.
    - How does it controll fixed width? word-wrap?

- console.js - stdout / stderr / stdin(?)
    - stdout and stderr are HTML buffer to paste UiApp.
    - stdin.... How?

- jasmine - What should I do? include? exclude out from this project?

- dummyTimer.js - When jasmine included.


## directories

rajah

- core
    - global.js
    - process.js
    - buffer.js

- node_core
    - console.js
    - util.js

- node_modules
    - jasmine-core
    - gas-terminal

- lib
    - rajah.js
