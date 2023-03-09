// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocaleStorageState = (key, initialValue = '', {
  serialize = JSON.stringify,
  deserialize = JSON.parse,
} = {}) => {
  const [value, setValue] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);

    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    } else {
      // if ma valeur initiale est une fonction je veux pouvoir l'exécuter au sein de la fonction anonyme sans quelle soit trigger à chaque rendu
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  })

  React.useEffect(() => {
    const preparedValue = serialize(value);
    window.localStorage.setItem(key, preparedValue);
    // on doit déclarer dans le tableau des dépendances toutes les variables dans le scope du useEffect qui peuvent changer
  }, [key, value, serialize])

  return [value, setValue]
}

function Greeting() {
  const [name, setName] = useLocaleStorageState('name', 'Prudence');
  const [age, setAge] = useLocaleStorageState('age', 1);
  
  function handleChangeName(event) {
    setName(event.target.value)
  }

  function handleChangeSurname(event) {
    setAge(event.target.value)
  }
  
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChangeName} id="name" />
        <label htmlFor="age">Age: </label>
        <input value={age} onChange={handleChangeSurname} id="age" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
      {age ? <strong>Your age is {age}</strong> : 'Please type your age'}
    </div>
  )
}

function App() {
  const [initialName, setInitialName] = React.useState('Pru');
  const handleClickName = () => {
    setInitialName(previousValue => `${previousValue}u`)
  }

  return (<>
    <button onClick={handleClickName}>{initialName}</button>
    <Greeting initialName={initialName} />
  </>)
}

export default App
