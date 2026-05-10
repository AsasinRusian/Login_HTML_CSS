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


    const navLinks = document.querySelectorAll('#adminNav [data-view]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetView = link.getAttribute('data-view');


            document.querySelectorAll('.admin-view, .content-view').forEach(v => {
                v.style.display = 'none';
                v.classList.remove('d-none');
            });


            const targetElement = document.getElementById(targetView);
            if (targetElement) {
                targetElement.style.display = 'block';
            }

            // Marcar link activo
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');


            if (targetView === 'view-users') {
                loadUsers();
            }
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
                        
                        alert("¡Perfil actualizado correctamente!");
                    } else {
                        const errorData = await response.json();
                        alert("Error del servidor: " + errorData.message);
                    }
                } catch (error) {
                    console.error("Error al conectar con la API:", error);
                    alert("Hubo un problema al intentar guardar los cambios.");
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
                        alert("Contraseña actualizada con éxito");
                        passwordForm.reset();
                    } else {
                        const errorData = await response.json();
                        alert("Error del servidor: " + errorData.message);
                    }
                } catch (error) {
                    console.error("Error al conectar con la API:", error);
                    alert("Hubo un problema al intentar cambiar la contraseña.");
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



    const userModal = new bootstrap.Modal(document.getElementById('userModal'));
    const userForm  = document.getElementById('userForm');

  
    window.loadUsers = async function loadUsers() {
        const tbody = document.getElementById('userTableBody');
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-3 opacity-50">Cargando...</td></tr>';

        try {
            const res  = await fetch(`${API_BASE}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            const users = data.data || data; 

            tbody.innerHTML = '';
            users.forEach(u => {
                const badgeClass = u.role === 'admin' ? 'badge-admin' : u.role === 'coach' ? 'badge-coach' : 'badge-user';
                const fecha = u.created_at
                    ? new Date(u.created_at).toLocaleDateString('es-CL', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
                    : 'Sin fecha';
                tbody.innerHTML += `
                    <tr>
                        <td style="padding-left:24px;color:var(--text-muted);font-size:.8rem">${u.id}</td>
                        <td style="font-weight:600">${u.full_name}</td>
                        <td style="color:var(--text-muted)">${u.email}</td>
                        <td><span class="badge-role ${badgeClass}">${u.role}</span></td>
                        <td style="color:var(--text-muted);font-size:.82rem">${fecha}</td>
                        <td class="text-end" style="padding-right:24px">
                            <button class="btn-action btn-edit me-1" onclick="openEditModal(${u.id},'${u.full_name}','${u.email}','${u.role}')" title="Editar">
                                <i class="bi bi-pencil-fill"></i>
                            </button>
                            <button class="btn-action btn-delete" onclick="deleteUser(${u.id})" title="Eliminar">
                                <i class="bi bi-trash-fill"></i>
                            </button>
                        </td>
                    </tr>`;
            });
        } catch (err) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger py-3">Error al cargar usuarios</td></tr>';
            console.error(err);
        }
    }

    document.getElementById('btnNewUser')?.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Nuevo Usuario';
        document.getElementById('userId').value = '';
        document.getElementById('userForm').reset();
        document.getElementById('passwordFields').style.display = 'block';
        clearModalErrors();
        userModal.show();
    });


    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearModalErrors();

            const id       = document.getElementById('userId').value;
            const name     = document.getElementById('modal_full_name').value.trim();
            const email    = document.getElementById('modal_email').value.trim();
            const role     = document.getElementById('role').value;
            const password = document.getElementById('password').value;
            let valid = true;

            if (!name) { showModalError('modal_full_name', 'El nombre es obligatorio'); valid = false; }
            if (!email.includes('@')) { showModalError('modal_email', 'Email inválido'); valid = false; }
            if (!id && password.length < 8) { showModalError('password', 'Mín. 8 caracteres'); valid = false; }
            if (!valid) return;

            const body = { full_name: name, email, role };
            if (password) body.password = password;

            const url    = id ? `${API_BASE}/users/${id}` : `${API_BASE}/users`;
            const method = id ? 'PUT' : 'POST';

            try {
                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(body)
                });
                if (res.ok) {
                    userModal.hide();
                    loadUsers();
                } else {
                    const err = await res.json();
                    showModalError('modal_email', err.message || 'Error al guardar');
                }
            } catch (err) { console.error(err); }
        });
    }

    function showModalError(id, msg) {
        const input = document.getElementById(id);
        const errDiv = document.getElementById(`err_${id}`);
        if (input)  input.classList.add('is-invalid');
        if (errDiv) errDiv.textContent = msg;
    }

    function clearModalErrors() {
        document.querySelectorAll('#userForm .is-invalid').forEach(el => el.classList.remove('is-invalid'));
        document.querySelectorAll('#userForm .error-msg').forEach(el => el.textContent = '');
    }

});

window.deleteUser = async function(id) {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
        const res = await fetch(`${API_BASE}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            document.querySelector(`button[onclick="deleteUser(${id})"]`)
                ?.closest('tr')?.remove();
        } else {
            alert('Error al eliminar usuario');
        }
    } catch (err) { console.error(err); }
};

window.openEditModal = function(id, name, email, role) {
    document.getElementById('modalTitle').textContent = 'Editar Usuario';
    document.getElementById('userId').value = id;
    document.getElementById('modal_full_name').value = name;
    document.getElementById('modal_email').value = email;
    document.getElementById('role').value = role;
    document.getElementById('password').value = '';
    document.getElementById('passwordFields').style.display = 'block';

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('userModal'));
    modal.show();
};