# Modelo 3D definitivo — Veloir Motors

Vehículo seleccionado: **Mercedes-AMG C 63 S E Performance (W206, berlina)**.

## Estado
La portada premium sigue utilizando `vehiculo.glb` como modelo temporal. **No sustituirlo por un archivo ajeno hasta verificar la licencia comercial y la estructura del modelo.**

## Candidatos investigados
1. Elite Models / CGTrader: https://www.cgtrader.com/3d-models/car/sport-car/mercedes-benz-c63s-amg-e-performance-2023-16bcbc70-c601-4188-b14f-fcb72303eacb — glTF 42.1 MB; anunciado como animado y rigged. Verificar nombres de piezas, animaciones y licencia de distribución web.
2. HKV Studios / CGTrader: https://www.cgtrader.com/3d-models/car/racing-car/2023-mercedes-benz-c63-s-amg-e-performance-f1-edition — piezas separadas, pero malla pesada, requiere optimización.
3. NLM / Sketchfab: https://sketchfab.com/3d-models/mercedes-benz-c63s-amg-e-performance-2023-48a8a51aff784e40b1679b6f87f4a0cc — referencia visual; licencia y descarga sin verificar.

## Criterios de aceptación
- Licencia comercial que permita el uso concreto en una web pública, incluido el acceso al archivo desde el cliente.
- Archivo glTF/GLB con materiales PBR y texturas integradas; pintura, cristales y luces correctos.
- Puertas, capó, maletero y ruedas separados o animaciones exportadas a glTF.
- Optimización: LOD o decimación, texturas KTX2/WebP cuando sea posible, compresión de mallas; comprobar calidad y rendimiento en móvil.
- Ajustar cámara, escala y luces en `premium.js` al nuevo modelo.
- Añadir una alternativa estática para navegadores sin WebGL y para conexiones lentas.
- Validar visualmente en móvil y escritorio antes de fusionar la rama.

## Integración futura
Reemplazar `vehiculo.glb` únicamente tras obtener el archivo y confirmar derechos; adaptar `premium.js` a los nombres reales de las piezas. No asumir que «rigged» significa que las puertas se abren automáticamente.
