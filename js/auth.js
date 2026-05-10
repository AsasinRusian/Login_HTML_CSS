const API_BASE = "http://localhost:3000/api";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors(loginForm);

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const errorBox = document.getElementById('errorMsg');

            try {
                const response = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (response.ok && result.ok) {
                    localStorage.setItem('sc_token', result.data.token);
                    sessionStorage.setItem('sc_user', JSON.stringify(result.data.user));

                    const role = result.data.user.role;
                    if (role === 'admin') window.location.href = 'dashboard_admin.html';
                    else if (role === 'coach') window.location.href = 'coach.html';
                    else window.location.href = 'user.html';
                } else {
                    errorBox.textContent = result.message || "Credenciales incorrectas";
                    errorBox.style.display = 'block';
                    document.getElementById('email').style.borderColor = "red";
                    document.getElementById('password').style.borderColor = "red";
                }
            } catch (error) {
                errorBox.textContent = "Error de conexión con el servidor.";
                errorBox.style.display = 'block';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 1. Limpiar errores visuales previos antes de validar
            clearRegisterErrors(registerForm);

            // 2. Definición secuencial de validaciones (según orden del formulario)
            const validationRules = [
                { id: 'full_name', msg: 'El nombre completo es obligatorio' },
                { id: 'birth_date', msg: 'La fecha de nacimiento es obligatoria' },
                { id: 'phone', msg: 'El número telefónico es obligatorio' },
                { id: 'doc_num', msg: 'El número de documento es obligatorio' },
                { 
                    id: 'reg_email', 
                    msg: 'Email inválido (debe contener @)', 
                    validate: val => val.includes('@') 
                },
                { 
                    id: 'reg_password', 
                    msg: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial', 
                    validate: val => /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(val) 
                },
                { 
                    id: 'confirm_password', 
                    msg: 'Las contraseñas no coinciden', 
                    validate: val => val === document.getElementById('reg_password').value 
                },
                { 
                    id: 'acepto', 
                    msg: 'Debes aceptar los términos y condiciones', 
                    type: 'checkbox' 
                }
            ];

            // 3. Validar uno por uno en orden
            for (const rule of validationRules) {
                const input = document.getElementById(rule.id);
                if (!input) continue;

                const value = rule.type === 'checkbox' ? input.checked : input.value.trim();
                let isInvalid = rule.type === 'checkbox' ? !value : !value;

                // Validaciones extras (regex, comparaciones, etc.)
                if (!isInvalid && rule.validate) {
                    isInvalid = !rule.validate(input.value);
                }

                if (isInvalid) {
                    // Si falla, mostramos el error visual y detenemos la validación aquí
                    showRegisterError(rule.id, rule.msg);
                    input.focus(); 
                    return; // Detiene el envío y muestra solo el primer error
                }
            }

            // 4. Si todo es válido, enviar el payload
            const payload = {
                full_name: document.getElementById('full_name').value,
                email: document.getElementById('reg_email').value,
                password: document.getElementById('reg_password').value,
                birth_date: document.getElementById('birth_date').value,
                metadata: {
                    phone: document.getElementById('phone').value,
                    nivel: document.getElementById('nivel').value,
                    doc_type: document.getElementById('doc_type').value,
                    doc_num: document.getElementById('doc_num').value
                }
            };

            try {
                const response = await fetch(`${API_BASE}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (response.ok) {
                    alert("¡Se ha registrado con éxito! Ahora puede iniciar sesión.");
                    window.location.href = "login.html";
                } else {
                    const globalErr = document.getElementById('globalError');
                    if (globalErr) {
                        globalErr.textContent = result.message;
                        globalErr.style.display = 'block';
                    } else {
                        alert("Error: " + result.message);
                    }
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Error de conexión con el servidor.");
            }
        });
    }
});

/**
 * Muestra el error visual (Borde rojo + texto debajo)
 */
function showRegisterError(id, msg) {
    const input = document.getElementById(id);
    const errorDiv = document.getElementById(`err_${id}`);
    
    if (input) input.classList.add('is-invalid');
    if (errorDiv) {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
    }
}

/**
 * Limpia los errores visuales del registro
 */
function clearRegisterErrors(form) {
    form.querySelectorAll('input, select').forEach(el => {
        el.classList.remove('is-invalid');
    });
    form.querySelectorAll('.error-msg').forEach(el => {
        el.textContent = '';
    });
}

/**
 * Mantiene la función original para compatibilidad con login y otros procesos
 */
function clearErrors(form) {
    form.querySelectorAll('input').forEach(i => i.style.borderColor = "");
    form.querySelectorAll('.error-text').forEach(m => m.textContent = "");
    const errBox = document.getElementById('errorMsg');
    if (errBox) errBox.style.display = 'none';

    const globalErr = document.getElementById('globalError');
    if (globalErr) globalErr.style.display = 'none';
}