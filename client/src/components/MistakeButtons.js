import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faPen, faEraser, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { handleUniversalAddMistake, handleUniversalRemoveMistake } from "../functions/mistakesFunctions";

export default function MistakeButtons() {
  const [isRotated, setIsRotated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 56, y: 50 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const componentWidth = 112;
  const componentHeight = 34;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      const maxX = window.innerWidth - (isRotated ? componentHeight + 45 : componentWidth + 10);
      const maxY = window.innerHeight - (isRotated ? componentWidth - 30: componentHeight + 10);

      const minX = isRotated ? -30 : 10;
      const minY = isRotated ? 45 : 10;

      // Adjust newX and newY to ensure they don't go out of bounds
      setPosition({
        x: Math.max(minX, Math.min(newX, maxX)),
        y: Math.max(minY, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Attach event listeners to window for smoother dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  // Adjust position when rotating
  useEffect(() => {
    const adjustPosition = () => {
      const maxX = window.innerWidth - (isRotated ? componentHeight + 45 : componentWidth + 10);
      const maxY = window.innerHeight - (isRotated ? componentWidth - 30: componentHeight + 10);

      const minX = isRotated ? -30 : 10;
      const minY = isRotated ? 45 : 10;

      setPosition(prev => ({
        x: Math.max(minX, Math.min(prev.x, maxX)),
        y: Math.max(minY, Math.min(prev.y, maxY)),
      }));
    };

    adjustPosition();

    const handleResize = () => {
      adjustPosition();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isRotated]);

  return (
    <div
      className="w-28 flex flex-row z-50 bg-gray-400 rounded"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'pointer',
        transform: isRotated ? 'rotate(-90deg)' : 'rotate(0deg)',
      }}
    >
      <button
        className="text-gray-700 focus:outline-none w-6 border-r-gray-950 border-r-2"
        onMouseDown={handleMouseDown}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <FontAwesomeIcon icon={faEllipsisV} size="lg" />
        <FontAwesomeIcon icon={faEllipsisV} size="lg" />
      </button>

      <button
        className="ayah-remove-mistake-button"
        onClick={() => handleUniversalRemoveMistake()}
        style={{
          transform: isRotated ? 'rotate(90deg)' : 'rotate(0deg)'
        }}
      >
        <FontAwesomeIcon icon={faEraser} size="sm" />
      </button>

      <button
        className="ayah-add-mistake-button"
        onClick={() => handleUniversalAddMistake()}
        style={{
          transform: isRotated ? 'rotate(90deg)' : 'rotate(0deg)'
        }}
      >
        <FontAwesomeIcon icon={faPen} size="sm" />
      </button>

      <button
        className="text-gray-700 focus:outline-none w-6 border-l-gray-950 border-l-2"
        onClick={() => setIsRotated(!isRotated)}
      >
        <FontAwesomeIcon icon={faRedoAlt} size="sm"
           style={{ transform: isRotated ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
      </button>
    </div>
  );
}
