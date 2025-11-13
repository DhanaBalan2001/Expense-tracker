import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import Navbar from '../../components/navbar/Navbar.jsx';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import { getSettings, updateSettings } from '../../services/settings.js';
import './settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    currency: 'USD',
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      budgetAlerts: true,
      weeklyReports: true,
      billReminders: true
    },
    dateFormat: 'MM/DD/YYYY',
    defaultView: 'monthly'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
  ];
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ar', name: 'Arabic' }
  ];
  
  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'danger', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (e.g., notifications.email)
      const [parent, child] = name.split('.');
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      // Handle top-level properties
      setSettings({
        ...settings,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  const handleThemeChange = (value) => {
    setSettings({ ...settings, theme: value });
    // Apply theme to the document
    document.documentElement.setAttribute('data-theme', value);
  };
  
  const handleDefaultViewChange = (value) => {
    setSettings({ ...settings, defaultView: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateSettings(settings);
      setMessage({ type: 'success', text: 'Settings saved successfully' });
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Failed to save settings' 
      });
    } finally {
      setSaving(false);
    }
  };
  
  const resetToDefaults = () => {
    const defaultSettings = {
      currency: 'USD',
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        budgetAlerts: true,
        weeklyReports: true,
        billReminders: true
      },
      dateFormat: 'MM/DD/YYYY',
      defaultView: 'monthly'
    };
    
    setSettings(defaultSettings);
    document.documentElement.setAttribute('data-theme', defaultSettings.theme);
    setMessage({ type: 'info', text: 'Settings reset to defaults' });
  };
  
  return (
    <div className="settings-container">
      <Navbar />
      <div className="settings-content">
        <Sidebar />
        <main className="settings-main">
          <Container fluid>
            <h1 className="page-title">Application Settings</h1>
            
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
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col lg={6} className="mb-4">
                    <Card className="settings-card">
                      <Card.Header>
                        <h5 className="mb-0">General Settings</h5>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group className="mb-3">
                          <Form.Label>Currency</Form.Label>
                          <Form.Select 
                            name="currency" 
                            value={settings.currency}
                            onChange={handleSettingChange}
                          >
                            {currencies.map(currency => (
                              <option key={currency.code} value={currency.code}>
                                {currency.name} ({currency.symbol})
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Language</Form.Label>
                          <Form.Select 
                            name="language" 
                            value={settings.language}
                            onChange={handleSettingChange}
                          >
                            {languages.map(language => (
                              <option key={language.code} value={language.code}>
                                {language.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Date Format</Form.Label>
                          <Form.Select 
                            name="dateFormat" 
                            value={settings.dateFormat}
                            onChange={handleSettingChange}
                          >
                            {dateFormats.map(format => (
                              <option key={format.value} value={format.value}>
                                {format.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Theme</Form.Label>
                          <div>
                            <ToggleButtonGroup
                              type="radio"
                              name="theme"
                              value={settings.theme}
                              onChange={handleThemeChange}
                              className="w-100"
                            >
                              <ToggleButton id="theme-light" value="light" variant="outline-primary">
                                Light
                              </ToggleButton>
                              <ToggleButton id="theme-dark" value="dark" variant="outline-primary">
                                Dark
                              </ToggleButton>
                              <ToggleButton id="theme-system" value="system" variant="outline-primary">
                                System Default
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </div>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Default View</Form.Label>
                          <div>
                            <ToggleButtonGroup
                              type="radio"
                              name="defaultView"
                              value={settings.defaultView}
                              onChange={handleDefaultViewChange}
                              className="w-100"
                            >
                              <ToggleButton id="view-daily" value="daily" variant="outline-primary">
                                Daily
                              </ToggleButton>
                              <ToggleButton id="view-weekly" value="weekly" variant="outline-primary">
                                Weekly
                              </ToggleButton>
                              <ToggleButton id="view-monthly" value="monthly" variant="outline-primary">
                                Monthly
                              </ToggleButton>
                              <ToggleButton id="view-yearly" value="yearly" variant="outline-primary">
                                Yearly
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </div>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col lg={6} className="mb-4">
                    <Card className="settings-card">
                      <Card.Header>
                        <h5 className="mb-0">Notification Settings</h5>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group className="mb-3">
                          <Form.Check 
                            type="switch"
                            id="email-notifications"
                            label="Email Notifications"
                            name="notifications.email"
                            checked={settings.notifications.email}
                            onChange={handleSettingChange}
                          />
                          <Form.Text className="text-muted">
                            Receive notifications via email
                          </Form.Text>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Check 
                            type="switch"
                            id="push-notifications"
                            label="Push Notifications"
                            name="notifications.push"
                            checked={settings.notifications.push}
                            onChange={handleSettingChange}
                          />
                          <Form.Text className="text-muted">
                            Receive push notifications in your browser
                          </Form.Text>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Check 
                            type="switch"
                            id="budget-alerts"
                            label="Budget Alerts"
                            name="notifications.budgetAlerts"
                            checked={settings.notifications.budgetAlerts}
                            onChange={handleSettingChange}
                          />
                          <Form.Text className="text-muted">
                            Get notified when you're approaching your budget limits
                          </Form.Text>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Check 
                            type="switch"
                            id="weekly-reports"
                            label="Weekly Reports"
                            name="notifications.weeklyReports"
                            checked={settings.notifications.weeklyReports}
                            onChange={handleSettingChange}
                          />
                          <Form.Text className="text-muted">
                            Receive weekly spending reports
                          </Form.Text>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Check 
                            type="switch"
                            id="bill-reminders"
                            label="Bill Reminders"
                            name="notifications.billReminders"
                            checked={settings.notifications.billReminders}
                            onChange={handleSettingChange}
                          />
                          <Form.Text className="text-muted">
                            Get reminders for upcoming bills
                          </Form.Text>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                    
                    <Card className="settings-card mt-4">
                      <Card.Header>
                        <h5 className="mb-0">Data & Privacy</h5>
                      </Card.Header>
                      <Card.Body>
                        <p>
                          Your data is stored securely and is never shared with third parties without your consent.
                        </p>
                        <div className="d-grid gap-2">
                          <Button variant="outline-primary">
                            Export All Data
                          </Button>
                          <Button variant="outline-secondary">
                            Privacy Settings
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-between mt-3">
                  <Button 
                    variant="outline-secondary" 
                    onClick={resetToDefaults}
                    type="button"
                  >
                    Reset to Defaults
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </Form>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Settings;
