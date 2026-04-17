# 🐶 Guía Rápida para Entender PUG

**Pug** (anteriormente conocido como *Jade*) no es un lenguaje de programación nuevo, es simplemente un **Motor de Plantillas**. Su único trabajo en el universo es agarrar la sintaxis resumida que tú escribes y, milisegundos antes de enviársela al navegador, **compilarla y transformarla en HTML5 puro**.

## 1. La Sintaxis Básica (El Fin de los Corchetes)
En HTML tradicional pasas un buen rato abriendo y cerrando etiquetas `< >`. En Pug, la estructura visual se basa 100% en la **tabulación (indentación)**, igual que en lenguajes como Python.

**En HTML Clásico:**
```html
<main>
    <div class="contenedor">
        <h1>Título</h1>
        <p>Este es un párrafo de texto.</p>
    </div>
</main>
```
**En PUG (Cómo se escribe ahora):**
```pug
main
    div.contenedor
        h1 Título
        p Este es un párrafo de texto.
```
> [!TIP]
> Si te equivocas en la sangría (espacios a la izquierda), Pug se quejará. ¡La tabulación estricta es lo que decide quién está adentro de quién!

---

## 2. Atributos (Clases, IDs, Hrefs)
Los atributos se colocan entre **paréntesis `()`** pegados a la etiqueta.

**HTML:** `<a href="/inicio" required="true">Volver</a>`
**PUG:**  `a(href="/inicio", required="true") Volver`

> [!NOTE]
> *Atajos:* Para añadir clases o IDs rápidos, puedes usar sintaxis de CSS como `button.rojo#principal` (equivale a `<button class="rojo" id="principal">`).

---

## 3. Mezclando Backend con Frontend (Variables)
El superpoder de Pug es que puede leer variables que Express (MVC) le regala desde el servidor usando `res.render('vista', { nombre: "Ivan" })`.

### A. Para imprimir texto como contenido (`=`)
Si quieres que una etiqueta tenga el valor de una variable, usas un signo igual:
```pug
//- Si desde Express mandamos { empleado: "Juan" }
h2= empleado
//- Resultado final en el navegador: <h2>Juan</h2>
```

### B. Para inyectar variables en medio de un texto (`#{}`)
Si necesitas mezclar texto de adorno con tu variable:
```pug
p Bienvenido a la panadería, #{empleado}!
```

### C. Para escribir lógica invisible (`-`)
Si quieres crear una variable interna de JavaScript o hacer una cuenta sin que se imprima en pantalla, inicias la línea con un guion:
```pug
- const numero = 5 + 5
p El resultado secreto es #{numero}
```

---

## 4. Estructuras de Control (Magia Dinámica)
Si intentas hacer una tabla o una lista en HTML puro, tienes que copiar tu código 20 veces. En Pug no, puedes programar la vista usando bucles y condicionales lógicos.

### A. Condicionales Estrictos (if / else)
```pug
if isEdit
    button Guardar Cambios
else
    button Crear Nuevo Empleado
```

### B. Iteraciones (Each ... in)
Esto es lo que usamos en tu `index.pug` para dibujar toda la tabla de empleados sin importar si hay 1 o 10,000 en la base de datos.
```pug
ul
    each emp in employees
        li #{emp.name} trabaja en el turno #{emp.shift}
```

---

## 5. Herencia y Layouts (El código Maestro)
En lugar de escribir la etiqueta `<head>` y vincular el CCS en las 50 pantallas de tu proyecto, Pug te permite hacer un "Layout Maestro" usando **blocks**.

1. Creas un archivo maestro (`layout.pug`) y le dejas un agujero abierto con la palabra **`block content`**.
2. Cuando creas archivos nuevos (ej: `form.pug`), arriba de todo le pones **`extends layout`**. 
3. Al hacer esto, tu nuevo form importa automáticamente toda la estructura maestra (tu CDN de PicoCSS, las fuentes y los menúes) y solo inyecta el formulario en el hueco que dejaste.
