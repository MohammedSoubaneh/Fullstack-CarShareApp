import { render } from '@testing-library/react'
import {MyApp} from '../../MyApp'
import * as InputExport from '../../components/InputInfo'
import * as CarFilterExport from '../../components/CarFilter'
import * as HeaderExport from '../../components/Header';


describe.only('MyApp', () => {
    beforeEach(() => {
        jest.spyOn(InputExport, 'InputInfo').mockReturnValue(null)
        jest.spyOn(CarFilterExport, 'CarFilter').mockReturnValue(null)
        jest.spyOn(HeaderExport, 'Header').mockReturnValue(null)
    })      
    test('should have Input component rendered', () => {
        render(<MyApp />)
        expect(InputExport.InputInfo).toHaveBeenCalled()
    })

    test('should have CarFilter component rendered', () => {
        render(<MyApp />)
        expect(CarFilterExport.CarFilter).toHaveBeenCalled()
    })
    
    test('should have Header component rendered', () => {
        render(<MyApp />)
        expect(HeaderExport.Header).toHaveBeenCalled()
    })
})
