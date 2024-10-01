import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function Table() {
    const navigate = useNavigate();

    return (
      <div className="flex justify-center py-8">
          <div className="overflow-x-auto">
              <div
                className="inline-block min-w-[400px] max-w-[600px] p-4 bg-white border border-gray-400 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-600">
                  <table className="min-w-full text-left text-sm font-light text-gray-900 dark:text-white">
                      <thead className="border-b border-gray-400 font-medium dark:border-gray-600">
                      <tr>
                          <th scope="col" className="px-6 py-4">Name</th>
                          <th scope="col" className="px-6 py-4">Attendance</th>
                          <th scope="col" className="px-6 py-4">Profile</th>
                          <th scope="col" className="px-6 py-4">Quran</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr className="border-b border-gray-400 transition duration-300 ease-in-out hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
                          <td className="whitespace-nowrap px-6 py-4 font-medium">Mark Otto</td>
                          <td className="whitespace-nowrap px-6 py-4">
                              <Link to="/attendance" className="bg-blue-500 text-white px-3 py-1 rounded">Attendance</Link>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                              <Link to="/profile" className="bg-green-500 text-white px-3 py-1 rounded">Profile</Link>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                              {/* Pass studentId and courseId in the URL */}
                              <Link to={`/quran-explorer/1111115/123}`} className="bg-purple-500 text-white px-3 py-1 rounded">
                                  Assign Homework
                              </Link>
                          </td>
                      </tr>
                      <tr className="border-b border-gray-400 transition duration-300 ease-in-out hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
                          <td className="whitespace-nowrap px-6 py-4 font-medium">Jacob Thornton</td>
                          <td className="whitespace-nowrap px-6 py-4">
                              <button
                                onClick={() => navigate('/attendance')}
                                className="bg-blue-500 text-white px-3 py-1 rounded">Attendance
                              </button>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                              <button
                                onClick={() => navigate('/profile')}
                                className="bg-green-500 text-white px-3 py-1 rounded">Profile
                              </button>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                              <button
                                onClick={() => navigate('/quran-explorer')}
                                className="bg-purple-500 text-white px-3 py-1 rounded">Assign Homework
                              </button>
                          </td>
                      </tr>
                      <tr className="border-b border-gray-400 transition duration-300 ease-in-out hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
                          <td className="whitespace-nowrap px-6 py-4 font-medium">Larry Wild</td>
                          <td className="whitespace-nowrap px-6 py-4">
                              <button
                                onClick={() => navigate('/attendance')}
                                className="bg-blue-500 text-white px-3 py-1 rounded">Attendance
                              </button>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                              <button
                                onClick={() => navigate('/profile')}
                                className="bg-green-500 text-white px-3 py-1 rounded">Profile
                              </button>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                              <button
                                onClick={() => navigate('/quran-explorer')}
                                className="bg-purple-500 text-white px-3 py-1 rounded">Assign Homework
                              </button>
                          </td>
                      </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    );
}
