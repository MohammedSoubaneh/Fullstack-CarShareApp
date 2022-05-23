import {render} from '@testing-library/react'
import {CarFilter} from '../../components/CarFilter'

describe('CarFilter', () => {

    const carId = (element, id) => document.querySelector(`${element}[id=${id}]`)



    // test('should have a filterContainer div', () => {
    //     render(<CarFilter />)
    //     const container = document.querySelector('div[id="outerContainer"]')
    //     expect(container).not.toBeNull()
    // })
    

    test('should have a container div', () => {
        render(<CarFilter />)
        const container = document.querySelector('div[id="filterContainer"]')
        expect(container).not.toBeNull();
    })


    const checkIfNull = (element, id) => {
        test('should render not Null', () => {
            render(<CarFilter />)
            expect(carId(element, id)).not.toBeNull()
        })
    }
    
    const checkCarText = (element, id, value) => {
        test('should render correct text', () => {
            render(<CarFilter />)
            expect(carId(element, id).textContent).toEqual(value)
        })
    }

    const checkClassName = (element, id, value) => {
        test('should render a class name', () => {
            render(<CarFilter />)
            expect(carId(element, id)).toHaveClass(value)
        })
        
    }
    
    
    describe('car image', () => {
        checkIfNull('img', 'carImage')
        test('should have img with a honda', () => {
            render(<CarFilter />)
            expect(carId('img', 'carImage').src).toContain('https://i.ibb.co/VB6n6sZ/harrison-fitts-z-E2-VGb-JSYns-unsplash.jpg')
        })
        test('should have 100% width and height', () => {
            render(<CarFilter />)
            expect(carId('img', 'carImage')).toHaveAttribute('width', '100%')
        })
        checkClassName('img', 'carImage', 'displayCar')
        test('should display toyota car image', () => {
            render(<CarFilter />)
            const toyotaImage = document.querySelectorAll('.displayCar')[1]
            expect(toyotaImage.src).toContain('https://i.ibb.co/ZKKDYrX/dusty-barnes-o7fq-Z18-YFXc-unsplash.jpg')
        })
    })

    describe('car name', () => {
        checkIfNull('span', 'carName')
        checkCarText('span', 'carName', 'Honda Civic 2019')
        checkClassName('span', 'carName', 'displayName')
        
    })

    describe('car rating', () => {
        checkIfNull('span', 'carRating')
        checkCarText('span', 'carRating', '5.0')
        checkClassName('span', 'carRating', 'displayRating')
    })

    describe('car trips', () => {
        checkIfNull('span', 'carTrips')
        checkCarText('span', 'carTrips', '(10 Trips)')
        checkClassName('span', 'carTrips', 'displayTrips')
    })
    

    describe('safet check', () => {
        checkIfNull('span', 'carSafety')
        checkCarText('span', 'carSafety', 'Safety check')
        checkClassName('span', 'carSafety', 'displaySafety')
    })
    
    describe('Free Delivery', () => {
        checkIfNull('span', 'carDelivery')
        checkCarText('span', 'carDelivery', 'Free delivery')
        checkClassName('span', 'carDelivery', 'displayDelivery')
    })
    

})
