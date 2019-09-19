import { describe } from 'riteway';
import render from 'riteway/render-component';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Hello from './Hello';
describe('Hello component', async assert => {
    const userName = 'Spiderman';
    const $ = render(<Hello userName={userName} />);
    assert({
        given: 'a username',
        should: 'Render a greeting to the correct username.',
        actual: $('.greeting')
            .html()
            .trim(),
        expected: `Hello, ${userName}!`
    });
});

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <MemoryRouter>
            <Hello />
        </MemoryRouter>, div);
});
