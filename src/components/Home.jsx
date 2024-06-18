import { useState, useCallback, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "./Dialog";
import DialogList from "./DialogList";
import { AuthContext } from "./AuthContext";

const Home = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const [dialogs, setDialogs] = useState([
    {
      id: "1",
      title: "Php",
      messages: [
        { content: "syntaxe", role: "user" },
        { content: "$var", role: "assistant" },
      ],
    },
    { id: "2", title: "python", messages: [
			{content: "syntaxe", role: "user"},
			{content: " var", role: "assistant"},
		] },
  ]);
  const [activeDialogId, setActiveDialogId] = useState("1");

  const handleSend = useCallback(
    (message) => {
      setDialogs((prevDialogs) => {
        const newDialogs = prevDialogs.map((dialog) =>
          dialog.id === activeDialogId
            ? {
                ...dialog,
                messages: [
                  ...(dialog.messages || []),
                  { content: message, role: "user" },
                ],
              }
            : dialog
        );
        return newDialogs;
      });
    },
    [activeDialogId]
  );

  const handleSelectDialog = (id) => {
    setActiveDialogId(id);
    console.log("Selected dialog id:", id); // Log the selected dialog id
  };

  const handleDeleteMessagePair = (messageIndex) => {
    setDialogs((prevDialogs) => {
      const newDialogs = prevDialogs.map((dialog) =>
        dialog.id === activeDialogId
          ? {
              ...dialog,
              messages: (dialog.messages || []).filter(
                (_, i) => i !== messageIndex && i !== messageIndex + 1
              ),
            }
          : dialog
      );
      return newDialogs;
    });
  };

  const handleResetDialog = () => {
    setDialogs((prevDialogs) => {
      const newDialogs = prevDialogs.map((dialog) =>
        dialog.id === activeDialogId ? { ...dialog, messages: [] } : dialog
      );
      return newDialogs;
    });
  };

  const activeDialog =
    dialogs.find((dialog) => dialog.id === activeDialogId) || {};

  return (
    <div className="homePage">
      <h1>Welcome to the Conversations App</h1>
      <div className="chatPage">
        <div className="dialogList">
          <DialogList
            dialogs={dialogs}
            setDialogs={setDialogs}
            onSelect={handleSelectDialog}
          />
        </div>
        <div className="messenger">
          <Dialog
            id={activeDialogId}
            messages={
              Array.isArray(activeDialog.messages) ? activeDialog.messages : []
            }
            onDelete={handleDeleteMessagePair}
            onReset={handleResetDialog}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
