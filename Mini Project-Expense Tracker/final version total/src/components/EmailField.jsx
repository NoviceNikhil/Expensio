// EmailField.jsx (new file)
import React from 'react';
import { MdEmail } from "react-icons/md";

const EmailField = React.memo(({ value, onChange }) => {
  return (
    <div className="input-group">
      <input
        type="email"
        value={value}
        onChange={onChange}
        placeholder=" "
        required
      />
      <label>Email</label>
      <MdEmail className="toggle-icon" tabIndex={0} />
    </div>
  );
});
EmailField.displayName = 'EmailField';
export default EmailField;
