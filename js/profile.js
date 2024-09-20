const API = 'http://localhost:8030/api/users/profile';


document.addEventListener('DOMContentLoaded', async () => {
    const profile = document.querySelector('#profile');
    try {
        const response = await fetch(API, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Error al obtener la lista de usuarios');
        }

        const userProfile = await response.json();

        const userDiv = document.createElement('div');
        userDiv.classList.add('userProfile');
        userDiv.innerHTML = `
                <h2>Nombre: ${userProfile.name}, ${userProfile.lastName}</h2>
                <p>Email: ${userProfile.email}</p>
                <p>Rol: ${userProfile.rol}</p>
                 <div class="form-format">
                <label for="documentsImages">Cargar documentos (máximo 3)</label>
                <input type="file" name="documentsImages" id="documentsImages" accept="image/*" multiple>
                <button id="uploadDocumentsBtn">Subir Documentos</button>
            </div>
            `;

        profile.appendChild(userDiv);

        document.querySelector('#uploadDocumentsBtn').addEventListener('click', async () => {
            const files = document.querySelector('#documentsImages').files;
            if (files.length === 0) {
                alert('Por favor, selecciona al menos un documento para subir.');
                return;
            }
            if (files.length > 3) {
                alert('Solo puedes subir un máximo de 3 documentos.');
                return;
            }

            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('documentsImages', files[i]);
            }

            try {
                const uploadResponse = await fetch('http://localhost:8030/api/uploads/documents', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });

                // Captura el estado y cuerpo de la respuesta
                const result = await uploadResponse.json();

                // Verifica el estado de la respuesta
                if (!uploadResponse.ok) {
                    console.error('Error al subir los documentos:', result); // Mostrar el error del backend
                    throw new Error(`Error al subir los documentos: ${uploadResponse.status} - ${result.msg || result.message}`);
                }

                alert('Documentos subidos exitosamente');
                console.log(result.documents);

            } catch (error) {
                console.error('Error al subir los documentos:', error);
            }
        });


    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
    }
})