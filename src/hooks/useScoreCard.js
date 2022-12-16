import { createContext, useContext, useState } from 'react';

const ADD_MESSAGE_COLOR = '#3d84b8';
const REGULAR_MESSAGE_COLOR = '#2b2e4a';
const ERROR_MESSAGE_COLOR = '#fb3640';

const ScoreCardContext = createContext({
  messagesAdd: [],
  messagesQuery: [],

  addCardMessage: () => {},
  addRegularMessage: () => {},
  clearMessage: () => {},
  addErrorMessage: () => {},
});

const makeMessage = (message, color) => {
  return { message, color };
};

const ScoreCardProvider = (props) => {
  const [messagesAdd, setMessagesAdd] = useState([]);
  const [messagesQuery, setMessagesQuery] = useState([]);

  const addCardMessage = (message, tableContent) => {
    console.log('msg:', message);
    setMessagesAdd([...messagesAdd, makeMessage(message, ADD_MESSAGE_COLOR), makeMessage(tableContent, ADD_MESSAGE_COLOR)]);
  };

  const addRegularMessage = (ms) => {
    setMessagesQuery([
      ...messagesQuery,
      makeMessage(ms, REGULAR_MESSAGE_COLOR),
    ]);
  };

  const clearMessage = (message) => {
    console.log('clear');
    setMessagesAdd([makeMessage(message, REGULAR_MESSAGE_COLOR)]);
    setMessagesQuery([makeMessage(message, REGULAR_MESSAGE_COLOR)]);
  };

  const addErrorMessage = (tab, message) => {
    if (tab === 'add') {
      setMessagesAdd([...messagesAdd, makeMessage(message, ERROR_MESSAGE_COLOR)]);
    } else {
      setMessagesQuery([...messagesQuery, makeMessage(message, ERROR_MESSAGE_COLOR)]);
    }

  };

  return (
    <ScoreCardContext.Provider
      value={{
        messagesAdd,
        messagesQuery,
        addCardMessage,
        addRegularMessage,
        clearMessage,
        addErrorMessage,
      }}
      {...props}
    />
  );
};

function useScoreCard() {
  return useContext(ScoreCardContext);
}

export { ScoreCardProvider, useScoreCard };
