// UsernameField.jsx (new file)
import React from 'react';
import { FaUser } from "react-icons/fa";

const UsernameField = React.memo(({ value, onChange, error }) => {
  return (
    <div className="input-group">
      <input
        type="text"
        value={value}
        onChange={onChange}
        autoFocus
        required
      />
      <label>Username</label>
      <FaUser className="toggle-icon" tabIndex={0} />
      {error && (
        <div className="error-message">{error}</div>
      )}
    </div>
  );
});
UsernameField.displayName = 'UsernameField';
export default UsernameField;
