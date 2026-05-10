const API_BASE = "http://localhost:3000/api";
const token = localStorage.getItem('sc_token');
const userModal = new bootstrap.Modal(document.getElementById('userModal'));
const userForm = document.getElementById('userForm');

document.addEventListener('DOMContentLoaded', loadUsers);

async function loadUsers() {
    try {
        const res = await fetch(`${API_BASE}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.ok) renderUsers(result.data);
    } catch (err) {
        console.error("Error cargando usuarios:", err);
    }
}

function renderUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    users.forEach(user => {
        const fecha = new Date(user.created_at).toLocaleDateString('es-CL');
        let badge = user.role === 'admin' ? 'bg-danger' : (user.role === 'coach' ? 'bg-primary' : 'bg-success');
        
        tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.full_name}</td>
                <td>${user.email}</td>
                <td><span class="badge ${badge}">${user.role}</span></td>
                <td>${fecha}</td>
                <td class="text-center">
                    <button class="btn btn-warning btn-sm me-1" onclick="openEditModal(${user.id})">✎</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">🗑</button>
                </td>
            </tr>`;
    });
}


async function deleteUser(id) {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
        const res = await fetch(`${API_BASE}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.ok) loadUsers();
    } catch (err) {
        console.error("Error eliminando usuario:", err);
    }
}


function openCreateModal() {
    userForm.reset();
    document.getElementById('userId').value = '';
    document.getElementById('modalTitle').innerText = 'Nuevo Usuario';
    document.getElementById('passwordFields').style.display = 'block';
    document.getElementById('password').required = true;
    userModal.show();
}


async function openEditModal(id) {
    try {
        const res = await fetch(`${API_BASE}/users/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.ok) {
            const user = result.data;
            document.getElementById('userId').value = user.id;
            document.getElementById('full_name').value = user.full_name;
            document.getElementById('email').value = user.email;
            document.getElementById('role').value = user.role;
            
            document.getElementById('modalTitle').innerText = 'Editar Usuario';
            document.getElementById('passwordFields').style.display = 'none'; 
            document.getElementById('password').required = false;
            userModal.show();
        }
    } catch (err) {
        console.error("Error al cargar detalle:", err);
    }
}

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').value;
    
    const payload = {
        full_name: document.getElementById('full_name').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value
    };


    if (!userId) {
        const pass = document.getElementById('password').value;
        const confirm = document.getElementById('confirm_password').value;
        if (pass !== confirm) {
            document.getElementById('confirm_password').classList.add('is-invalid');
            return;
        }
        payload.password = pass;
    }

    const url = userId ? `${API_BASE}/users/${userId}` : `${API_BASE}/users`;
    const method = userId ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        
        if (result.ok) {
            userModal.hide();
            loadUsers();
        } else {
            alert("Error: " + result.message); 
        }
    } catch (err) {
        console.error("Error al guardar:", err);
    }
});