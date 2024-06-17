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
    { title: "Php", messages: [{ value: "hello?", type: "question" }, { value: "world", type: "answer" }] },
    { title: "python", messages: [] }
  ]);
  const [activeDialogIndex, setActiveDialogIndex] = useState(0);

  const handleSend = useCallback((message) => {
    setDialogs((prevDialogs) => {
      const newDialogs = [...prevDialogs];
      newDialogs[activeDialogIndex] = {
        ...newDialogs[activeDialogIndex],
        messages: [...newDialogs[activeDialogIndex].messages, { value: message, type: "text" }]
      };
      return newDialogs;
    });
  }, [activeDialogIndex]);

  const handleSelectDialog = (index) => {
    setActiveDialogIndex(index);
    console.log('Selected dialog index:', index); // Лог выбора диалога
  };

  const handleDeleteMessage = (messageIndex) => {
    setDialogs((prevDialogs) => {
      const newDialogs = [...prevDialogs];
      newDialogs[activeDialogIndex] = {
        ...newDialogs[activeDialogIndex],
        messages: newDialogs[activeDialogIndex].messages.filter((_, i) => i !== messageIndex)
      };
      return newDialogs;
    });
  };

  const handleCreateDialog = (title) => {
    if (title.trim() === "") {
      alert("Dialog title cannot be empty");
      return;
    }
    setDialogs((prevDialogs) => {
      const newDialogs = [...prevDialogs, { title, messages: [] }];
      setActiveDialogIndex(newDialogs.length - 1); // Устанавливаем новый диалог активным
      return newDialogs;
    });
  };

  const handleResetDialog = () => {
    setDialogs((prevDialogs) => {
      const newDialogs = [...prevDialogs];
      newDialogs[activeDialogIndex] = {
        ...newDialogs[activeDialogIndex],
        messages: []
      };
      return newDialogs;
    });
  };

  return (
    <div className="homePage">
      <h1>Welcome to the Conversations App</h1>
      <div className="chatPage">
        <div className="dialogList">
          <DialogList dialogs={dialogs} onSelect={handleSelectDialog} onCreateDialog={handleCreateDialog} />
        </div>
        <div className="messenger">
          <Dialog 
            messages={dialogs[activeDialogIndex].messages} 
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

