import Swal from 'sweetalert2';

// Configuração padrão para todos os alertas
const defaultConfig = {
  confirmButtonColor: '#1A1A2E',
  cancelButtonColor: '#6c757d',
  background: '#fff',
  color: '#333',
  customClass: {
    popup: 'swal-rounded',
    confirmButton: 'swal-btn-confirm',
    cancelButton: 'swal-btn-cancel',
  },
  buttonsStyling: false,
};

// Toast de sucesso
export const showSuccessAlert = (message) => {
  Swal.fire({
    icon: 'success',
    title: message,
    timer: 2500,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    timerProgressBar: true,
    customClass: {
      popup: 'swal-toast-rounded',
      timerProgressBar: 'swal-timer-bar',
    },
  });
};

// Toast de erro
export const showErrorAlert = (message) => {
  Swal.fire({
    icon: 'error',
    title: message,
    timer: 3000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    timerProgressBar: true,
    customClass: {
      popup: 'swal-toast-rounded',
      timerProgressBar: 'swal-timer-bar',
    },
  });
};

// Toast de informação
export const showInfoAlert = (message) => {
  Swal.fire({
    icon: 'info',
    title: message,
    timer: 2500,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    timerProgressBar: true,
    customClass: {
      popup: 'swal-toast-rounded',
      timerProgressBar: 'swal-timer-bar',
    },
  });
};

// Modal de confirmação de exclusão
export const showDeleteConfirm = async (taskText, taskCategory) => {
  const result = await Swal.fire({
    title: 'Excluir Tarefa?',
    html: `
      <div style="text-align: left; padding: 15px 5px;">
        <div style="background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%); padding: 20px; border-radius: 16px; margin-bottom: 20px; border-left: 4px solid #dc3545;">
          <p style="margin: 0 0 12px 0; font-size: 0.85rem; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Tarefa</p>
          <p style="margin: 0; font-size: 1.1rem; color: #333; font-weight: 500; line-height: 1.5;">${taskText}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #f8f9fa; border-radius: 12px;">
          <span style="background: #1A1A2E; color: white; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">${taskCategory}</span>
        </div>
      </div>
    `,
    icon: 'warning',
    iconColor: '#dc3545',
    showCancelButton: true,
    confirmButtonText: '<i class="fas fa-trash"></i> Sim, excluir',
    cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
    ...defaultConfig,
    reverseButtons: true,
    width: '500px',
  });

  return result.isConfirmed;
};

// Modal de adicionar/editar tarefa
export const showTaskModal = async (editingTodo = null) => {
  const isEditing = editingTodo !== null;
  
  const result = await Swal.fire({
    title: isEditing ? '✏️ Editar Tarefa' : '➕ Nova Tarefa',
    html: `
      <div style="text-align: left; padding: 10px 5px;">
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #555; font-size: 0.9rem;">📝 Descrição da Tarefa</label>
          <input 
            id="swal-input-text" 
            class="swal2-input" 
            placeholder="Digite a tarefa..." 
            value="${isEditing ? editingTodo.text : ''}" 
            style="width: 100%; margin: 0; padding: 14px 16px; border: 2px solid #e9ecef; border-radius: 12px; font-size: 1rem; transition: all 0.3s;"
            onfocus="this.style.borderColor='#1A1A2E'; this.style.boxShadow='0 0 0 3px rgba(26, 26, 46, 0.1)';"
            onblur="this.style.borderColor='#e9ecef'; this.style.boxShadow='none';"
          >
        </div>
        <div style="margin-bottom: 10px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #555; font-size: 0.9rem;">📂 Categoria</label>
          <select 
            id="swal-input-category" 
            class="swal2-select" 
            style="width: 100%; margin: 0; padding: 14px 16px; border: 2px solid #e9ecef; border-radius: 12px; font-size: 1rem; cursor: pointer; transition: all 0.3s; background: white;"
            onfocus="this.style.borderColor='#1A1A2E'; this.style.boxShadow='0 0 0 3px rgba(26, 26, 46, 0.1)';"
            onblur="this.style.borderColor='#e9ecef'; this.style.boxShadow='none';"
          >
            <option value="Pendente" ${isEditing && editingTodo.category === 'Pendente' ? 'selected' : ''}>🔴 Pendente</option>
            <option value="Progresso" ${isEditing && editingTodo.category === 'Progresso' ? 'selected' : ''}>🟡 Em Progresso</option>
            <option value="Concluídas" ${isEditing && editingTodo.category === 'Concluídas' ? 'selected' : ''}>🟢 Concluída</option>
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: isEditing ? '<i class="fas fa-save"></i> Salvar' : '<i class="fas fa-plus"></i> Adicionar',
    cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
    ...defaultConfig,
    reverseButtons: true,
    width: '550px',
    focusConfirm: false,
    preConfirm: () => {
      const text = document.getElementById('swal-input-text').value;
      const category = document.getElementById('swal-input-category').value;
      
      if (!text || text.trim() === '') {
        Swal.showValidationMessage('⚠️ Por favor, digite a descrição da tarefa');
        return false;
      }
      
      return { text: text.trim(), category };
    }
  });

  if (result.isConfirmed) {
    return result.value;
  }
  
  return null;
};
