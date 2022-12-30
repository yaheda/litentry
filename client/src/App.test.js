import { render, screen } from '@testing-library/react';
import App from './App';

test('Renders <App /> component correctly', () => {
  render(<App />);
  const element = screen.getByText(/Litentry Fullstack Task/i);
  expect(element).toBeInTheDocument();
});
