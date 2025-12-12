import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Modern Contacts Manager UI:
 * - Responsive layout (Stack on mobile, Side-by-side on Desktop)
 * - Mobile-friendly Table (converts to cards)
 */

// const API_BASE_URL = 'http://localhost:8080/api/contacts';
const API_BASE_URL = 'https://royal-back-1-r43b.onrender.com/api/contacts';

const emptyForm = {
  id: '',
  name: '',
  surname: '',
  phoneNumber: '',
  email: '',
};

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isEditing = !!formData.id;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(API_BASE_URL);
      setContacts(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load contacts. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setError('');
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/${formData.id}`, {
          name: formData.name,
          surname: formData.surname,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
        });
        showSuccess('Contact updated successfully');
      } else {
        await axios.post(API_BASE_URL, {
          name: formData.name,
          surname: formData.surname,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
        });
        showSuccess('New contact added');
      }

      resetForm();
      await fetchContacts();
    } catch (err) {
      console.error(err);
      setError('Failed to save contact. Please check connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (contact) => {
    setError('');
    setFormData({
      id: contact.id,
      name: contact.name,
      surname: contact.surname,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
    });
    // Smooth scroll to top for mobile users
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      setError('');
      await axios.delete(`${API_BASE_URL}/${id}`);
      showSuccess('Contact deleted');
      await fetchContacts();
    } catch (err) {
      console.error(err);
      setError('Failed to delete contact.');
    }
  };

  return (
      <div className="app-container">
        <div className="content-wrapper">

          {/* Header Section */}
          <header className="app-header">
            <div className="header-content">
              <h1>Welcome to <span className="text-primary">Royal travel</span></h1>
              <p>Agency contacts</p>
            </div>
            <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={fetchContacts}
                disabled={loading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 5.5A10 10 0 1 0 22 12"/></svg>
              {loading ? 'Syncing...' : 'Refresh'}
            </button>
          </header>

          {/* Notifications */}
          <div className="notification-area">
            {error && (
                <div className="alert alert-error">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{error}</span>
                </div>
            )}
            {successMsg && (
                <div className="alert alert-success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>{successMsg}</span>
                </div>
            )}
          </div>

          <main className="main-layout">
            {/* Left Column: Form */}
            <aside className="form-column">
              <div className="card form-card">
                <div className="card-header">
                  <h2>{isEditing ? 'Edit Contact' : 'New Contact'}</h2>
                  <p>{isEditing ? 'Update the details below' : 'Add a new person to your list'}</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">First Name</label>
                      <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Sarah"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="surname">Last Name</label>
                      <input
                          id="surname"
                          name="surname"
                          type="text"
                          value={formData.surname}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Connor"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                          placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor="email">Email Address</label>
                      <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="sarah@example.com"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
                      {saving ? 'Processing...' : isEditing ? 'Save Changes' : 'Create Contact'}
                    </button>

                    {isEditing && (
                        <button type="button" className="btn btn-ghost btn-block" onClick={resetForm} disabled={saving}>
                          Cancel
                        </button>
                    )}
                  </div>
                </form>
              </div>
            </aside>

            {/* Right Column: List */}
            <section className="list-column">
              <div className="card list-card">
                <div className="card-header flex-header">
                  <h2>Contacts List</h2>
                  <span className="badge">{contacts.length} Records</span>
                </div>

                {contacts.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">👥</div>
                      <h3>No contacts found</h3>
                      <p>Fill out the form to add your first contact.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                      <table className="contacts-table">
                        <thead>
                        <tr>
                          <th>Name</th>
                          <th>Surname</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th className="text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {contacts.map((c) => (
                            <tr key={c.id}>
                              <td data-label="Name">{c.name}</td>
                              <td data-label="Surname">{c.surname}</td>
                              <td data-label="Phone">{c.phoneNumber}</td>
                              <td data-label="Email" className="text-break">{c.email}</td>
                              <td className="actions-cell">
                                <div className="action-buttons">
                                  <button
                                      type="button"
                                      className="icon-btn edit-btn"
                                      onClick={() => handleEdit(c)}
                                      title="Edit"
                                  >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                  </button>
                                  <button
                                      type="button"
                                      className="icon-btn delete-btn"
                                      onClick={() => handleDelete(c.id)}
                                      title="Delete"
                                  >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                )}
              </div>
            </section>
          </main>

          <footer className="app-footer">
            <p>© {new Date().getFullYear()} Contacts Manager. Built with React & Spring Boot. D. Minasyan</p>
          </footer>
        </div>
      </div>
  );
}

export default App;
