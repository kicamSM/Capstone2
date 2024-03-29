import { render, screen, cleanup } from '@testing-library/react';
import BoutForm from './BoutForm';
import { BrowserRouter } from "react-router-dom";
import '../setupTests.js';

// * Passing as of 2/13/24
// npm test BoutForm.test.js
// must be in frontend directory 

afterEach(() => {
    cleanup()
  })
  
describe("checks rendering of bout form", () => {  

    test('renders bout form page', () => {

    render(
        <BrowserRouter>
                <BoutForm />
        </BrowserRouter>);
    });


    test('matches snapshot', function() {
    const { asFragment } = render(
        <BrowserRouter>
                <BoutForm />
        </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot(); 
    })

});

describe("asserts bout form text", () => {  

    test('renders bout form page', () => {

    render(
        <BrowserRouter>
                <BoutForm />
        </BrowserRouter>
    )

        const text = screen.getByText('Create a Bout');
        expect(text).toBeInTheDocument();
    });

});