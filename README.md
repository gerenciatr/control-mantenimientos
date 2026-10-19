# Control de mantenimientos Transintercol

## Actualizar GitHub
1. Descomprime este ZIP.
2. En el repositorio abre Add file > Upload files.
3. Sube index.html, app.js y style.css directamente a la raíz, reemplazando los anteriores. También puedes subir README.md y .nojekyll.
4. Pulsa Commit changes. Si Pages ya está configurado, se actualizará automáticamente.
5. Recarga la página con Ctrl + F5 para ver el nuevo diseño.

## Logo
El botón Cargar logo acepta PNG, JPG o WebP de hasta 2 MB. La imagen se conserva en este navegador y en los respaldos.
Para que el logo aparezca para todos los visitantes, sube al mismo repositorio una imagen PNG con el nombre exacto logo-transintercol.png. Debe quedar junto a index.html, app.js y style.css. Se recomienda PNG con fondo transparente y buena resolución.
El logo local tiene prioridad sobre el archivo compartido. Puedes quitar el local en Personalización, datos y respaldo.

## Datos
Los registros se conservan al reemplazar estos archivos si utilizas la misma dirección web, navegador y dispositivo. Descarga un respaldo antes de actualizar.
Los datos NO se sincronizan entre dispositivos. Para trasladarlos, descarga y restaura un respaldo JSON. La exportación del nuevo diseño incluye también el logo cargado.

## Primera publicación
Crea un repositorio, sube los archivos a la raíz y configura Settings > Pages > Deploy from a branch > main > / (root) > Save.

## Funcionamiento
Ingresa el kilometraje total del odómetro cada día. Configura el kilometraje del último mantenimiento de cada tipo. Los vencimientos son: último servicio + intervalo; km restantes = vencimiento - odómetro actual. Un resultado negativo representa atraso.
Intervalos: engrase 2000; aceite 10000; caja y transmisión 100000; rodamientos 48000 km.
