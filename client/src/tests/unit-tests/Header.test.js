import { fireEvent, getByRole, render, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import {Header} from '../../components/Header'
import {BrowserRouter as Router} from 'react-router-dom'


describe('Header', () => {

    const buttons = [
        'Register',
        'Login'
    ]
    
    test.each(buttons)('should render a login and register button', (buttonName) => {
        const {getByRole} = render(
        <Router>
            <Header />
        </Router>
        )
        const button = getByRole('button', {name: `${buttonName}`})
        expect(button).not.toBeNull()
    })
    
})