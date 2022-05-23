import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {RegistrationForm} from '../../components/Register'
import {BrowserRouter as Router} from 'react-router-dom'


global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };





describe('Register Form', () => {

    beforeEach(() => {
        jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk({}))
        jest.spyOn(window.localStorage.__proto__, 'setItem');
    })
    
    afterEach(() => {
        window.fetch.mockRestore()
    })

    const fetchResponseOk = body => 
    Promise.resolve({
        ok: true,
        json: Promise.resolve(body)
    })
    
    const elementId = [
        'form-field',
        'email-field',
        'username-field',
        'first-name-field',
        'last-name-field',
        'password-field',
        'confirm-password-field'
    ]
    
    const labelText = [
        'E-mail',
        'First Name',
        'Last Name',
        'Username',
        'Password',
        'Confirm Password'
    ]

    const valueText = [
        ['email-field', 'example@example.com'],
        ['first-name-field', 'John'],
        ['last-name-field', 'Doe'],
        ['username-field', 'example-user'],
        ['password-field', 'password12'],
        ['confirm-password-field', 'password12']

    ]

    test.each(elementId)
        (('should check if element is null'),(id) => {
            const {getByTestId} = render(
                <Router>
                    <RegistrationForm />
                </Router>            
            )
            const element = getByTestId(id)
            expect(element).not.toBeNull()
    })  
    
    test.each(labelText)(('should render a label'), (text) => {
        const {getByLabelText} = render(
            <Router>
                <RegistrationForm />
            </Router>            
        )
        const label = getByLabelText(text)
        expect(label).not.toBeNull()
    })

    test.each(valueText)(('should render value'), (id, text) => {
        const {getByTestId} = render(
            <Router>
                <RegistrationForm />
            </Router>            
        )
        const inputField = getByTestId(id).querySelector('input')
        fireEvent.click(inputField)
        fireEvent.change(inputField, {target: { value: `${text}`}})
        expect(inputField.value).toBe(text)
    })

    
    test('should submit on register', async () => {
        const data = {
            data: {
                email: 'example@example.com',
                username: 'username12',
                password: 'password123',
                first_name: 'John',
                last_name: 'Doe'
            }
        }
        const {getByTestId, getByText} = render(
            <Router>
                <RegistrationForm />
            </Router>            
        )
        const emailInputField = getByTestId('email-field').querySelector('input')
        const userInputField = getByTestId('username-field').querySelector('input')
        const passwordInputField = getByTestId('password-field').querySelector('input')
        const confirmPasswordInputField = getByTestId('confirm-password-field').querySelector('input')
        const firstNameputField = getByTestId('first-name-field').querySelector('input')
        const lastNameInputField = getByTestId('last-name-field').querySelector('input')

        fireEvent.click(emailInputField)
        fireEvent.change(emailInputField, {target: {value: 'example@example.com'}})
        fireEvent.click(userInputField)
        fireEvent.change(userInputField, {target: {value: 'username12'}})
        fireEvent.click(passwordInputField)
        fireEvent.change(passwordInputField, {target: {value: 'password1235'}})
        fireEvent.click(confirmPasswordInputField)
        fireEvent.change(confirmPasswordInputField, {target: {value: 'password1235'}})
        fireEvent.click(firstNameputField)
        fireEvent.change(firstNameputField, {target: {value: 'John'}})
        fireEvent.click(lastNameInputField)
        fireEvent.change(lastNameInputField, {target: {value: 'Doe'}})
        fireEvent.submit(getByText("Register"))

        const fetchRequest = () => JSON.parse(window.fetch.mock.calls[0][1].body)
        await waitFor(() => {
            expect(window.fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/api/auth/register/',
                expect.objectContaining({
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {'Content-type': 'application/json'}
                })
            )
            expect(fetchRequest()).toMatchObject({
                "email":"example@example.com",
                "username": "username12",
                "first_name":"John",
                "last_name":"Doe",
                "password":"password1235"
            })
        })
    })

    test('should return an error when user already exists', async () => {

        window.fetch.mockReturnValue(Promise.resolve({ ok: false }))

        const {getByTestId, getByText, container} = render(
            <Router>
                <RegistrationForm />
            </Router>            
        )
        const emailInputField = getByTestId('email-field').querySelector('input')
        const userInputField = getByTestId('username-field').querySelector('input')
        const passwordInputField = getByTestId('password-field').querySelector('input')
        const confirmPasswordInputField = getByTestId('confirm-password-field').querySelector('input')
        const firstNameputField = getByTestId('first-name-field').querySelector('input')
        const lastNameInputField = getByTestId('last-name-field').querySelector('input')

        fireEvent.click(emailInputField)
        fireEvent.change(emailInputField, {target: {value: 'example@example.com'}})
        fireEvent.click(userInputField)
        fireEvent.change(userInputField, {target: {value: 'username12'}})
        fireEvent.click(passwordInputField)
        fireEvent.change(passwordInputField, {target: {value: 'password1235'}})
        fireEvent.click(confirmPasswordInputField)
        fireEvent.change(confirmPasswordInputField, {target: {value: 'password1235'}})
        fireEvent.click(firstNameputField)
        fireEvent.change(firstNameputField, {target: {value: 'John'}})
        fireEvent.click(lastNameInputField)
        fireEvent.change(lastNameInputField, {target: {value: 'Doe'}})
        fireEvent.submit(getByText("Register"))

        await waitFor(() => {
            const errorElement = container.querySelector('.ant-alert')
            expect(errorElement).not.toBeNull()
            expect(errorElement.textContent).toEqual('User already exist.')
        })
    })

    test('should render a Register Title', () => {
        const { getByText} = render(
            <Router>
                <RegistrationForm />
            </Router>            
        )

        const title = getByText('Registration Form')
        expect(title).not.toBeNull()
    })
    
})
