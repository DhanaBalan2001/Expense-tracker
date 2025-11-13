import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Image } from 'react-bootstrap';
import Navbar from '../../components/navbar/Navbar.jsx';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import { getProfile, updateProfile, changePassword, deleteAccount } from '../../services/profile.js';
import './profile.css';

// Default avatar as base64 to avoid network requests
const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNlMGUwZTAiLz48dGV4dCB4PSI3NSIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzg4OCI+VXNlcjwvdGV4dD48L3N2Zz4=";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    avatar: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    password: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile({
        username: data.username || '',
        email: data.email || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        avatar: data.avatar || ''
      });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to load profile' });
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };
  
  const handleDeleteConfirmChange = (e) => {
    setDeleteConfirm({ ...deleteConfirm, password: e.target.value });
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await updateProfile(profile);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setUpdating(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setMessage({ type: 'danger', text: 'Passwords do not match' });
    }
    
    try {
      setChangingPassword(true);
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to change password' 
      });
    } finally {
      setChangingPassword(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(deleteConfirm.password);
      // Redirect to login page or home page after successful deletion
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to delete account' 
      });
    }
  };
  
  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        <Sidebar />
        <main className="profile-main">
          <Container fluid>
            <h1 className="page-title">Profile Settings</h1>
            
            {message.text && (
              <Alert 
                variant={message.type} 
                dismissible 
                onClose={() => setMessage({ type: '', text: '' })}
              >
                {message.text}
              </Alert>
            )}
            
            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <Row>
                <Col lg={8}>
                  <Card className="mb-4 profile-card">
                    <Card.Header>
                      <h5 className="mb-0">Profile Information</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form onSubmit={handleProfileSubmit}>
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Username</Form.Label>
                              <Form.Control
                                type="text"
                                name="username"
                                value={profile.username}
                                onChange={handleProfileChange}
                                required
                                autoComplete="username"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Email</Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                required
                                autoComplete="email"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>First Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleProfileChange}
                                autoComplete="given-name"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Last Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleProfileChange}
                                autoComplete="family-name"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={profile.phone}
                            onChange={handleProfileChange}
                            autoComplete="tel"
                          />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Profile Picture URL</Form.Label>
                          <Form.Control
                            type="text"
                            name="avatar"
                            value={profile.avatar}
                            onChange={handleProfileChange}
                          />
                          <Form.Text className="text-muted">
                            Enter a URL for your profile picture
                          </Form.Text>
                        </Form.Group>
                        
                        <div className="d-flex justify-content-end">
                          <Button 
                            variant="primary" 
                            type="submit"
                            disabled={updating}
                          >
                            {updating ? 'Updating...' : 'Update Profile'}
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                  
                  <Card className="mb-4 profile-card">
                    <Card.Header>
                      <h5 className="mb-0">Change Password</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form onSubmit={handlePasswordSubmit}>
                        <Form.Control
                          type="text"
                          name="username"
                          value={profile.username}
                          autoComplete="username"
                          style={{ display: 'none' }}
                          readOnly
                        />
                        <Form.Group className="mb-3">
                          <Form.Label>Current Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            autoComplete="current-password"
                          />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            autoComplete="new-password"
                          />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm New Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            autoComplete="new-password"
                          />
                        </Form.Group>
                        
                        <div className="d-flex justify-content-end">
                          <Button 
                            variant="primary" 
                            type="submit"
                            disabled={changingPassword}
                          >
                            {changingPassword ? 'Changing...' : 'Change Password'}
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                  
                  <Card className="mb-4 profile-card danger-zone">
                    <Card.Header className="bg-danger text-white">
                      <h5 className="mb-0">Danger Zone</h5>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-danger">
                        <strong>Warning:</strong> Deleting your account is permanent and cannot be undone.
                        All your data will be permanently removed.
                      </p>
                      
                      {!deleteConfirm.show ? (
                        <Button 
                          variant="outline-danger" 
                          onClick={() => setDeleteConfirm({ ...deleteConfirm, show: true })}
                        >
                          Delete Account
                        </Button>
                      ) : (
                        <div className="delete-confirm">
                          <Form.Group className="mb-3">
                            <Form.Label>Enter your password to confirm</Form.Label>
                            <Form.Control
                              type="text"
                              name="username"
                              value={profile.username}
                              autoComplete="username"
                              style={{ display: 'none' }}
                              readOnly
                            />
                            <Form.Control
                              type="password"
                              value={deleteConfirm.password}
                              onChange={handleDeleteConfirmChange}
                              required
                              autoComplete="current-password"
                            />
                          </Form.Group>
                          
                          <div className="d-flex">
                            <Button 
                              variant="secondary" 
                              className="me-2"
                              onClick={() => setDeleteConfirm({ show: false, password: '' })}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="danger" 
                              onClick={handleDeleteAccount}
                              disabled={!deleteConfirm.password}
                            >
                              Permanently Delete Account
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col lg={4}>
                  <Card className="mb-4 profile-card">
                    <Card.Body className="text-center">
                      <div className="avatar-container mb-3">
                        <Image 
                          src={profile.avatar || DEFAULT_AVATAR} 
                          alt="Profile" 
                          roundedCircle 
                          className="profile-avatar"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_AVATAR;
                          }}
                        />
                      </div>
                      <h5>{profile.firstName || ''} {profile.lastName || ''}</h5>
                      <p className="text-muted">@{profile.username || 'username'}</p>
                      <p className="text-muted">{profile.email || 'email@example.com'}</p>
                      {profile.phone && <p className="text-muted">{profile.phone}</p>}
                    </Card.Body>
                  </Card>
                  
                  <Card className="profile-card">
                    <Card.Header>
                      <h5 className="mb-0">Account Information</h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="account-info-item">
                        <span className="text-muted">Member Since</span>
                        <span>January 1, 2023</span>
                      </div>
                      <div className="account-info-item">
                        <span className="text-muted">Last Login</span>
                        <span>Today</span>
                      </div>
                      <div className="account-info-item">
                        <span className="text-muted">Account Type</span>
                        <span>Standard</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Profile;
