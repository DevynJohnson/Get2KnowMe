import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import auth from '../utils/auth.js';
import '../styles/Stories.css';

const ADMIN_EMAILS = ['dljohnson1313@gmail.com', 'jwbarry@outlook.com'];

export default function SubmitStory() {
  const [form, setForm] = useState({ name: '', story: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const isAdmin = isAuthenticated && user && ADMIN_EMAILS.includes(user.email);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.story.trim()) {
      setError('Please fill in the story.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const token = auth.getToken();
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name: form.name.trim() || 'Anonymous', story: form.story })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit story.');
      }
      setSuccess(true);
      setForm({ name: '', story: '' });
    } catch (err) {
      setError(err.message || 'Failed to submit story.');
    }
    setSubmitting(false);
  };

  if (!isAdmin) {
    return (
      <div className="stories-container">
        <h1 className="stories-title">Admin: Add Story</h1>
        <div className="stories-form-error">Access Denied: You do not have permission to view this page.</div>
      </div>
    );
  }

  return (
    <div className="stories-container">
      <h1 className="stories-title">Admin: Add Story</h1>
      <p className="stories-desc">
        Use this form to add a new story to the community stories database. This page should only be used by site admins.
      </p>
      {success ? (
        <div className="stories-form-success">
          Story added successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="stories-form" autoComplete="off">
          <div className="stories-form-group">
            <label htmlFor="name" className="stories-form-label">Name or Alias</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="stories-form-input"
              placeholder="Leave blank for Anonymous"
            />
          </div>
          <div className="stories-form-group">
            <label htmlFor="story" className="stories-form-label">Story</label>
            <textarea
              id="story"
              name="story"
              value={form.story}
              onChange={handleChange}
              className="stories-form-textarea"
              placeholder="Paste the user's story here..."
              required
            />
          </div>
          {error && <div className="stories-form-error">{error}</div>}
          <button type="submit" className="stories-form-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Add Story'}
          </button>
        </form>
      )}
    </div>
  );
}
