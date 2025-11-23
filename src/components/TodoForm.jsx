import {useState, useEffect} from "react";

const TodoForm = ({addTodo, editingTodo = null}) => {

    const [value, setValue] = useState(""); 
    const [category, setCategory] = useState("");
    const MAX_CHARS = 100;

    useEffect(() => {
        if (editingTodo) {
            setValue(editingTodo.text);
            setCategory(editingTodo.category);
        } else {
            setValue("");
            setCategory("");
        }
    }, [editingTodo]);

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(!value || !category) return
        addTodo(value, category)
        setValue("");
        setCategory("");   

    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        if (newValue.length <= MAX_CHARS) {
            setValue(newValue);
        }
    };

    const getCounterClass = () => {
        const percentage = (value.length / MAX_CHARS) * 100;
        if (percentage >= 90) return 'danger';
        if (percentage >= 80) return 'warning';
        return '';
    };
    
  return <div className='todo-form'>
   <h2>{editingTodo ? 'Editar Tarefa' : 'Criar Tarefa'}</h2>
   <form onSubmit={handleSubmit}>
    <div className="input-group">
      <input 
        type="text" 
        placeholder='Digite o Título' 
        value={value} 
        onChange={handleInputChange}
        maxLength={MAX_CHARS}
      />
      <div className={`char-counter ${getCounterClass()}`}>
        {value.length}/{MAX_CHARS}
      </div>
    </div>
    <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Selecione uma categoria</option>
        <option value="Pendente">Pendente</option>
        <option value="Progresso">Progresso</option>
    </select>
    <button type="submit">{editingTodo ? 'Salvar Alterações' : 'Criar Tarefa'}</button>
   </form>
  </div>
}

export default TodoForm