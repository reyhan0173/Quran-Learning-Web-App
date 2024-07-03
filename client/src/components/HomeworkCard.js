import React from 'react';

const HomeworkCard = () => {
  return (
    <div className="container mx-auto my-5 flex justify-center">
      <div className="transform scale-75">
        <div className="relative group">
          {/* Main Card */}
          <div className="rounded-3xl shadow-xl drop-shadow py-10 h-96 w-72 absolute z-20 bg-teal-600">
            <div className="h-3/5 w-full bg-cover bg-center" style={{ backgroundImage: `url(https://png.pngtree.com/png-clipart/20210321/original/pngtree-vector-quran-icon-png-image_6143183.jpg)` }}></div>
            <div className="text-center mt-4 px-4">
              <h1 className="uppercase text-2xl font-bold text-white font-serif tracking-wider">
                Nazirah
              </h1>
            </div>
          </div>

          {/* Expanding Drawer */}
          <div
            className="rounded-3xl p-5 bg-white shadow-xl drop-shadow-2xl h-96 w-72 absolute z-10 top-0 left-16 group-hover:left-32 group-hover:scale-x-96 group-hover:translate-x-32 transition-transform bg-white"
          >
            <div className="absolute top-1/2 -right-4 px-1">
              <i className="fa-solid fa-caret-right text-3xl text-teal-900 group-hover:rotate-90 transition-transform"></i>
            </div>

            <div className="opacity-0 group-hover:opacity-100 pl-5 pr-3 transition-opacity">
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
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                  Open Quran ->
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeworkCard;