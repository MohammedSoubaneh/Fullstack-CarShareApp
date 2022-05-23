import React, {useState, Component} from 'react'
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import {Form, Input, DatePicker, Space, Button} from 'antd'
import moment from 'moment';
import 'antd/dist/antd.css';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';



export const InputInfo = () => {


    const [location, setLocation] = useState('')
    const [dateStart, setDateStart] = useState(moment())
    const [dateEnd, setDateEnd] = useState()

    const handleChange = (event) => {
        setLocation(event)
        
    }


    const onChangeStartDate = (date, dateString) => {
        console.log(date, dateString);
        setDateStart(dateString)
    }
    
    const onChangeEndDate = (date, dateString) => {
        setDateEnd(dateString)
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        };

    const handleSubmit = async () => {
        await window.fetch('/customer', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                startDate: dateStart,
                endDate: dateEnd,
                location: location
            })
        })
    }

    const handleSelect = address => {
        geocodeByAddress(address)
          .then(results => getLatLng(results[0]))
          .then(latLng => console.log('Success', latLng))
          .catch(error => console.error('Error', error));
      };

    const onError = (status, clearSuggestions) => {
        console.log('Google Maps API returned error with status: ', status)
        clearSuggestions()
      }

    console.log(JSON.stringify({
        startDate: dateStart,
        endDate: dateEnd,
        location: location
    }))
    

    return (
        <header id="formContainer">
            <PlacesAutocomplete
                value={location}
                onChange={handleChange}
                onSelect={handleSelect}
                onError={onError}
                >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                    <input data-testid="locationId" id="location" type='text'
                    {...getInputProps({
                        placeholder: 'Location',
                        className: 'location-search-input',
                    })}
                    />
                    <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => {
                        const className = suggestion.active
                        ? 'suggestion-item--active'
                        : 'suggestion-item';
                        // inline style for demonstration purpose
                        const style = suggestion.active
                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                        return (
                        <div
                            {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                            })}
                        >
                            <span>{suggestion.description}</span>
                        </div>
                        );
                    })}
                    </div>
                </div>
                )}
            </PlacesAutocomplete>
            <Form
            id='form'
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
            autoComplete="off">
                <Space direction='vertical' size={12}>
                        <DatePicker id='startDateId' value={moment(dateStart).add(3, 'days')} data-testid='start-date-picker' placeholder='Start date' showTime onChange={onChangeStartDate} />
                        <DatePicker value={moment(dateEnd).add(10, 'days')} data-testid='end-date-picker' placeholder='End date' showTime onChange={onChangeEndDate} />
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Space>
            </Form>
        </header>
    )
}