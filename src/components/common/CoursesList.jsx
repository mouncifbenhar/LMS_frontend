function CoursesList({ courses, isLoading, error, onRefresh }) {
  return (
    <div>
      <h2>Courses</h2>
      <button onClick={onRefresh} disabled={isLoading}>
        Refresh Courses
      </button>

      {isLoading && <p>Loading courses...</p>}
      {error ? (
        <p>{error}</p>
      ) : (
        !isLoading && courses.length === 0 && <p>No courses available right now.</p>
      )}

      {courses.map((course) => (
        <div key={course._id}>
          <h3>{course.title}</h3>
          <p>Category: {course.category}</p>
          <p>Level: {course.level}</p>
          <p>Estimated duration: {course.estimatedDuration}</p>
          <p>{course.shortDescription}</p>
        </div>
      ))}
    </div>
  );
}

export default CoursesList;
