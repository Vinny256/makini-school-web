import React, { useState } from 'react';

const RegistrationForm = ({ setSubmittedName }) => {
  const [nameInput, setNameInput] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setSubmittedName(nameInput);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="registration-form" className="py-24 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-3xl mx-auto px-4">
        <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-700 p-10 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Student Registration</h2>
          <input 
            type="text" 
            placeholder="Enter Student Full Name" 
            className="w-full p-4 rounded-xl border dark:bg-slate-600 dark:text-white mb-4"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold">
            Submit & Personalize Letter
          </button>
        </form>
      </div>
    </section>
  );
};
export default RegistrationForm;