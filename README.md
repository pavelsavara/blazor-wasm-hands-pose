# Blazor WASM demo of new JSInterop

This demo shows the Blazor WASM client side integration with 3rd party JavaScript library.

The awesome hands detection code is by [MediaPipe](https://www.mediapipe.dev/)

With Net7 RC1 or later do:
```
dotnet workload install wasm-tools
dotnet publish -c Release
dotnet serve --mime .wasm=application/wasm --mime .js=text/javascript --mime .json=application/json --directory bin\Release\net7.0\browser-wasm\AppBundle\
```

Live demo here https://pavelsavara.github.io/blazor-wasm-hands-pose/

