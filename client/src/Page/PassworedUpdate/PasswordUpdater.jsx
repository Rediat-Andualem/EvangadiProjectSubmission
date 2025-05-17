import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from './PasswordUpdater.module.css';
import { axiosInstance } from '../../utility/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';

function PasswordUpdater() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');
  const [showForm, setShowForm] = useState(true);
  const { userId } = useParams();
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('All fields are required !');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return
    }

    try {
      await axiosInstance.post(`users/updatePassword/${userId}`, {  
        user_new_password: newPassword,
      });

      setError('');
      setResponse('Password updated successfully!');
      setShowForm(false);

      setTimeout(() => {
        navigate('/signupLogIn');
      }, 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error?.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div>
      {showForm ? (
        <Form className={styles.updateForm} onSubmit={handleSubmit}>
          <Form.Group controlId="formNewPassword">
            <Form.Label className={styles.text_muted}>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Your new password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Form.Text className={styles.text_muted}>
              Provide your new password
            </Form.Text>
          </Form.Group>

          <Form.Group className="my-2" controlId="formConfirmPassword">
            <Form.Label className={styles.text_muted}>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Form.Text className={styles.text_muted}>
              Make sure both passwords are similar
            </Form.Text>
          </Form.Group>

          {error && <p className={`${styles.text_muted} text-danger fw-bold`}>{error}</p>}
          <br />
          <Button className="mt-1" variant="success" type="submit">
            Submit
          </Button>
        </Form>
      ) : (
        <div className={styles.successDisplay}>
          <h3 className="text-dark text-center">{response}</h3>
        </div>
      )}
    </div>
  );
}

export default PasswordUpdater;
