const API_BASE = "http://localhost:3000/api";
const token = localStorage.getItem('sc_token');

document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(sessionStorage.getItem('sc_user') || 'null');
    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');
    const btnEditHeader = document.getElementById('btnEditHeader');


    if (session) {

        const welcomeName = document.getElementById('welcome_name');
        const dashEmail = document.getElementById('dash_email');
        if (welcomeName) welcomeName.textContent = session.full_name;
        if (dashEmail) dashEmail.textContent = session.email;


        const displayName = document.getElementById('display_name');
        const displayEmail = document.getElementById('display_email');
        if (displayName) displayName.textContent = session.full_name;
        if (displayEmail) displayEmail.textContent = session.email;
        

        const inputName = document.getElementById('full_name');
        const inputEmail = document.getElementById('email');
        if (inputName) inputName.value = session.full_name;
        if (inputEmail) inputEmail.value = session.email;
    }


    const navLinks = document.querySelectorAll('#userNav [data-view]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetView = link.getAttribute('data-view');
            

            document.querySelectorAll('.user-view').forEach(v => v.classList.add('d-none'));
            const targetElement = document.getElementById(targetView);
            if (targetElement) targetElement.classList.remove('d-none');
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    if (btnEditHeader) {
        btnEditHeader.addEventListener('click', () => {
            const profileTab = document.querySelector('[data-view="view-profile"]');
            if (profileTab) profileTab.click();
            
            setTimeout(() => {
                const inputName = document.getElementById('full_name');
                if (inputName) {
                    inputName.focus();
                    inputName.select();
                }
            }, 100);
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            const name = document.getElementById('full_name').value.trim();
            const email = document.getElementById('email').value.trim();
            let isValid = true;

            if (!name) {
                showError('full_name', 'El nombre es obligatorio');
                isValid = false;
            }

            if (!email.includes('@')) {
                showError('email', 'Ingrese un email válido (debe contener @)');
                isValid = false;
            }

            if (isValid && session) {
                console.log("Intentando guardar perfil para el usuario ID:", session.id);
                
                if (!session.id) {
                    alert("Error: No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.");
                    return;
                }

                try {
                    const response = await fetch(`${API_BASE}/users/${session.id}`, {
                        method: 'PUT',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` 
                        },
                        body: JSON.stringify({
                            full_name: name,
                            email: email,
                            role: session.role 
                        })
                    });

                    const result = await response.json();

                    if (response.ok) {

                        session.full_name = name;
                        session.email = email;
                        sessionStorage.setItem('sc_user', JSON.stringify(session));

                        const welcomeName = document.getElementById('welcome_name');
                        const dashEmail = document.getElementById('dash_email');
                        const displayName = document.getElementById('display_name');
                        const displayEmail = document.getElementById('display_email');

                        if (welcomeName) welcomeName.textContent = name;
                        if (dashEmail) dashEmail.textContent = email;
                        if (displayName) displayName.textContent = name;
                        if (displayEmail) displayEmail.textContent = email;
                        
                        alert("¡Perfil actualizado correctamente en el servidor!");
                    } else {
                        alert("Error al actualizar: " + (result.message || "Problema en el servidor"));
                        console.error("Respuesta del servidor:", result);
                    }
                } catch (error) {
                    console.error("Error de conexión:", error);
                    alert("No se pudo conectar con el servidor. Verifica que el backend esté encendido.");
                }
            }
        });
    }

    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            const newPass = document.getElementById('new_pass').value;
            const confirmPass = document.getElementById('confirm_pass').value;
            let isValid = true;

            if (newPass.length < 8) {
                showError('new_pass', 'La contraseña debe tener al menos 8 caracteres');
                isValid = false;
            }

            if (newPass !== confirmPass) {
                showError('confirm_pass', 'Las contraseñas no coinciden');
                isValid = false;
            }

            if (isValid && session) {
                if (!session.id) {
                    alert("Error: No se encontró el ID del usuario. Inicia sesión nuevamente.");
                    return;
                }

                try {
                    const response = await fetch(`${API_BASE}/users/${session.id}`, {
                        method: 'PUT',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` 
                        },
                        body: JSON.stringify({
                            full_name: session.full_name,
                            email: session.email,
                            role: session.role,
                            password: newPass 
                        })
                    });

                    if (response.ok) {
                        alert("Contraseña actualizada con éxito en el servidor.");
                        passwordForm.reset();
                    } else {
                        const result = await response.json();
                        alert("Error al cambiar contraseña: " + (result.message || "Problema en el servidor"));
                    }
                } catch (error) {
                    console.error("Error de conexión:", error);
                    alert("No se pudo conectar con el servidor.");
                }
            }
        });
    }

    function showError(id, msg) {
        const input = document.getElementById(id);
        const errorDiv = document.getElementById(`err_${id}`);
        if (input) input.classList.add('is-invalid');
        if (errorDiv) errorDiv.textContent = msg;
    }

    function clearErrors() {
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    }

    document.querySelectorAll('.input-group-text').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');
            if (input && input.type === "password") {
                input.type = "text";
                icon.classList.replace('bi-eye', 'bi-eye-slash');
            } else if (input) {
                input.type = "password";
                icon.classList.replace('bi-eye-slash', 'bi-eye');
            }
        });
    });
});