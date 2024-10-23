// Dimensions.tsx
"use client"
import React, { useState, useRef } from 'react';
import './Dimensions.css';

const Dimensions: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName === activeButton ? null : buttonName);
  };
  const selectRef = useRef<HTMLSelectElement>(null);

  //Account Type form data
  const handleSubmitAccounts = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const account_type = formData.get('accountType') as string;
    const account_name = formData.get('accountName') as string;
    console.log({
      accountType: account_type,
      accountName: account_name,
    });

    const data = {
      account_type: account_type,
      account_name: account_name,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/admintransactionprocessingapi/DupayAccounts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit accounts');
      }
      // history.go(0);

      const result = await response.json();
      console.log('Response of account storage:', result);

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  //Asset type form data
  const handleSubmitAssets = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const asset_name = formData.get('assetName') as string;
    const description = formData.get('assetDescription') as string;
    console.log({
      assetType: asset_name,
      assetDescription: description,
    });
    const data = {
      asset_name: asset_name,
      description: description,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/admintransactionprocessingapi/DupayAssets/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assets');
      }
      // history.go(0);

      const result = await response.json();
      console.log('Response of asset storage:', result);

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  //Denomination type form data
  const handleSubmitDenomination = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const fullName1 = formData.get('denominationName') as string;
    const fullName2 = formData.get('denominationSymbole') as string;
    console.log({
      denominationName: fullName1,
      denominationSymbole: fullName2,
    });
  };

  //Address type form data
  const handleSubmitAddress = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const fullName1 = formData.get('addressName') as string;
    const isDefaultAddress = (event.target as HTMLFormElement).querySelector('.cyberpunk-checkbox') as HTMLInputElement;
    const isDefault = isDefaultAddress.checked;
    console.log({
      AddressName: fullName1,
      DefaultAddress: isDefault,
    });
  };

  //Phases type form data
  const handleSubmitPhases = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const phase_name = selectRef.current?.value;
    console.log(phase_name);

    const data = {
      phase_name: phase_name,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/admintransactionprocessingapi/DupayPhases/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit Phases');
      }
      // history.go(0);

      const result = await response.json();
      console.log('Response of Phases storage:', result);

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  //Close button
  const handleClose = () => {
    setActiveButton(null);
  }


  return (
    <div className="content-management">
      <h2 className='heading'>Content Management</h2>

      {/* Conditionally render only the clicked button */}
      {activeButton === null && (
        <div className="menu">
          <button className="menu-item" onClick={() => handleButtonClick('Accounts')}>Accounts</button>
          <button className="menu-item" onClick={() => handleButtonClick('Assets')}>Assets</button>
          <button className="menu-item" onClick={() => handleButtonClick('Denomination')}>Denomination</button>
          <button className="menu-item" onClick={() => handleButtonClick('Address')}>Address</button>
          <button className="menu-item" onClick={() => handleButtonClick('Phases')}>Phases</button>
        </div>
      )}

      {/* Show the text fields and the clicked button */}
      {activeButton !== null && (
        <div className="text-fields">
          {activeButton === 'Accounts' && (
            <div>
              <button className="menu-item" onClick={() => setActiveButton(null)}>Accounts</button>
              <form onSubmit={handleSubmitAccounts}>
                <div className="input-group">
                  <input className="input" autoComplete="on" name="accountType" type="text" required />
                  <label className="user-label">Account Type</label>
                </div>
                <label className='extext'>ex:- 'asset', 'liability',.....</label>
                <div className="input-group">
                  <input className="input" autoComplete="on" name="accountName" type="text" required />
                  <label className="user-label">Account Name</label>
                </div>
                <label className='extext'>ex:- "Savings",.....</label>
                <button
                  type="submit"
                  className='submit-button'
                >
                  Submit
                </button>

              </form>
              <button className='close-button' onClick={handleClose}>Close</button>
            </div>
          )}
          {activeButton === 'Assets' && (
            <div>
              <button className="menu-item" onClick={() => setActiveButton(null)}>Assets</button>
              <form onSubmit={handleSubmitAssets}>
                <div className="input-group">
                  <input className="input" autoComplete="on" name="assetName" type="text" required />
                  <label className="user-label">Asset Name</label>
                </div>
                <label className='extext'>ex:- 'Cash', 'Bitcoin',.....</label>
                <div className="input-group">
                  <input className="input" autoComplete="on" name="assetDescription" type="text" required />
                  <label className="user-label">Asset Description</label>
                </div>
                <label className='extext'>ex:- 'A brief description of the asset'....</label>
                <button
                  type="submit"
                  className='submit-button'
                >
                  Submit
                </button>
              </form>
              <button className='close-button' onClick={handleClose}>Close</button>
            </div>
          )}
          {activeButton === 'Denomination' && (
            <div>
              <button className="menu-item" onClick={() => setActiveButton(null)}>Denomination</button>
              <form onSubmit={handleSubmitDenomination}>
                <div className="input-group">
                  <input className="input" autoComplete="on" name="denominationName" type="text" required />
                  <label className="user-label">Denomination Name</label>
                </div>
                <label className='extext'>ex:- 'USD', 'BTC',.....</label>
                <div className="input-group">
                  <input className="input" autoComplete="on" name="denominationSymbole" type="text" required />
                  <label className="user-label">Denomination Symbole</label>
                </div>
                <label className='extext'>ex:- '$'','₿',.....</label>
                <button
                  type="submit"
                  className='submit-button'
                >
                  Submit
                </button>
              </form>
              <button className='close-button' onClick={handleClose}>Close</button>
            </div>
          )}
          {activeButton === 'Address' && (
            <div>
              <button className="menu-item" onClick={() => setActiveButton(null)}>Address</button>
              <form onSubmit={handleSubmitAddress}>
                <div className="input-group">
                  <input className="input" autoComplete="on" name="addressName" type="text" required />
                  <label className="user-label">Address Name</label>
                </div>
                <label className='extext'>ex:- 'Savings',.....</label>
                <div className="input-group1">
                  <label className="cyberpunk-checkbox-label">
                    <input type="checkbox" className="cyberpunk-checkbox" />
                    The Default Address For The Denomination.</label>
                </div>
                <button
                  type="submit"
                  className='submit-button'
                >
                  Submit
                </button>
              </form>
              <button className='close-button' onClick={handleClose}>Close</button>
            </div>
          )}
          {activeButton === 'Phases' && (
            <div>
              <button className="menu-item" onClick={() => setActiveButton(null)}>Phases</button>
              <form onSubmit={handleSubmitPhases}>
                <div className="select-container">
                  <label htmlFor="options">Select The Status Phase Of The Balance:</label>
                  <select id="options" className="styled-select" ref={selectRef}>
                    <option value="committed">Committed</option>
                    <option value="Pending Incoming">Pending Incoming</option>
                    <option value="Pending Outgoing">Pending Outgoing</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className='submit-button'
                >
                  Submit
                </button>
              </form>
              <button className='close-button' onClick={handleClose}>Close</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dimensions;
