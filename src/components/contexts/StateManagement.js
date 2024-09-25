import React, { createContext, useReducer, useContext } from 'react';

const DataContext = createContext();

const initialState = { count: 0 };

const reducer = (state, action) => {
    switch (action.type) {
        case 'change city':
            fetch('https://localhost:8080/places', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  City: action.city
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response: ' + response.statusText);
                }
                return { ...action.payload}
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        default:
            return state;
    }
};

export const DataProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <DataContext.Provider value={{ state, dispatch }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
