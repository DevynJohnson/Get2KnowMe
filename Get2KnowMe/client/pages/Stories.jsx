import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import "../styles/Stories.css";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data) => {
        setStories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="stories-container">
      <h1 className="stories-title">Breaking Stigma</h1>
      <h2 className="stories-subtitle">One Story At A Time</h2>
      <p className="stories-desc">
        You are not alone. We invite you to share your stories and experiences
        about neurodiversity with our community. Your experience can help others
        feel seen and understood!
      </p>
      <p className="stories-desc">
        Your story can be about anything related to neurodiversity, whether it's
        your own journey, a loved one's experience, or simply a reflection on
        the topic.
      </p>
      <p className="stories-desc">
        We encourage you to share your story in a way that feels comfortable for
        you. Stories can be posted under your name or anonymously.
      </p>
      <div className="stories-submit-info">
        <h2 className="stories-subtitle">To submit your story:</h2>

        <p className="stories-desc">
          Email your story to{" "}
          <a href="mailto:stories@get2knowme.co.uk">stories@get2knowme.co.uk</a>{" "}
          with the subject line "Story Submission".
        </p>
        <p className="stories-desc">
          You can include your name, or just let us know if you would like your
          story posted anonymously.
        </p>
        <p className="stories-desc">
          Stories will be reviewed and added by our admin team.
        </p>
      </div>
      <h2 className="stories-community-title">Community Stories</h2>
      {loading ? (
        <p>Loading stories...</p>
      ) : stories.length === 0 ? (
        <p>No stories yet. Be the first to share yours!</p>
      ) : (
        <div className="stories-list">
          {stories.map((s) => (
            <div key={s._id || s.id} className="stories-card">
              <div className="stories-card-title">{s.name}</div>
              <div className="stories-card-date">
                {new Date(s.date).toLocaleDateString()}
              </div>
              <div className="stories-card-content">{s.story}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
