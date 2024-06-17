import { useState, useCallback, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Dialog from './Dialog';
import DialogList from './DialogList';
import { AuthContext } from './AuthContext';

const Home = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const [dialogs, setDialogs] = useState([
    { id: "1", title: "Php", messages: [{ content: "hello?", role: "user" }, { content: "world", role: "assistant" }] },
    { id: "2", title: "python", messages: [] }
  ]);
  const [activeDialogId, setActiveDialogId] = useState("1");

  const handleSend = useCallback((message) => {
    setDialogs((prevDialogs) => {
      const newDialogs = prevDialogs.map(dialog =>
        dialog.id === activeDialogId ? { ...dialog, messages: [...dialog.messages, { content: message, role: "user" }] } : dialog
      );
      return newDialogs;
    });
  }, [activeDialogId]);

  const handleSelectDialog = (id) => {
    setActiveDialogId(id);
    console.log('Selected dialog id:', id); // Лог выбора диалога
  };

  const handleDeleteMessage = (messageIndex) => {
    setDialogs((prevDialogs) => {
      const newDialogs = prevDialogs.map(dialog =>
        dialog.id === activeDialogId ? { ...dialog, messages: dialog.messages.filter((_, i) => i !== messageIndex) } : dialog
      );
      return newDialogs;
    });
  };

  const handleCreateDialog = (title) => {
    if (title.trim() === "") {
      alert("Dialog title cannot be empty");
      return;
    }
    setDialogs((prevDialogs) => {
      const newDialog = { id: (prevDialogs.length + 1).toString(), title, messages: [] };
      const newDialogs = [...prevDialogs, newDialog];
      setActiveDialogId(newDialog.id); // Устанавливаем новый диалог активным
      return newDialogs;
    });
  };

  const handleResetDialog = () => {
    setDialogs((prevDialogs) => {
      const newDialogs = prevDialogs.map(dialog =>
        dialog.id === activeDialogId ? { ...dialog, messages: [] } : dialog
      );
      return newDialogs;
    });
  };

  return (
    <div className="homePage">
      <h1>Welcome to the Conversations App</h1>
      <div className="chatPage">
        <div className="dialogList">
          <DialogList dialogs={dialogs} setDialogs={setDialogs} onSelect={handleSelectDialog} onCreateDialog={handleCreateDialog} />
        </div>
        <div className="messenger">
          <Dialog 
            id={activeDialogId}
            messages={dialogs.find(dialog => dialog.id === activeDialogId)?.messages || []}
            onDelete={handleDeleteMessage}
            onReset={handleResetDialog}
            onSend={handleSend} // Передаем handleSend в компонент Dialog
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
