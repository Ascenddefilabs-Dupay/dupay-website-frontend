// AccountActivity.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './accountactivity.module.css';
import { Typography, IconButton, Button, TextField } from '@mui/material';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import DeleteIcon from '@mui/icons-material/Delete';
import { MdEdit } from "react-icons/md";
import { IoMdSave } from "react-icons/io";
import { ImCancelCircle } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";

interface AdminAccountActivity {
  content_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const AccountActivity: React.FC = () => {
  const [activities, setActivities] = useState<AdminAccountActivity[]>([]);
  const [newContent, setNewContent] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');
  const [editContentId, setEditContentId] = useState<string | null>(null);
  const [userIds, setUserIds] = useState<string[]>([]);

  const sendNotification = (title: string, message: string, icon: string, link: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: message,
        icon: icon,
      });

      notification.onclick = () => {
        window.open(link, '_blank');
      };
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get<AdminAccountActivity[]>('http://localhost:8000/accountactivityapi/admin-account-activity/');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchUserIds = async () => {
    try {
      const response = await axios.get<{ user_ids: string[] }>('http://localhost:8000/accountactivityapi/get-account-activity-user-ids/');
      if (response.data.user_ids) {
        setUserIds(response.data.user_ids);
      } else {
        alert('No users with account activity enabled.');
      }
    } catch (error) {
      console.error('Error fetching user IDs:', error);
    }
  };

  const addContent = async () => {
    if (!newContent.trim()) return;

    try {
      const response = await axios.post<AdminAccountActivity>('http://localhost:8000/accountactivityapi/admin-account-activity/', {
        content: newContent,
      });
      setActivities((prevActivities) => [...prevActivities, response.data]);
      setNewContent('');
    } catch (error) {
      console.error('Error adding content:', error);
    }
  };

  const updateContent = async (content_id: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await axios.put<AdminAccountActivity>(`http://localhost:8000/accountactivityapi/admin-account-activity/${content_id}/`, {
        content: editContent,
      });
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.content_id === content_id ? response.data : activity
        )
      );
      setEditContentId(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const deleteContent = async (content_id: string) => {
    try {
      await axios.delete(`http://localhost:8000/accountactivityapi/admin-account-activity/${content_id}/`);
      setActivities((prevActivities) =>
        prevActivities.filter((activity) => activity.content_id !== content_id)
      );
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission !== 'granted') {
          alert('Notification permissions are not granted. Please enable them in your browser settings.');
        }
      });
    }
  };

  const notifyEveryone = async (content_id: string) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/accountactivityapi/create-account-activity/',
        { content_id: content_id },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const message = response.data.account_activity_content;
      sendNotification(
        'Account Activity',
        message,
        'https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png',
        'https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages'
      );
      alert('Notification sent successfully.');
    } catch (error: any) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification.');
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    fetchUserIds();
    fetchActivities();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <header className={styles.header}>
          <Link href="/Admin/Notificationservice/AdminNotificationScreen">
            <IconButton>
              <FaArrowLeft style={{ position: 'relative', right: '610px', color: 'white' }} />
            </IconButton>
          </Link>
          <center>
            <Typography variant="h4" gutterBottom>
              Account Activity Notification
            </Typography>
            {/* Removed the global Notify Everyone button */}
            <Typography variant="h6" className={styles.messagetext}>
              Needs to trigger the Account Activity Notification. Users will get the Notification.
            </Typography>
            <div className={styles.centeredBox}>
              <TextField
                placeholder="Add new content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                variant="outlined"
                className={styles.textField}
                InputProps={{
                  className: styles.textFieldInput, // Apply the custom input styles
                }}
                multiline
                rows={4} // Adjust the number of rows as needed
                sx={{
                  overflowY: 'auto', // Make it scrollable
                  maxHeight: '200px', // Set a max height for the text field
                }}
              />
              <Button variant="contained" className={styles.button} onClick={addContent}>
                Add Message
              </Button>
            </div>
          </center>
        </header>

        <ul className={styles.list}>
          {activities.map((activity) => (
            <li key={activity.content_id} className={styles.listItem}>
              {editContentId === activity.content_id ? (
                <>
                  <TextField
                    label="Edit content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    variant="outlined"
                    className={styles.textField}
                    InputProps={{
                      className: styles.textFieldInput, // Apply the custom input styles
                    }}
                  />
                  <IconButton  className={styles.button1} onClick={() => updateContent(activity.content_id)} title="Save" >
                    {/* Save */}
                    <IoMdSave style={{ color: '#FFFFFF'}}/>
                  </IconButton>
                  <IconButton className={styles.cancelButton} onClick={() => { setEditContentId(null); setEditContent(''); }} title="Cancel">
                    {/* Cancel */}
                    <ImCancelCircle style={{ color: '#FFFFFF'}}/>
                  </IconButton>
                </>
              ) : (
                <>
                  {/* <span><strong>{activity.content_id}:</strong> {activity.content}</span> */}
                  <span>{activity.content}</span>
                  <div className={styles.buttonGroup}>
                    <IconButton
                      // variant="contained"
                      className={styles.editButton}
                      onClick={() => {
                        setEditContentId(activity.content_id);
                        setEditContent(activity.content);
                      }}
                      title="Edit"
                    >
                      <MdEdit style={{ color: '#FFFFFF'}}/>
                      {/* Edit */}
                    </IconButton>
                    <IconButton
                      // variant="contained"
                      className={styles.deleteButton}
                      onClick={() => deleteContent(activity.content_id)}
                      title="Delete"
                    >
                      <DeleteIcon style={{ color: '#FFFFFF' }} />
                      {/* Delete */}
                    </IconButton>
                    <Button
                      variant="contained"
                      className={styles.notifyButton}
                      onClick={() => notifyEveryone(activity.content_id)}
                    >
                      Notify Everyone
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccountActivity;
