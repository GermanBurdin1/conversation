import { useState, useEffect } from 'react';

export default function DialogList({ dialogs, setDialogs, onSelect }) {
  const [newDialogTitle, setNewDialogTitle] = useState('');
  const [isCreatingDialog, setIsCreatingDialog] = useState(false);
  const [editingDialogId, setEditingDialogId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    console.log('Fetching conversations'); 

    async function fetchConversations() {
      try {
        const response = await fetch('http://localhost:5001/conversations');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched conversations:', data); 
          setDialogs(data);
        } else {
          console.error('Failed to fetch conversations:', response.status);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error); 
      }
    }
    fetchConversations();
  }, [setDialogs]);

  const handleInputChange = (e) => {
    setNewDialogTitle(e.target.value);
  };

  const handleCreateDialog = async () => {
    if (newDialogTitle.trim() !== "") {
      console.log('Creating new dialog:', newDialogTitle);

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

  const handleDeleteDialog = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/conversations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDialogs((prevDialogs) => prevDialogs.filter(dialog => dialog.id !== id));
      } else {
        alert('Failed to delete conversation');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleEditDialogTitle = async (id, newTitle) => {
    if (newTitle.trim() === "") {
      alert("Dialog title cannot be empty");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5001/conversations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
      });

      if (response.ok) {
        setDialogs((prevDialogs) => prevDialogs.map(dialog => 
          dialog.id === id ? { ...dialog, title: newTitle } : dialog
        ));
        setEditingDialogId(null);
      } else {
        alert('Failed to edit conversation title');
      }
    } catch (error) {
      console.error('Error editing conversation title:', error);
    }
  };

  const handleEditClick = (id, title) => {
    setEditingDialogId(id);
    setEditedTitle(title);
  };

  const handleCancelEdit = () => {
    setEditingDialogId(null);
    setEditedTitle('');
  };

  const handleSaveEdit = (id) => {
    handleEditDialogTitle(id, editedTitle);
  };

  return (
    <div className="dialogList">
      <a href="/">Home</a>
      {dialogs.map((dialog, index) => {
        console.log('Generating link for dialog:', dialog.id); // Лог ID диалога
        return (
          <div key={dialog.id} onClick={() => onSelect(dialog.id)}>
            {editingDialogId === dialog.id ? (
              <>
                <input 
                  type="text" 
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleSaveEdit(dialog.id);
                }}>Sauvegarder les changements</button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleCancelEdit();
                }}>Annuler</button>
              </>
            ) : (
              <>
                <span>{dialog.title}</span>
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(dialog.id, dialog.title);
                }}>Modifier</button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDialog(dialog.id);
                }}>Delete</button>
              </>
            )}
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
