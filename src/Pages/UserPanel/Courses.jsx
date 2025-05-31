import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';

const Courses = ({ courses }) => {
  const navigate = useNavigate();

  const handleEditClick = (courseId) => {
    navigate(`/edit-course/${courseId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">My Courses</h2>
        <button
          onClick={() => navigate('/create-course')}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:translate-y-[-2px] transition"
        >
          Create Course
        </button>
      </div>
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li key={course.id} className="p-4 border rounded-lg mb-4 shadow">
              <div>
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p>{course.description}</p>
                <p>Duration: {course.duration}</p>
                <p>Level: {course.level}</p>
                <button
                  onClick={() => handleEditClick(course.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2 flex items-center"
                >
                  <Edit size={16} className="mr-2" /> Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Courses;