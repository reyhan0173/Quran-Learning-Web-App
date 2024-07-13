import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeworkCard = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/quran-explorer');
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-4">
      <div className="flex items-center justify-center container">
        <div className="m-5 group scale-75 h-96 flex justify-center relative">
          {/* Expanding Drawer */}
          <div
            className="absolute rounded-3xl p-5 bg-white shadow-xl drop-shadow-2xl h-96 w-72 z-10 transition-transform transform translate-x-24 group-hover:translate-x-32 opacity-90 group-hover:opacity-100"
          >
            <div className="pl-5 pr-3">
              <div className="">
                <h1 className="uppercase text-2xl font-bold text-teal-800">Nazirah</h1>
              </div>

              <ul className="list-none my-4 p-3 text-sm space-y-2">
                <li><strong>Date:</strong> 1/1/2023</li>
                <li><strong>Surah:</strong> Al-Fatiha</li>
                <li><strong>Juzz:</strong> 1</li>
                <li><strong>Ayahs:</strong> 7</li>
                <li><strong>Repetitions:</strong> 3</li>
                <li><strong>Recitor:</strong> Mishary Alafasy</li>
                <li><strong>Notes:</strong> Focus on pronunciation</li>
              </ul>

              {/* Button at the Bottom Right */}
              <div className="absolute bottom-4 right-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                  onClick={handleButtonClick}
                >
                  Open Quran ->
                </button>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div
            className="rounded-3xl shadow-xl drop-shadow py-10 h-96 w-72 z-20 bg-teal-600 group-hover:z-0 transition-transform">
            <div className="h-3/5 w-full bg-cover bg-center"
                 style={{backgroundImage: `url(https://png.pngtree.com/png-clipart/20210321/original/pngtree-vector-quran-icon-png-image_6143183.jpg)`}}></div>
            <div className="text-center mt-4 px-4">
              <h1 className="uppercase text-2xl font-bold text-white font-serif tracking-wider">
                Nazirah
              </h1>
            </div>
          </div>
        </div>

        <div className="m-5 group scale-75 h-96 flex justify-center relative">
          {/* Expanding Drawer */}
          <div
            className="absolute rounded-3xl p-5 bg-white shadow-xl drop-shadow-2xl h-96 w-72 z-10 transition-transform transform translate-x-24 group-hover:translate-x-32 opacity-90 group-hover:opacity-100"
          >
            <div className="pl-5 pr-3">
              <div className="">
                <h1 className="uppercase text-2xl font-bold text-teal-800">Nazirah</h1>
              </div>

              <ul className="list-none my-4 p-3 text-sm space-y-2">
                <li><strong>Date:</strong> 1/1/2023</li>
                <li><strong>Surah:</strong> Al-Fatiha</li>
                <li><strong>Juzz:</strong> 1</li>
                <li><strong>Ayahs:</strong> 7</li>
                <li><strong>Repetitions:</strong> 3</li>
                <li><strong>Recitor:</strong> Mishary Alafasy</li>
                <li><strong>Notes:</strong> Focus on pronunciation</li>
              </ul>

              {/* Button at the Bottom Right */}
              <div className="absolute bottom-4 right-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                  onClick={handleButtonClick}
                >
                  Open Quran ->
                </button>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div
            className="rounded-3xl shadow-xl drop-shadow py-10 h-96 w-72 z-20 bg-teal-600 group-hover:z-0 transition-transform">
            <div className="h-3/5 w-full bg-cover bg-center"
                 style={{backgroundImage: `url(https://png.pngtree.com/png-clipart/20210321/original/pngtree-vector-quran-icon-png-image_6143183.jpg)`}}></div>
            <div className="text-center mt-4 px-4">
              <h1 className="uppercase text-2xl font-bold text-white font-serif tracking-wider">
                Nazirah
              </h1>
            </div>
          </div>
        </div>

        <div className="m-5 group scale-75 h-96 flex justify-center relative">
          {/* Expanding Drawer */}
          <div
            className="absolute rounded-3xl p-5 bg-white shadow-xl drop-shadow-2xl h-96 w-72 z-10 transition-transform transform translate-x-24 group-hover:translate-x-32 opacity-90 group-hover:opacity-100"
          >
            <div className="pl-5 pr-3">
              <div className="">
                <h1 className="uppercase text-2xl font-bold text-teal-800">Nazirah</h1>
              </div>

              <ul className="list-none my-4 p-3 text-sm space-y-2">
                <li><strong>Date:</strong> 1/1/2023</li>
                <li><strong>Surah:</strong> Al-Fatiha</li>
                <li><strong>Juzz:</strong> 1</li>
                <li><strong>Ayahs:</strong> 7</li>
                <li><strong>Repetitions:</strong> 3</li>
                <li><strong>Recitor:</strong> Mishary Alafasy</li>
                <li><strong>Notes:</strong> Focus on pronunciation</li>
              </ul>

              {/* Button at the Bottom Right */}
              <div className="absolute bottom-4 right-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                  onClick={handleButtonClick}
                >
                  Open Quran ->
                </button>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div
            className="rounded-3xl shadow-xl drop-shadow py-10 h-96 w-72 z-20 bg-teal-600 group-hover:z-0 transition-transform">
            <div className="h-3/5 w-full bg-cover bg-center"
                 style={{backgroundImage: `url(https://png.pngtree.com/png-clipart/20210321/original/pngtree-vector-quran-icon-png-image_6143183.jpg)`}}></div>
            <div className="text-center mt-4 px-4">
              <h1 className="uppercase text-2xl font-bold text-white font-serif tracking-wider">
                Nazirah
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center container">
        <div className="m-5 group scale-75 h-96 flex justify-center relative">
          {/* Expanding Drawer */}
          <div
            className="absolute rounded-3xl p-5 bg-white shadow-xl drop-shadow-2xl h-96 w-72 z-10 transition-transform transform translate-x-24 group-hover:translate-x-32 opacity-90 group-hover:opacity-100"
          >
            <div className="pl-5 pr-3">
              <div className="">
                <h1 className="uppercase text-2xl font-bold text-teal-800">Nazirah</h1>
              </div>

              <ul className="list-none my-4 p-3 text-sm space-y-2">
                <li><strong>Date:</strong> 1/1/2023</li>
                <li><strong>Surah:</strong> Al-Fatiha</li>
                <li><strong>Juzz:</strong> 1</li>
                <li><strong>Ayahs:</strong> 7</li>
                <li><strong>Repetitions:</strong> 3</li>
                <li><strong>Recitor:</strong> Mishary Alafasy</li>
                <li><strong>Notes:</strong> Focus on pronunciation</li>
              </ul>

              {/* Button at the Bottom Right */}
              <div className="absolute bottom-4 right-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                  onClick={handleButtonClick}
                >
                  Open Quran ->
                </button>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div
            className="rounded-3xl shadow-xl drop-shadow py-10 h-96 w-72 z-20 bg-teal-600 group-hover:z-0 transition-transform">
            <div className="h-3/5 w-full bg-cover bg-center"
                 style={{backgroundImage: `url(https://png.pngtree.com/png-clipart/20210321/original/pngtree-vector-quran-icon-png-image_6143183.jpg)`}}></div>
            <div className="text-center mt-4 px-4">
              <h1 className="uppercase text-2xl font-bold text-white font-serif tracking-wider">
                Nazirah
              </h1>
            </div>
          </div>
        </div>

        <div className="m-5 group scale-75 h-96 flex justify-center relative">
          {/* Expanding Drawer */}
          <div
            className="absolute rounded-3xl p-5 bg-white shadow-xl drop-shadow-2xl h-96 w-72 z-10 transition-transform transform translate-x-24 group-hover:translate-x-32 opacity-90 group-hover:opacity-100"
          >
            <div className="pl-5 pr-3">
              <div className="">
                <h1 className="uppercase text-2xl font-bold text-teal-800">Nazirah</h1>
              </div>

              <ul className="list-none my-4 p-3 text-sm space-y-2">
                <li><strong>Date:</strong> 1/1/2023</li>
                <li><strong>Surah:</strong> Al-Fatiha</li>
                <li><strong>Juzz:</strong> 1</li>
                <li><strong>Ayahs:</strong> 7</li>
                <li><strong>Repetitions:</strong> 3</li>
                <li><strong>Recitor:</strong> Mishary Alafasy</li>
                <li><strong>Notes:</strong> Focus on pronunciation</li>
              </ul>

              {/* Button at the Bottom Right */}
              <div className="absolute bottom-4 right-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                  onClick={handleButtonClick}
                >
                  Open Quran ->
                </button>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div
            className="rounded-3xl shadow-xl drop-shadow py-10 h-96 w-72 z-20 bg-teal-600 group-hover:z-0 transition-transform">
            <div className="h-3/5 w-full bg-cover bg-center"
                 style={{backgroundImage: `url(https://png.pngtree.com/png-clipart/20210321/original/pngtree-vector-quran-icon-png-image_6143183.jpg)`}}></div>
            <div className="text-center mt-4 px-4">
              <h1 className="uppercase text-2xl font-bold text-white font-serif tracking-wider">
                Nazirah
              </h1>
            </div>
          </div>
        </div>

        <div className="m-5 group scale-75 h-96 flex justify-center relative">
          {/* Expanding Drawer */}
          <div
            className="absolute rounded-3xl p-5 bg-white shadow-xl drop-shadow-2xl h-96 w-72 z-10 transition-transform transform translate-x-24 group-hover:translate-x-32 opacity-90 group-hover:opacity-100"
          >
            <div className="pl-5 pr-3">
              <div className="">
                <h1 className="uppercase text-2xl font-bold text-teal-800">Nazirah</h1>
              </div>

              <ul className="list-none my-4 p-3 text-sm space-y-2">
                <li><strong>Date:</strong> 1/1/2023</li>
                <li><strong>Surah:</strong> Al-Fatiha</li>
                <li><strong>Juzz:</strong> 1</li>
                <li><strong>Ayahs:</strong> 7</li>
                <li><strong>Repetitions:</strong> 3</li>
                <li><strong>Recitor:</strong> Mishary Alafasy</li>
                <li><strong>Notes:</strong> Focus on pronunciation</li>
              </ul>

              {/* Button at the Bottom Right */}
              <div className="absolute bottom-4 right-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                  onClick={handleButtonClick}
                >
                  Open Quran ->
                </button>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div
            className="rounded-3xl shadow-xl drop-shadow py-10 h-96 w-72 z-20 bg-teal-600 group-hover:z-0 transition-transform">
            <div className="h-3/5 w-full bg-cover bg-center"
                 style={{backgroundImage: `url(https://png.pngtree.com/png-clipart/20210321/original/pngtree-vector-quran-icon-png-image_6143183.jpg)`}}></div>
            <div className="text-center mt-4 px-4">
              <h1 className="uppercase text-2xl font-bold text-white font-serif tracking-wider">
                Nazirah
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeworkCard;
