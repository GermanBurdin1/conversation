// import { useState, useCallback, useEffect } from 'react';
// import Dialog from './components/Dialog';
// import DialogList from './components/DialogList';
// import InputMessage from './components/InputMessage';
// import "./assets/App.css";

// function App() {
//   const [dialogs, setDialogs] = useState([
//     { title: "Php", messages: [{ value: "hello?", type: "question" }, { value: "world", type: "answer" }] },
//     { title: "python", messages: [] }
//   ]);
//   const [activeDialogIndex, setActiveDialogIndex] = useState(0);

//   const handleSend = useCallback((message) => {
//     setDialogs((prevDialogs) => {
//       const newDialogs = [...prevDialogs];
//       newDialogs[activeDialogIndex] = {
//         ...newDialogs[activeDialogIndex],
//         messages: [...newDialogs[activeDialogIndex].messages, { value: message, type: "text" }]
//       };
//       return newDialogs;
//     });
//   }, [activeDialogIndex]);

//   useEffect(() => {
//     console.log('Dialogs:', dialogs);
//     console.log('Active Dialog Index:', activeDialogIndex);
//   }, [dialogs, activeDialogIndex]);

//   const handleSelectDialog = (index) => {
//     setActiveDialogIndex(index);
//   };

//   const handleDeleteMessage = (messageIndex) => {
//     setDialogs((prevDialogs) => {
//       const newDialogs = [...prevDialogs];
//       newDialogs[activeDialogIndex] = {
//         ...newDialogs[activeDialogIndex],
//         messages: newDialogs[activeDialogIndex].messages.filter((_, i) => i !== messageIndex)
//       };
//       return newDialogs;
//     });
//   };

//   const handleCreateDialog = (title) => {
//     if (title.trim() === "") {
//       alert("Dialog title cannot be empty");
//       return;
//     }
//     setDialogs((prevDialogs) => {
//       const newDialogs = [...prevDialogs, { title, messages: [] }];
//       setActiveDialogIndex(newDialogs.length - 1); // Устанавливаем новый диалог активным
//       return newDialogs;
//     });
//   };

//   const handleResetDialog = () => {
//     setDialogs((prevDialogs) => {
//       const newDialogs = [...prevDialogs];
//       newDialogs[activeDialogIndex] = {
//         ...newDialogs[activeDialogIndex],
//         messages: []
//       };
//       return newDialogs;
//     });
//   };

//   return (
//     <div className="chatPage">
//       <div className="dialogList">
//         <DialogList dialogs={dialogs} onSelect={handleSelectDialog} onCreateDialog={handleCreateDialog} />
//       </div>
//       <div className="messenger">
//         <Dialog messages={dialogs[activeDialogIndex].messages} onDelete={handleDeleteMessage} onReset={handleResetDialog} />
//         <InputMessage onSend={handleSend} />
//       </div>
//     </div>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Dialog from './components/Dialog';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthProvider } from './components/AuthContext';
import "./assets/App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/conversations/:id" element={<Dialog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
