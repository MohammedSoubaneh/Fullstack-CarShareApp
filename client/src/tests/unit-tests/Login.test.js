import { fireEvent, render, waitFor } from "@testing-library/react";
import {Login, Error} from '../../components/Login'
import {BrowserRouter as Router} from 'react-router-dom'

import '@testing-library/jest-dom'


global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };
  

describe('Login Form', () => {

    beforeEach(() => {
        jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk({}))
        jest.spyOn(window.localStorage.__proto__, 'setItem');
    })
    
    afterEach(() => {
        window.fetch.mockRestore()
        localStorage.setItem.mockRestore()
    })

    const fetchResponseOk = body => 
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(body)
    })


    const fetchRequest = () => JSON.parse(window.fetch.mock.calls[0][1].body)

    test('should render a form', () => {
        const {getByRole} = render(
            <Router>
                <Login/>
            </Router>
        )  
        const form = getByRole('form')
        expect(form).not.toBeNull()      
    })
    test('should render a for with className', () => {
        const {getByRole} = render(
            <Router>
                <Login/>
            </Router>
        )
        const form = getByRole('form')
        expect(form).toHaveClass('login-form')
    })
    

    // test('should render a name attribute in form', () => {
    //     const {getByRole} = render(<Login />)
    //     const form = getByRole('form')
    //     expect(form.hasAttribute('name')).toBeTruthy()
    // })


    const formItems = [
        'username-formItem',
        'password-formItem',
        'submit-formItem'
    ]

    const inputFields = [
        'username-field',
        'password-field'
    ]

    const placeholderNames = [
        'Username',
        'Password'
    ]

    test.each(formItems)('should test if each form item exists',(name) => {
        const {getByTestId} = render(
            <Router>
                <Login/>
            </Router>
        )
        const formItem = getByTestId(name)
        expect(formItem).not.toBeNull()
    })

    test.each(inputFields)('should render input fields for user login', (fieldNames) => {
        const {getByTestId} = render(
            <Router>
                <Login/>
            </Router>
        )
        const input = getByTestId(fieldNames)
        expect(input).not.toBeNull()
    })

    test.each(placeholderNames)('should render placeholder text for each login field', (placeholderName) => {
        const {getByPlaceholderText} = render(
            <Router>
                <Login/>
            </Router>
        )
        const input = getByPlaceholderText(placeholderName)
        expect(input).not.toBeNull()        
    })    

    test('should render a submit button', () => {
        const {getByRole} = render(
            <Router>
                <Login/>
            </Router>
        )
        const button = getByRole('submit')
        expect(button).not.toBeNull()
    })

    test('should submit Login value', async () => {
        const {getByTestId, getByText} = render(
            <Router>
                <Login/>
            </Router>
        )
        const username = getByTestId('username-field')
        const password = getByTestId('password-field')
        const submit = getByText('Login')
        fireEvent.click(username)
        fireEvent.change(username, {target: {value: 'JohnDoe'}})
        fireEvent.click(password)
        fireEvent.change(password, {target: {value: 'password!123'}})
        fireEvent.submit(getByText("Login"))
        await waitFor(() => {
            expect(window.fetch).toHaveBeenCalledWith(
                "http://127.0.0.1:8000/api/token/",
                expect.objectContaining({
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {'Content-type': 'application/json'}
                })
            )
            expect(fetchRequest()).toMatchObject({
                'username': 'JohnDoe',
                'password': 'password!123'
            })
        })
    })

    test('should catch an error when login is submitted', async () => {
        window.fetch.mockReturnValue(Promise.resolve({ ok: false }))

        const {getByTestId, getByText, container } = render(
            <Router>
                <Login/>
            </Router>
            )

        const username = getByTestId('username-field')
        const password = getByTestId('password-field')
        fireEvent.click(username)
        fireEvent.change(username, {target: {value: 'JohnDoe'}})
        fireEvent.click(password)
        fireEvent.change(password, {target: {value: 'password!123'}})
        fireEvent.submit(getByText("Login"))

        await waitFor(() => {
            const errorElement = container.querySelector('.ant-alert')
            expect(errorElement).not.toBeNull()
            expect(errorElement.textContent).toEqual('User doesn\'t exist.')
        })
    })

    test('should set token in local storage', async () => {
        const {getByTestId, getByText} = render(
            <Router>
                <Login/>
            </Router>
        )
        const username = getByTestId('username-field')
        const password = getByTestId('password-field')
        const submit = getByText('Login')
        fireEvent.click(username)
        fireEvent.change(username, {target: {value: 'JohnDoe'}})
        fireEvent.click(password)
        fireEvent.change(password, {target: {value: 'password!123'}})
        fireEvent.submit(getByText("Login"))
        await waitFor(() => {
            expect(localStorage.setItem).toHaveBeenCalled()
        })
    })
    
})
