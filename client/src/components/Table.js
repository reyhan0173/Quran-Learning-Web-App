export function Table() {
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
                                <button onClick="window.location.href='attendance.html?student=1'"
                                        className="bg-blue-500 text-white px-3 py-1 rounded">Attendance
                                </button>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <button onClick="window.location.href='profile.html?student=1'"
                                        className="bg-green-500 text-white px-3 py-1 rounded">Profile
                                </button>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <button onClick="window.location.href='attendance.html?student=1'"
                                        className="bg-purple-500 text-white px-3 py-1 rounded">Assign Homework
                                </button>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-400 transition duration-300 ease-in-out hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
                            <td className="whitespace-nowrap px-6 py-4 font-medium">Jacob Thornton</td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <button onClick="window.location.href='attendance.html?student=2'"
                                        className="bg-blue-500 text-white px-3 py-1 rounded">Attendance
                                </button>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <button onClick="window.location.href='profile.html?student=2'"
                                        className="bg-green-500 text-white px-3 py-1 rounded">Profile
                                </button>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <button onClick="window.location.href='attendance.html?student=1'"
                                        className="bg-purple-500 text-white px-3 py-1 rounded">Assign Homework
                                </button>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-400 transition duration-300 ease-in-out hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
                            <td className="whitespace-nowrap px-6 py-4 font-medium">Larry Wild</td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <button onClick="window.location.href='attendance.html?student=3'"
                                        className="bg-blue-500 text-white px-3 py-1 rounded">Attendance
                                </button>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <button onClick="window.location.href='profile.html?student=3'"
                                        className="bg-green-500 text-white px-3 py-1 rounded">Profile
                                </button>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <button onClick="window.location.href='attendance.html?student=1'"
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