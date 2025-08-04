// client/components/PhoneNumberInput.jsx
import React from 'react';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
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
  // Check if the current phone number is valid for the selected country
  const isPhoneValid = !value || !value.trim() || isValidPhoneNumber(value);
  const showValidationError = value && value.trim() && !isPhoneValid;

  return (
    <Form.Group className={`mb-3 ${className}`}>
      <Form.Label>
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </Form.Label>
            <PhoneInput
        countryCallingCodeEditable={false}
        defaultCountry={props.country || "GB"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`phone-input ${error || showValidationError ? 'is-invalid' : ''}`}
        numberInputProps={{
          className: `form-control ${error || showValidationError ? 'is-invalid' : ''}`,
        }}
        onCountryChange={props.onCountryChange}
        {...props}
      />
      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
      {!error && showValidationError && (
        <div className="invalid-feedback d-block">
          Enter A Valid Phone Number
        </div>
      )}
      <Form.Text className="text-muted">
        Select Your Country Code Before Entering The Phone Number
      </Form.Text>
    </Form.Group>
  );
};

export default PhoneNumberInput;
