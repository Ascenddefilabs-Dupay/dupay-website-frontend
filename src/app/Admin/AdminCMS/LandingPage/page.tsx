"use client";
import { useState } from 'react';
import { FaEdit, FaTrash, FaSave, FaArrowLeft, FaPlus } from 'react-icons/fa'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './page.module.css'; 

interface RequestBody {
  account_type?: string;
  currency_type?: string;
  icon?: File | null; 
}

interface FetchedValue {
  id: number;
  account_type?: string;
  currency_type?: string;
  icon?: string;
}

const Home = () => {
  const [showTextBox, setShowTextBox] = useState<string>(''); 
  const [inputValue, setInputValue] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [fetchedValues, setFetchedValues] = useState<FetchedValue[]>([]); 
  const [editMode, setEditMode] = useState<number | null>(null); 
  const [editedValue, setEditedValue] = useState<string>(''); 
  const [backButtonVisible, setBackButtonVisible] = useState<boolean>(false); 
  const [activeButton, setActiveButton] = useState<string>(''); 
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false); 
  const [file, setFile] = useState<File | null>(null); 

  const handleButtonClick = async (type: string) => {
    setShowTextBox(type); 
    setInputValue(''); 
    setBackButtonVisible(true); 
    setActiveButton(type);  
    setIsInputVisible(false);

    try {
      const response = await fetch(`http://localhost:8000/api/admincms/${type}/`);
      if (response.ok) {
        const data = await response.json();
        setFetchedValues(data); 
      } else {
        setFetchedValues([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('An error occurred while fetching data.', { autoClose: false });
      setFetchedValues([]);
    }
  };

  const handleBackClick = () => {
    setShowTextBox(''); 
    setFetchedValues([]); 
    setBackButtonVisible(false); 
    setActiveButton('');  
    setIsInputVisible(false);
  };

  const handlePlusClick = () => {
    setIsInputVisible(true); 
  };

  const handleAddClick = async () => {
    if (showTextBox === '' || inputValue.trim() === '') {
        toast.warning('Please provide a valid input.', { autoClose: false });
        return;
    }

    const formData = new FormData();  // Use FormData to support file uploads
    if (showTextBox === 'account') formData.append('account_type', inputValue);
    if (showTextBox === 'currency') formData.append('currency_type', inputValue);
    if (file) {
        formData.append('icon', file);  // Attach file if it exists
    }

    setIsLoading(true);

    try {
        const response = await fetch("http://localhost:8000/api/admincms/", {
            method: 'POST',
            body: formData,  // Send FormData, no need to set Content-Type
        });

        if (response.ok) {
            const responseData = await response.json();

            // Immediately update the state with the new data including the icon
            setFetchedValues(prev => [
                ...prev,
                {
                    id: responseData.data.id,
                    [showTextBox + '_type']: inputValue,
                    icon: responseData.data.icon // Update with the new icon URL
                }
            ]);

            setInputValue(''); // Clear input field
            setFile(null);     // Clear file input
            setIsInputVisible(false);
            toast.success('Added successfully.', { autoClose: 1000 });
        } else {
            toast.error('Failed to add value.', { autoClose: false });
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('An error occurred while adding the value.', { autoClose: false });
    } finally {
        setIsLoading(false);
    }
};

  const handleEdit = (id: number, currentValue: string) => {
    setEditMode(id); 
    setEditedValue(currentValue); 
    setFile(null); // Reset file input
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSave = async (id: number) => {
    const formData = new FormData();
    if (showTextBox === 'account') {
        formData.append('account_type', editedValue);
    }
    if (showTextBox === 'currency') {
        formData.append('currency_type', editedValue);
    }
    if (file) {
        formData.append('icon', file);  // Add the file to the form data
    }

    try {
        const response = await fetch(`http://localhost:8000/api/admincms/${id}/`, {
            method: 'PUT',
            body: formData,  // Send formData to backend
        });

        if (response.ok) {
            const responseData = await response.json();
            toast.success('Updated successfully.', { autoClose: 1000 });

            // Update the state with the new data from the response
            setFetchedValues(prev =>
                prev.map(item => 
                    item.id === id ? { 
                        ...item, 
                        [showTextBox + '_type']: editedValue, 
                        icon: file ? responseData.data.icon : item.icon // Update icon if a new one is uploaded
                    } : item
                )
            );
            setEditMode(null);
            setFile(null);  // Clear the file input after saving
        } else {
            toast.error('Failed to update.', { autoClose: false });
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('An error occurred while updating.', { autoClose: false });
    }
};

  const handleDelete = async (id: number) => {
    if (await toast.promise(
      fetch(`http://localhost:8000/api/admincms/${id}/`, {
        method: 'DELETE',
      }).then(response => {
        if (response.ok) {
          setFetchedValues(fetchedValues.filter(item => item.id !== id)); 
          return 'Deleted successfully.';
        } else {
          throw new Error('Failed to delete.');
        }
      }),
      {
        pending: 'Deleting...',
        success: 'Deleted successfully.',
        error: 'Failed to delete.',
      },
      { autoClose: 1000 }
    )) {
      // Successfully deleted
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        {backButtonVisible && (
          <div className={styles.backButtonContainer}>
            <FaArrowLeft className={styles.backArrowIcon} onClick={handleBackClick} />
          </div>
        )}
        <h1 className={styles.navbarTitle}>Content Management</h1>
      </nav>

      <div className={styles.buttonContainer}>
        <button 
          onClick={() => handleButtonClick('account')} 
          className={`${styles.button} ${activeButton === 'account' ? styles.activeButton : styles.inactiveButton}`}
          disabled={activeButton === 'currency'}
        >
          Account Type
        </button>
        <button 
          onClick={() => handleButtonClick('currency')} 
          className={`${styles.button} ${activeButton === 'currency' ? styles.activeButton : styles.inactiveButton}`}
          disabled={activeButton === 'account'}
        >
          Currency Type
        </button>
      </div>
      {isInputVisible && (
        <div className={styles.textBoxContainer}>
          <input
            type="text"
            placeholder={`Enter ${showTextBox === 'account' ? 'Account' : 'Currency'} Type`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.input}
          />
          {showTextBox === 'currency' && (
            <label className={styles.uploadLabel}>
              <input type="file" onChange={handleFileChange} className={styles.fileInput} />
              
            </label>
          )}
          <button onClick={handleAddClick} className={styles.addButton} disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add'}
          </button>
        </div>
      )}

    
      {fetchedValues.length > 0 && showTextBox === 'account' && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
              <th className={styles.accountTypeHeader}>
                Account Type
                <FaPlus className={styles.plusIcon} onClick={handlePlusClick} />
              </th>
              </tr>
            </thead>
            <tbody>
              {fetchedValues.map((item) => (
                <tr key={item.id}>
                  <td className={styles.tableRow}>
                    {editMode === item.id ? (
                      <>
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          className={styles.inputEdit}
                        />
                      </>
                    ) : (
                      item.account_type
                    )}
                    <div className={styles.actionIcons}>
                      {editMode === item.id ? (
                        <FaSave className={styles.icon} onClick={() => handleSave(item.id)} />
                      ) : (
                        <>
                          <FaEdit
                            className={styles.icon}
                            onClick={() => handleEdit(item.id, item.account_type ?? '')}
                          />
                          <FaTrash className={styles.deleteIcon} onClick={() => handleDelete(item.id)} />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {fetchedValues.length > 0 && showTextBox === 'currency' && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Currency Type</th>
                <th>Icon</th>
                <th>
                  <FaPlus className={styles.plusIcon} onClick={handlePlusClick} /> {/* Add Icon */}
                </th>
              </tr>
            </thead>
            <tbody>
              {fetchedValues.map((item) => (
                <tr key={item.id}>
                  {/* Currency Type Column */}
                  <td>
                    {editMode === item.id ? (
                      <input
                        type="text"
                        value={editedValue}
                        onChange={(e) => setEditedValue(e.target.value)}
                        className={styles.inputEdit}
                      />
                    ) : (
                      item.currency_type
                    )}
                  </td>

                  {/* Icon Column */}
                  <td>
                    {editMode === item.id ? (
                      <input
                        type="file"
                        className={styles.uploadButton}
                        onChange={handleFileChange}
                      />
                    ) : item.icon ? (
                      <img src={item.icon} alt="Currency Icon" className={styles.iconImage} />  // Displaying the icon if available
                    ) : (
                      'No Icon'
                    )}
                  </td>

                  {/* Action Icons */}
                  <td>
                    <div className={styles.actionIcons}>
                      {editMode === item.id ? (
                        <FaSave className={styles.icon} onClick={() => handleSave(item.id)} />
                      ) : (
                        <>
                          <FaEdit
                            className={styles.icon}
                            onClick={() => handleEdit(item.id, item.currency_type ?? '')}
                          />
                          <FaTrash className={styles.deleteIcon} onClick={() => handleDelete(item.id)} />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      <ToastContainer position="top-center" />
    </div>
  );
};

export default Home;
