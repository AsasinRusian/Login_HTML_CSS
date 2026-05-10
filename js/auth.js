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
                    if (role === 'admin') window.location.href = 'admin.html';
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
            clearErrors(registerForm);

            const password = document.getElementById('reg_password').value;
            const confirm = document.getElementById('confirm_password').value;
            let isValid = true;

            if (password.length < 8) {
                showInputError('reg_password', 'La contraseña debe tener al menos 8 caracteres');
                isValid = false;
            }

            if (password !== confirm) {
                showInputError('confirm_password', 'Las contraseñas no coinciden');
                isValid = false;
            }

            if (!isValid) return;

            const payload = {
                full_name: document.getElementById('full_name').value,
                email: document.getElementById('reg_email').value,
                password: password,
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
                    window.location.href = "login.html?registered=true";
                } else {
                    const globalErr = document.getElementById('globalError');
                    if (globalErr) {
                        globalErr.textContent = result.message;
                        globalErr.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
    }
});


function showInputError(id, msg) {
    const input = document.getElementById(id);
    input.style.borderColor = "red"; 
    let errorSpan = input.nextElementSibling;
    if (!errorSpan || !errorSpan.classList.contains('error-text')) {
        errorSpan = document.createElement('span');
        errorSpan.classList.add('error-text');
        errorSpan.style.cssText = "color: red; font-size: 11px; display: block; margin-top: 5px;";
        input.parentNode.insertBefore(errorSpan, input.nextSibling);
    }
    errorSpan.textContent = msg;
}

function clearErrors(form) {
    form.querySelectorAll('input').forEach(i => i.style.borderColor = "");
    form.querySelectorAll('.error-text').forEach(m => m.textContent = "");
    const errBox = document.getElementById('errorMsg');
    if (errBox) errBox.style.display = 'none';

    const globalErr = document.getElementById('globalError');
    if (globalErr) globalErr.style.display = 'none';
}