Herramienta utilizada: ChatGPT 
Fecha: 29-03-20256
Prompt utilizado: Ayudame a guiarme para hacer un index.html de un login. Con una estructura fácil de aprender para mi.
Resultado generado: 
<!-- Resultado IA.
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
</head>
<body>
    <div class="login-container">
        <img src="logo.png" alt="Logo" class="logo">
        <form>
            <h2>Iniciar Sesión</h2>
            <label>Usuario:</label>
            <input type="text" placeholder="Ingresa tu usuario">
            <label>Contraseña:</label>
            <input type="password" placeholder="Ingresa tu contraseña">
            <button type="submit">Ingresar</button>
        </form>
    </div>
</body>
</html>
-->

Modificaciones realizadas: 
- Vinculé una hoja de estilos externa
- Cambié los div por etiquetas con nombre propio como main, header y nav.
- Conecté cada label con su input usando id y for
- Cambié el campo a tipo email y agregué el atributo required.
- Agregué la recuparción de contraseña y el botón de registro.

Justificación:
- El uso de etiquetas semanticas según material de estudio mejora la jerarquía del documento para facilitar su lectura. 
- Al separar el CSS, el código queda más limpio.
- La conexión entre label e input mediante el atributo for es para que los lectores de pantalla identifiquen qué información debe ingresar el usuario.
- El Uso de required hace que ahora el navegador valide que el correo sea valido antes de ingresar.
- Se agregó la recuperación de contraseña y registro por pedido del caso.

===============================================================================================================

Herramienta utilizada: ChatGPT
Fecha: 29-03-2026
Prompt utilizado: ahora hazme un diseño bien explicado paso a paso de CSS para añadir a mi html. Que se entienda bien.
Resultado generado: 
body {
    font-family: Arial, sans-serif;
    background-color: #f2f2f2;
}

.login-container {
    width: 300px;
    margin: 100px auto;
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
}

.logo {
    width: 100px;
    margin-bottom: 15px;
}

h2 {
    margin-bottom: 15px;
}

input {
    width: 100%;
    padding: 8px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

Resumen fácil
body → toda la página
.login-container → caja del login
.logo → imagen
input → campos
button → botón
:hover → efecto al pasar el mouse

Modificaciones realizadas: 
- Implementé display: flex en el body y align-items: para un buen centrado.
- Cambié los colores genéricos por una paleta personalizada en morado y dorado, siguiento la paleta del logo facilitado para este login.
- Agregué box-sizing: border-box en los inputs para que el padding no afecte el ancho total del elemento.
- Ajusté los anchos al 70% y 50% para diferenciar la acción de ingreso con la de registro.

Justificación: 
- Según investigué display: flex es la mejor manera para centrar el body, efectivamente lo fue.
- La paleta de colores la cambié para que quedará más bonito a la visual.
- También leí que el border-box ayuda a evitar que los campos de texto se desborden de su contenedor, por lo que lo añadí.
- Lo del ajuste fue por que yo sentí que sería adecuado una diferencia visual. 



=========================================================================================================================================

Herramienta utilizada: ChatGPT 
Fecha: 29-03-2026
Prompt utilizado: crees que deba cambiar algo de mi codigo? 
<!-- Mi codigo
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="Style.Css">
    </head>
<body>
    <div class="login-container">
        <div class="logo-box">
            <img src="logo_empresa_letra_v1.png" alt="Logo SportClub">
        </div>
        <h2>Acceso</h2>
        <form>
            <div class="grupo-input">
                <label for="correo">Correo</label>
                <input type="email" id="correo" placeholder="Ingrese su correo" required>
            </div>
            <div class="grupo-input">
                <label for="password">Contraseña</label>
                <input type="password" id="password" placeholder="Ingrese su contraseña" required>
            </div>
            <button type="submit">Ingresar</button>
        </form>
        <nav>
            <a href="#">¿Olvidaste tu contraseña?</a>
        </nav>
        <hr>
        <button type="button" class="btn-registrarse">Registrarse</button>
    </div>
</body>
</html>
-->    

Resultado generado: 
<!-- Resultado IA
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main>
        <div class="login-container">
            <div class="logo-box">
                <img src="logo_empresa_letra_v1.png" alt="Logo de SportClub">
            </div>
            <h2>Acceso</h2>
            <form action="#" method="POST">
                <div class="grupo-input">
                    <label for="correo">Correo</label>
                    <input type="email" id="correo" name="correo" placeholder="ejemplo@correo.com" required>
                </div>
                <div class="grupo-input">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" name="password" placeholder="Ingrese su contraseña" required>
                </div>
                <button type="submit">Ingresar</button>
            </form>
            <nav>
                <a href="#">¿Olvidaste tu contraseña?</a>
            </nav>
            <hr>
            <button type="button" class="btn-registrarse">Registrarse</button>
        </div>
    </main>

</body>
</html>
--> 

Modificaciones realizadas: Ninguna
Justificación: A mi parecer mi codigo ya estaba funcional tal cuál estaba, así preferí no cambiar nada según lo que me dió la IA.


