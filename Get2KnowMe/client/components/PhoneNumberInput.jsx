// client/components/PhoneNumberInput.jsx
import React from 'react';
import PhoneInput from 'react-phone-number-input';
import { Form } from 'react-bootstrap';
import 'react-phone-number-input/style.css';
import '../styles/PhoneNumberInput.css';

const PhoneNumberInput = ({ 
  value, 
  onChange, 
  error, 
  label = "Phone Number", 
  required = false,
  placeholder = "Enter phone number",
  className = "",
  ...props 
}) => {
  return (
    <Form.Group className={`mb-3 ${className}`}>
      <Form.Label>
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </Form.Label>
      <PhoneInput
        international
        countryCallingCodeEditable={false}
        country={props.country || undefined} // Use controlled country prop, do not default
        defaultCountry={'GB'} // Remove defaultCountry to avoid US default
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`phone-input ${error ? 'is-invalid' : ''}`}
        numberInputProps={{
          className: `form-control ${error ? 'is-invalid' : ''}`,
        }}
        onCountryChange={props.onCountryChange}
        {...props}
      />
      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
      <Form.Text className="text-muted">
        Include country code for international numbers
      </Form.Text>
    </Form.Group>
  );
};

export default PhoneNumberInput;
