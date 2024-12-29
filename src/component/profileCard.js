"use client"
import React, { useState } from 'react';

const CreateProjectModal = () => {
  const [projectName, setProjectName] = useState('');

  const handleDeploy = () => {
    console.log('Project Name:', projectName);
    console.log('Framework:', framework);
   
  };

  return (
    <div className="flex justify-center items-center bg-black">
      <div className="bg-gray-900 text-blue p-6 rounded-lg shadow-lg ">
        <h5 className="text-xl font-bold mb-2">Create project</h5>
        <p className="text-sm text-gray-400 mb-4">
          Deploy your new project in one-click.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            placeholder="Name of your project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>

        

        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 rounded bg-gray-700 hover:bg-white">
            Cancel
          </button>
          <button
            onClick={handleDeploy}
            className="px-4 py-2 rounded bg-white text-black font-medium hover:bg-gray-200"
          >
            Add Money
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
