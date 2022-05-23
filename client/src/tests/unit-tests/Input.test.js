import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import App from '../../MyApp';
import {InputInfo} from '../../components/InputInfo';
import ReactTestUtils, {act} from 'react-dom/test-utils';
import * as InputExport from '../../components/InputInfo';

describe('Test if start date working', () => {

    const setupGoogleMock = () => {
        window.google ={
            maps:{
                Marker:class{},
                Map:class{ setTilt(){} fitBounds(){}},
                LatLngBounds:class{},
                places:{
                    Autocomplete: class {},
                    AutocompleteService:class{},
                    PlacesServiceStatus: {
                        INVALID_REQUEST: 'INVALID_REQUEST',
                        NOT_FOUND: 'NOT_FOUND',
                        OK: 'OK',
                        OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
                        REQUEST_DENIED: 'REQUEST_DENIED',
                        UNKNOWN_ERROR: 'UNKNOWN_ERROR',
                        ZERO_RESULTS: 'ZERO_RESULTS',
                    },
                    PlacesAutocomplete:{
                        INVALID_REQUEST: 'INVALID_REQUEST',
                        NOT_FOUND: 'NOT_FOUND',
                        OK: 'OK',
                        OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
                        REQUEST_DENIED: 'REQUEST_DENIED',
                        UNKNOWN_ERROR: 'UNKNOWN_ERROR',
                        ZERO_RESULTS: 'ZERO_RESULTS',
                    }
                },
        
                MarkerClusterer:class{},
                Geocoder:class{},
            }
        };
      };
      
      beforeAll(() => {
        setupGoogleMock();
      });

    beforeEach(() => {
        jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk({}))
    })

    afterEach(() => {
        window.fetch.mockRestore()
    })


    global.matchMedia = global.matchMedia || function () {
        return {
            addListener: jest.fn(),
            removeListener: jest.fn(),
        };
    };
      

    const fetchResponseOk = body => 
        Promise.resolve({
            ok: true,
            json: Promise.resolve(body)
        })

    
    const fetchRequest = () =>
        JSON.parse(window.fetch.mock.calls[0][1].body)

    const form = id => document.querySelector(`form[id=${id}]`)
    
    const formAnts = () => screen.getByTestId("formId")

    const input = fieldName => document.querySelector(`input[id=${fieldName}]`)

    const placeholder = text => screen.getByPlaceholderText(`${text}`)

    const labelInput = text => screen.getByLabelText(text)

    const findType = id => input(id).type

    const testToRenderAnInputField = id => {
        test('should render input field for Location', () => {
            render(<InputInfo />)
            expect(input(id)).not.toBeNull()
        })
    }

    const testToRenderAnPlaceHolderField = placeHolderName => {
        test('should have placeholder location', () => {
            render(<InputInfo />)
            expect(placeholder(placeHolderName)).not.toBeNull()
        })
    }
    
    test('should render a form', () => {
        render(<InputInfo />)
        const form = document.querySelector('form[id="form"]')
        expect(form).not.toBeNull()
    })  

    const testTypeOfInput = (id) => {
        test('should be type text', () => {
            render(<InputInfo />)
            expect(findType(id)).toEqual('text')
        })
    }

    const testValueOfInput = (id, valueOf) => {
        test('should test value of input', () => {
            render(<InputInfo />)
            expect(input(id).value).toEqual(valueOf)
        })
    }

    const testLabel = (text) => {
        test('should have label', () => {
            render(<InputInfo />)
            expect(labelInput(text)).not.toBeNull()
        })
    }

    const testIdLabel = id => {
        test('should return id for labels', () => {
            render(<InputInfo />)
            const labelId = document.querySelector(`label[id=${id}]`)
            expect(labelId).not.toBeNull()
        })
        
    }

    test('should have a Input', () => {
        render(<InputInfo />)
        const Input = document.querySelector('header[id="formContainer"]')
        expect(Input).not.toBeNull()
    })
    
    
    test("Date picker", () => {
        const { getByTestId } = render(<InputInfo />);
    
        const datePicker = getByTestId("start-date-picker");
        fireEvent.click(datePicker);
        fireEvent.change(datePicker, { target: { value: "29 April, 2022" } });
        expect(datePicker.value).toBe("29 April, 2022");
    });

    test("Date picker", () => {
        const { getByTestId } = render(<InputInfo />);
    
        const datePicker = getByTestId("end-date-picker");
        fireEvent.click(datePicker);
        fireEvent.change(datePicker, { target: { value: "07 May, 2022" } });
        expect(datePicker.value).toBe("07 May, 2022");
    });

    test('should render a Date Picker', () => {
        render(<InputInfo />)
        const datePickerInput = input('startDateId')
        expect(datePickerInput).not.toBeNull()
    })


    describe('form location input field', () => {
        testToRenderAnInputField('location')
        testToRenderAnPlaceHolderField('Location')
        testTypeOfInput('location')
        testValueOfInput('location', '')
    })

    describe('start date input field', () => {
        testToRenderAnPlaceHolderField('Start date')
    })
    
    describe('end date input field', () => {
        testToRenderAnPlaceHolderField('End date')
    })
    




    // test('should submit location', async () => {
    //     render(<Input/>)



    //     await fireEvent.submit(screen.getByText("Submit"))

    //     expect(window.fetch).toHaveBeenCalledWith(
    //         '/customer',
    //         expect.objectContaining({
    //             method: 'POST',
    //             credentials: 'same-origin',
    //             headers: {'Content-type': 'application/json'}
    //         })
    //     )
    // })


    // test.only('should submit value', async () => {
    //     render(<InputInfo />)
    //     const locationInput = screen.getByTestId('locationId')
    //     const startDatePicker = screen.getByTestId("start-date-picker");
    //     const endDatePicker = screen.getByTestId("end-date-picker");

    //     fireEvent.click(locationInput)
    //     fireEvent.change(locationInput, {target: {value: 'Toronto'}})
    //     fireEvent.click(startDatePicker);
    //     fireEvent.change(startDatePicker, {target: {value: "22 May, 2022"}})
    //     fireEvent.click(endDatePicker)
    //     fireEvent.change(endDatePicker, {target: {value: "26 June, 2022"}})
        
    //     fireEvent.submit(screen.getByText("Submit"))
    //     console.log(window.fetch.mock.calls)
    //     await waitFor(() => {
    //         expect(fetchRequest()).toMatchObject({
    //             location: "Toronto",
    //             startDate: "2022-05-19T12:40:31.484Z",
    //             enDate: "2022-06-16 06:36:42",
    //         })
    //     })
    // })
})