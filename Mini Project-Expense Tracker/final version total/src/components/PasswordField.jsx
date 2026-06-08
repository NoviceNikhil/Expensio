// PasswordField.jsx (new file)
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordField = React.memo(
  ({ value, onChange, showPassword, onToggle, error }) => {
    return (
      <div className="input-group password-group">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
        />
        <label>Password</label>
        {showPassword ? (
          <FaEyeSlash
            className="toggle-icon"
            onClick={onToggle}
            role="button"
            tabIndex={0}
            aria-label="Hide password"
          />
        ) : (
          <FaEye
            className="toggle-icon"
            onClick={onToggle}
            role="button"
            tabIndex={0}
            aria-label="Show password"
          />
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  },
);
PasswordField.displayName = "PasswordField";
export default PasswordField;
