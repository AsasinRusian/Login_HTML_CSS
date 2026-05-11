const API_BASE = "http://localhost:3000/api";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // --- 1. LOGIN (RESTAURADO PARA FUNCIONAMIENTO DE ADMIN.JS) ---
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
                    // ESTO ES LO MÁS IMPORTANTE:
                    // 1. Guardar el token (admin.js lo usa en la línea 2)
                    localStorage.setItem('sc_token', result.data.token);
                    // 2. Guardar el usuario (admin.html y admin.js lo usan para validar el rol)
                    sessionStorage.setItem('sc_user', JSON.stringify(result.data.user));

                    const role = result.data.user.role;
                    
                    // Redirección a admin.html (tu archivo real)
                    if (role === 'admin') {
                        window.location.href = 'admin.html';
                    } else if (role === 'coach') {
                        window.location.href = 'coach.html';
                    } else {
                        window.location.href = 'user.html';
                    }
                } else {
                    if (errorBox) {
                        errorBox.textContent = result.message || "Credenciales incorrectas";
                        errorBox.style.display = 'block';
                    }
                }
            } catch (error) {
                if (errorBox) {
                    errorBox.textContent = "Error de conexión con el servidor.";
                    errorBox.style.display = 'block';
                }
            }
        });
    }

    // --- 2. REGISTRO (CON VALIDACIÓN SECUENCIAL VISUAL) ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearRegisterErrors(registerForm);

            const fields = [
                { id: 'full_name', msg: 'El nombre es obligatorio' },
                { id: 'birth_date', msg: 'La fecha es obligatoria' },
                { id: 'phone', msg: 'El teléfono es obligatorio' },
                { id: 'doc_num', msg: 'El documento es obligatorio' },
                { id: 'reg_email', msg: 'Email inválido', validate: val => val.includes('@') },
                { id: 'reg_password', msg: 'Mín. 8 caracteres, una mayúscula y un símbolo', validate: val => /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(val) },
                { id: 'confirm_password', msg: 'Las contraseñas no coinciden', validate: val => val === document.getElementById('reg_password').value },
                { id: 'acepto', msg: 'Debes aceptar los términos', type: 'checkbox' }
            ];

            for (const field of fields) {
                const input = document.getElementById(field.id);
                if (!input) continue;

                const value = field.type === 'checkbox' ? input.checked : input.value.trim();
                let invalid = field.type === 'checkbox' ? !value : !value;

                if (!invalid && field.validate) invalid = !field.validate(input.value);

                if (invalid) {
                    input.classList.add('is-invalid'); // Borde rojo
                    const errDiv = document.getElementById(`err_${field.id}`);
                    if (errDiv) {
                        errDiv.textContent = field.msg;
                        errDiv.style.display = 'block';
                    }
                    input.focus();
                    return; 
                }
            }

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
                if (response.ok) {
                    alert("¡Registro exitoso!");
                    window.location.href = "login.html";
                } else {
                    const res = await response.json();
                    alert(res.message);
                }
            } catch (err) { console.error(err); }
        });
    }
});

function clearRegisterErrors(form) {
    form.querySelectorAll('input, select').forEach(i => i.classList.remove('is-invalid'));
    form.querySelectorAll('.error-msg').forEach(m => m.textContent = "");
}

function clearErrors(form) {
    form.querySelectorAll('input').forEach(i => i.style.borderColor = "");
    const errBox = document.getElementById('errorMsg');
    if (errBox) errBox.style.display = 'none';
}