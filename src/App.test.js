import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});









// const [quotes, setQuotes] = useState([]);
//   const [author, setAuthor] = useState('');
//   const [text, setText] = useState('');

//   useEffect(() => {
//     axios.get('http://localhost:5000/quotes')
//       .then(res => setQuotes(res.data));
//   }, []);

//   const addQuote = () => {
//     axios.post('http://localhost:5000/quotes', { author, text })
//       .then(res => {
//         setQuotes([...quotes, res.data]);
//         setAuthor('');
//         setText('');
//       });
//   };

//   const deleteQuote = (id) => {
//     axios.delete(`http://localhost:5000/quotes/${id}`)
//       .then(() => {
//         setQuotes(quotes.filter(q => q._id !== id));
//       });
//   };
