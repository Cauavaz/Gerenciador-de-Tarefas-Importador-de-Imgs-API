import Swal from 'sweetalert2';

export const showAddImageModal = async () => {
  const result = await Swal.fire({
    title: '📸 Adicionar Imagem',
    html: `
      <div style="text-align: left; padding: 10px 5px;">
        <div style="margin-bottom: 24px;">
          <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #555; font-size: 0.95rem;">
            🖼️ Selecione uma Imagem
          </label>
          <div id="upload-area" style="
            border: 3px dashed #e9ecef;
            border-radius: 16px;
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            background: #f8f9fa;
          ">
            <input 
              type="file" 
              id="swal-file-input" 
              accept="image/*" 
              style="display: none;"
            >
            <div id="upload-placeholder">
              <div style="font-size: 3rem; margin-bottom: 12px;">📤</div>
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #333;">Clique para selecionar</p>
              <p style="margin: 0; font-size: 0.85rem; color: #666;">Imagens até 500KB</p>
            </div>
            <div id="upload-preview" style="display: none;">
              <div style="font-size: 3rem; margin-bottom: 12px;">✅</div>
              <p style="margin: 0; font-weight: 600; color: #28a745;">Imagem selecionada!</p>
              <p id="file-name" style="margin: 8px 0 0 0; font-size: 0.85rem; color: #666;"></p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #555; font-size: 0.9rem;">
            👤 Fotógrafo
          </label>
          <input 
            id="swal-photographer" 
            class="swal2-input" 
            placeholder="Nome do fotógrafo" 
            style="width: 100%; margin: 0; padding: 14px 16px; border: 2px solid #e9ecef; border-radius: 12px; font-size: 1rem;"
          >
        </div>

        <div style="margin-bottom: 10px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #555; font-size: 0.9rem;">
            📝 Descrição (Opcional)
          </label>
          <input 
            id="swal-description" 
            class="swal2-input" 
            placeholder="Descrição da imagem" 
            style="width: 100%; margin: 0; padding: 14px 16px; border: 2px solid #e9ecef; border-radius: 12px; font-size: 1rem;"
          >
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: '<i class="fas fa-plus"></i> Adicionar Imagem',
    cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
    width: '600px',
    customClass: {
      popup: 'swal-rounded',
      confirmButton: 'swal-btn-confirm',
      cancelButton: 'swal-btn-cancel',
    },
    buttonsStyling: false,
    focusConfirm: false,
    didOpen: () => {
      const uploadArea = document.getElementById('upload-area');
      const fileInput = document.getElementById('swal-file-input');
      const placeholder = document.getElementById('upload-placeholder');
      const preview = document.getElementById('upload-preview');
      const fileName = document.getElementById('file-name');

      // Click handler
      uploadArea.addEventListener('click', () => {
        fileInput.click();
      });

      // Hover effects
      uploadArea.addEventListener('mouseenter', () => {
        uploadArea.style.borderColor = '#1A1A2E';
        uploadArea.style.background = '#f0f0f0';
      });

      uploadArea.addEventListener('mouseleave', () => {
        uploadArea.style.borderColor = '#e9ecef';
        uploadArea.style.background = '#f8f9fa';
      });

      // File selection
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          // Validate file type
          if (!file.type.startsWith('image/')) {
            Swal.showValidationMessage('⚠️ Por favor, selecione um arquivo de imagem válido');
            return;
          }

          // Validate file size (500KB)
          const maxSize = 500 * 1024;
          if (file.size > maxSize) {
            const fileSizeKB = (file.size / 1024).toFixed(2);
            Swal.showValidationMessage(`⚠️ Imagem muito grande (${fileSizeKB}KB). Limite: 500KB`);
            fileInput.value = '';
            return;
          }

          // Show preview
          placeholder.style.display = 'none';
          preview.style.display = 'block';
          fileName.textContent = file.name;
          uploadArea.style.borderColor = '#28a745';
          uploadArea.style.background = '#d4edda';
        }
      });
    },
    preConfirm: () => {
      const fileInput = document.getElementById('swal-file-input');
      const photographer = document.getElementById('swal-photographer').value;
      const description = document.getElementById('swal-description').value;

      if (!fileInput.files[0]) {
        Swal.showValidationMessage('⚠️ Por favor, selecione uma imagem');
        return false;
      }

      if (!photographer || photographer.trim() === '') {
        Swal.showValidationMessage('⚠️ Por favor, preencha o nome do fotógrafo');
        return false;
      }

      return new Promise((resolve) => {
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
          resolve({
            file: file,
            preview: event.target.result,
            photographer: photographer.trim(),
            description: description.trim() || 'Imagem adicionada',
          });
        };

        reader.onerror = () => {
          Swal.showValidationMessage('⚠️ Erro ao processar a imagem');
          resolve(false);
        };

        reader.readAsDataURL(file);
      });
    }
  });

  if (result.isConfirmed && result.value) {
    return result.value;
  }

  return null;
};
