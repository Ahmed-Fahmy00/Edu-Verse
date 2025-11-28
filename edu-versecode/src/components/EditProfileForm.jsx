import { useState } from "react";
import { updateProfile } from "../api/users";
import { getSession, setSession } from "../api/session";

const EditProfileForm = ({ profile, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    level: profile?.level || "",
    image: profile?.image || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const session = getSession();
      const updated = await updateProfile(session._id, form, session.token);
      setSession(updated);
      onUpdate && onUpdate(updated);
      onClose && onClose();
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>
      {error && <p className="form-error">{error}</p>}
      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Email
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          type="email"
        />
      </label>
      <label>
        Level
        <input name="level" value={form.level} onChange={handleChange} />
      </label>
      <label>
        Image URL
        <input name="image" value={form.image} onChange={handleChange} />
      </label>
      <div className="form-actions">
        <button type="button" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
