import { useState } from 'react';
import BookForm from './BookForm';
import IsbnPage from './IsbnPage';


type ViewOpt = 'form' | 'scan' | 'isbn'

const AddBooksPage = () =>{
  const [view, setView] = useState<ViewOpt>('form');

  const Content = () => {
    if ( view == 'form' ) {
      return <BookForm onSubmit={console.log} />
    }
    if (view == 'isbn') {
      return <IsbnPage isbnCallHandler={console.log}/>
    }
    if (view == 'scan') {
      return <h1 color='red'>This area is not yet finished</h1>
    }
  }

  return (
    <div>
      <h2>On this page you can add books to the application.</h2>
      <button onClick={() => setView('form')}>form</button>
      <button onClick={() => setView('isbn')}>isbn</button>
      <button onClick={() => setView('scan')}>scan</button>
      <Content />
    </div>
  )
}

export default AddBooksPage;