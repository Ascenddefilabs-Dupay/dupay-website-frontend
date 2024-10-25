// Dimensions.tsx
"use client"
import React, { useState, useRef, useEffect } from 'react';
import './Dimensions.css';

interface Account {
  duc_account_id: number;
  duc_account_type: string;
}
interface Assets {
  duc_asset_id: number;
  duc_asset_name: string;
}
interface Denominations {
  duc_denomination_id: number;
  duc_denomination_name: string;
}

const Dimensions: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [assets, setAssets] = useState<Assets[]>([]);
  const [Denomination, setDenomination] = useState<Denominations[]>([]);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName === activeButton ? null : buttonName);
  };
  const selectRef = useRef<HTMLSelectElement>(null);

  // to fetch account id
  useEffect(() => {
    if (activeButton === 'Assets') {
      console.log('this is an Assets');
      const fetchAccounts = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/admintransactionprocessingapi/account_names/');
          const data: Account[] = await response.json();
          setAccounts(data);

        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      };
      fetchAccounts();
    } else if (activeButton === 'Denomination') {
      console.log('this is an Denomination');
      const fetchAssets = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/admintransactionprocessingapi/asset_names/');
          const data: Assets[] = await response.json();
          setAssets(data);

        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      };
      fetchAssets();

    } else if (activeButton === 'Address') {
      console.log('this is an Address');
      const fetchAssets = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/admintransactionprocessingapi/denomination_names/');
          const data: Denominations[] = await response.json();
          setDenomination(data);

        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      };
      fetchAssets();

    }
  }, [activeButton]);

  //Account Type form data
  const handleSubmitAccounts = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const account_type = formData.get('accountType') as string;
    const account_name = formData.get('accountName') as string;
    // console.log({
    //   accountType: account_type,
    //   accountName: account_name,
    // });

    const data = {
      duc_account_type: account_type,
      duc_account_name: account_name,
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
      setActiveButton(null);
      // history.go(0);

      // const result = await response.json();
      // console.log('Response of account storage:', result);

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
    const account_id = selectRef.current?.value;

    // console.log(account_id);
    // console.log({
    //   assetType: asset_name,
    //   assetDescription: description,
    //   account_id: account_id,
    // });
    const data = {
      duc_asset_name: asset_name,
      duc_description: description,
      duc_account_id: account_id,
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
      setActiveButton(null);
      // history.go(0);

      // const result = await response.json();
      // console.log('Response of asset storage:', result);

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  //Denomination type form data
  const handleSubmitDenomination = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const denomination_name = formData.get('denominationName') as string;
    const symbol = formData.get('denominationSymbole') as string;
    const asset_id = selectRef.current?.value;
    // console.log({
    //   denomination_name: denomination_name,
    //   symbol: symbol,
    //   asset_id: asset_id,
    // });
    const data = {
      duc_denomination_name: denomination_name,
      duc_symbol: symbol,
      duc_asset_id: asset_id,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/admintransactionprocessingapi/DupayDenomination/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assets');
      }
      setActiveButton(null);
      // history.go(0);

      // const result = await response.json();
      // console.log('Response of asset storage:', result);

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  //Address type form data
  const handleSubmitAddress = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const addressName = formData.get('addressName') as string;
    const isDefaultAddress = (event.target as HTMLFormElement).querySelector('.cyberpunk-checkbox') as HTMLInputElement;
    const default_flag = isDefaultAddress.checked;
    const denomination_id = selectRef.current?.value;
    // console.log({
    //   addressName: addressName,
    //   isDefaultAddress: default_flag,
    //   denomination_id: denomination_id,
    // });
    const data = {
      duc_address_name: addressName,
      duc_default_flag: default_flag,
      duc_denomination_id: denomination_id,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/admintransactionprocessingapi/DupayAddress/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assets');
      }
      setActiveButton(null);
      // history.go(0);

      // const result = await response.json();
      // console.log('Response of asset storage:', result);

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  //Phases type form data
  const handleSubmitPhases = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const phase_name = formData.get('phase_name') as string;

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
      setActiveButton(null);
      // history.go(0);

      // const result = await response.json();
      // console.log('Response of Phases storage:', result);

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
                <div className="select-container">
                  <label htmlFor="options">Select Accounts:</label>
                  <select id="options" className="styled-select" ref={selectRef}>
                    {accounts.map((account) => (
                      <option key={account.duc_account_id} value={account.duc_account_id}>
                        {account.duc_account_type}
                      </option>
                    ))}
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
                <div className="select-container">
                  <label htmlFor="options">Select Assets:</label>
                  <select id="options" className="styled-select" ref={selectRef}>
                    {assets.map((account) => (
                      <option key={account.duc_asset_id} value={account.duc_asset_id}>
                        {account.duc_asset_name}
                      </option>
                    ))}
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
                <div className="select-container">
                  <label htmlFor="options">Select Assets:</label>
                  <select id="options" className="styled-select" ref={selectRef}>
                    {Denomination.map((account) => (
                      <option key={account.duc_denomination_id} value={account.duc_denomination_id}>
                        {account.duc_denomination_name}
                      </option>
                    ))}
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
          {activeButton === 'Phases' && (
            <div>
              <button className="menu-item" onClick={() => setActiveButton(null)}>Phases</button>
              <form onSubmit={handleSubmitPhases}>
                <div className="input-group">
                  <input className="input" autoComplete="on" name="phase_name" type="text" required />
                  <label className="user-label">Phase Name</label>
                </div>
                <label className='extext'>ex:- 'committed','pending_incoming','pending_outgoing'.....</label>
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
