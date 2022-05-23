import { render } from '@testing-library/react'
import {Home} from '../../components/Home'
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
        render(<Home />)
        expect(InputExport.InputInfo).toHaveBeenCalled()
    })

    test('should have CarFilter component rendered', () => {
        render(<Home />)
        expect(CarFilterExport.CarFilter).toHaveBeenCalled()
    })
    
    test('should have Header component rendered', () => {
        render(<Home />)
        expect(HeaderExport.Header).toHaveBeenCalled()
    })
})
