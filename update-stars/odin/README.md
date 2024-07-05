# Odin

```sh
odin build main.odin -file -target:freestanding_wasm32
``` 

:disappointed: Actualmente hay un bug en Odin que no exporta las variables globales
como globales de WebAssembly.

Un _workaround_ para esto es utilizar un procedimiento que devuelva el puntero
de la variable global.
