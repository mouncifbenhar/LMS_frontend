
import { useState } from "react";
import { apiRequest } from "../../api/apiClient";

function CoursesManager({ token, onLogout, onForbidden }) {

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");


  const [editingCourseId, setEditingCourseId] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("beginner");
  const [status, setStatus] = useState("draft");
  const [formError, setFormError] = useState("");


  const handleLoadCourses = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await apiRequest("/courses", "GET", null, token, onLogout, onForbidden);
      setCourses(Array.isArray(data) ? data : data.courses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  const filteredCourses = courses.filter((course) => {
    const matchCategory =
      categoryFilter === "all" ||
      (course.category && course.category.toLowerCase().includes(categoryFilter.toLowerCase()));
    const matchStatus = statusFilter === "all" || course.status === statusFilter;
    return matchCategory && matchStatus;
  });


  const handleEditClick = (course) => {
    setEditingCourseId(course._id || course.id);
    setTitle(course.title || "");
    setCategory(course.category || "");
    setLevel(course.level || "beginner");
    setStatus(course.status || "draft");
    setFormError("");
  };


  const handleCancelEdit = () => {
    setEditingCourseId(null);
    setTitle("");
    setCategory("");
    setLevel("beginner");
    setStatus("draft");
    setFormError("");
  };


  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!title || !category) {
      setFormError("Title and category are required.");
      return;
    }

    try {
      if (editingCourseId) {
   
        const updated = await apiRequest(
          `/courses/${editingCourseId}`,
          "PUT",
          { title, category, level, status },
          token,
          onLogout,
          onForbidden
        );
        const updatedCourse = updated.course || updated;
        setCourses(courses.map((c) => ((c._id || c.id) === editingCourseId ? updatedCourse : c)));
      } else {
       
        const created = await apiRequest(
          "/courses",
          "POST",
          { title, category, level, status },
          token,
          onLogout,
          onForbidden
        );
        const newCourse = created.course || created;
        setCourses([...courses, newCourse]);
      }

      handleCancelEdit();
    } catch (err) {
   
      setFormError(err.message);
    }
  };

  const handleArchiveCourse = async (course) => {
    const confirmed = window.confirm(`Are you sure you want to archive "${course.title}"?`);
    if (!confirmed) return;

    const courseId = course._id || course.id;

    try {
      const updated = await apiRequest(
        `/courses/${courseId}`,
        "PUT",
        { ...course, status: "archived" },
        token,
        onLogout,
        onForbidden
      );
      const updatedCourse = updated.course || updated;
      setCourses(courses.map((c) => ((c._id || c.id) === courseId ? updatedCourse : c)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h3>Courses Management</h3>

      {/* Button to load courses */}
      <button onClick={handleLoadCourses} disabled={isLoading}>
        {isLoading ? "Loading..." : "Load Courses"}
      </button>

      {/* Combined Local Filters */}
      <div>
        <label>Category: </label>
        <input
          type="text"
          placeholder="Filter by category..."
          value={categoryFilter === "all" ? "" : categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value || "all")}
        />

        <label> Status: </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Error or Empty States */}
      {error && <p>{error}</p>}
      {!isLoading && filteredCourses.length === 0 && <p>No courses found.</p>}

      {/* Courses Table */}
      {filteredCourses.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course._id || course.id}>
                <td>{course.title}</td>
                <td>{course.category}</td>
                <td>{course.level}</td>
                <td>{course.status}</td>
                <td>
                  <button onClick={() => handleEditClick(course)}>Edit</button>
                  {course.status !== "archived" && (
                    <button onClick={() => handleArchiveCourse(course)}>Archive</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />

      {/* Create / Edit Course Form */}
      <h4>{editingCourseId ? "Edit Course" : "Add New Course"}</h4>
      {formError && <p>{formError}</p>}

      <form onSubmit={handleSaveCourse}>
        <div>
          <label>Title: </label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Category: </label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div>
          <label>Level: </label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label>Status: </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <button type="submit">{editingCourseId ? "Update Course" : "Create Course"}</button>
        {editingCourseId && (
          <button type="button" onClick={handleCancelEdit}>Cancel</button>
        )}
      </form>
    </div>
  );
}

export default CoursesManager;