import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import '../styles/Stories.css';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [form, setForm] = useState({ name: '', story: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    fetch('/api/stories')
      .then((res) => res.json())
      .then((data) => {
        setStories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameToSend = form.name.trim() || 'Anonymous';
    if (!form.story.trim()) {
      setError('Please fill in your story.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      let res, data;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (editingId) {
        res = await fetch(`/api/stories/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ name: nameToSend, story: form.story }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update story.');
        setStories(stories.map((s) => (s._id === editingId ? data : s)));
        setEditingId(null);
      } else {
        res = await fetch('/api/stories', {
          method: 'POST',
          headers,
          body: JSON.stringify({ name: nameToSend, story: form.story }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to submit story.');
        setStories([data, ...stories]);
      }
      setForm({ name: '', story: '' });
    } catch (err) {
      setError(err.message || 'Failed to submit story.');
    }
    setSubmitting(false);
  };

  const handleEdit = (story) => {
    setForm({ name: story.name === 'Anonymous' ? '' : story.name, story: story.story });
    setEditingId(story._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/stories/${id}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Failed to delete story.');
      setStories(stories.filter((s) => s._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm({ name: '', story: '' });
      }
    } catch {
      alert('Failed to delete story.');
    }
  };

  return (
    <div className="stories-container">
      <h1 className="stories-title">Breaking Stigma</h1>
      <h2 className="stories-subtitle">One Story At A Time</h2>
      <p className="stories-desc">
        You are not alone. We invite you to share your stories and experiences about neurodiversity with our community. Your experience can help others feel seen and understood!</p> 
        <p className="stories-desc">Your story can be about anything related to neurodiversity, whether it's your own journey, a loved one's experience, or simply a reflection on the topic.</p> 
        <p className="stories-desc">We encourage you to share your story in a way that feels comfortable for you. You can choose to post under your name or anonymously.
      </p>
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="stories-form" autoComplete="off">
          <div className="stories-form-group">
            <label htmlFor="name" className="stories-form-label">Your Name or Alias</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="stories-form-input"
              placeholder="Leave blank to remain anonymous"
            />
          </div>
          <div className="stories-form-group">
            <label htmlFor="story" className="stories-form-label">Your Story</label>
            <textarea
              id="story"
              name="story"
              value={form.story}
              onChange={handleChange}
              className="stories-form-textarea"
              placeholder="Share your experience..."
            />
          </div>
          {error && <div className="stories-form-error">{error}</div>}
          <button type="submit" className="stories-form-btn" disabled={submitting}>
            {submitting ? (editingId ? 'Saving...' : 'Submitting...') : editingId ? 'Save Changes' : 'Submit Story'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', story: '' }); }} className="stories-form-cancel-btn">
              Cancel Edit
            </button>
          )}
        </form>
      ) : (
        <div className="stories-signin-box">
          <p>You must be signed in to share your story.</p>
          <a href="/login" className="stories-signin-link">Sign In</a>
        </div>
      )}
      <h2 className="stories-community-title">Community Stories</h2>
      {loading ? (
        <p>Loading stories...</p>
      ) : stories.length === 0 ? (
        <p>No stories yet. Be the first to share yours!</p>
      ) : (
        <div className="stories-list">
          {stories.map((s) => {
            const isOwner = isAuthenticated && user && s.user && (s.user === user._id || s.user === user.id);
            return (
              <div key={s._id || s.id} className="stories-card">
                <div className="stories-card-title">{s.name}</div>
                <div className="stories-card-date">{new Date(s.date).toLocaleDateString()}</div>
                <div className="stories-card-content">{s.story}</div>
                {isOwner && (
                  <div className="stories-card-actions">
                    <button onClick={() => handleEdit(s)} className="stories-card-edit-btn">Edit</button>
                    <button onClick={() => handleDelete(s._id)} className="stories-card-delete-btn">Delete</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
