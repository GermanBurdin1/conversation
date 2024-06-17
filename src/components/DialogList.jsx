import { useState, useEffect } from 'react';

export default function DialogList({ dialogs, setDialogs, onSelect, onCreateDialog }) {
  const [newDialogTitle, setNewDialogTitle] = useState('');
  const [isCreatingDialog, setIsCreatingDialog] = useState(false);

  useEffect(() => {
    console.log('Fetching conversations'); // Лог начала запроса

    async function fetchConversations() {
      try {
        const response = await fetch('http://localhost:5001/conversations');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched conversations:', data); // Лог успешного получения данных
          setDialogs(data);
        } else {
          console.error('Failed to fetch conversations:', response.status);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error); // Лог ошибок
      }
    }
    fetchConversations();
  }, [setDialogs]);

  const handleInputChange = (e) => {
    setNewDialogTitle(e.target.value);
  };

  const handleCreateDialog = async () => {
    if (newDialogTitle.trim() !== "") {
      console.log('Creating new dialog:', newDialogTitle); // Лог создания нового диалога

      try {
        const response = await fetch('http://localhost:5001/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: newDialogTitle })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Created new dialog:', data); // Лог успешного создания
          setDialogs([...dialogs, data]);
          setNewDialogTitle('');
          setIsCreatingDialog(false);
        } else {
          alert('Failed to create conversation');
        }
      } catch (error) {
        console.error('Error creating conversation:', error); // Лог ошибок
      }
    } else {
      alert("Dialog title cannot be empty");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateDialog();
    }
  };

  return (
    <div className="dialogList">
      <a href="/">Home</a>
      {dialogs.map((dialog, index) => {
        console.log('Generating link for dialog:', dialog.id); // Лог ID диалога
        return (
          <div key={dialog.id} onClick={() => onSelect(dialog.id)}>
            {dialog.title}
          </div>
        );
      })}
      {isCreatingDialog ? (
        <div>
          <input
            type="text"
            value={newDialogTitle}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter dialog title"
          />
          <button onClick={handleCreateDialog}>Create New Dialog</button>
        </div>
      ) : (
        <button onClick={() => setIsCreatingDialog(true)}>New Dialog</button>
      )}
    </div>
  );
}
