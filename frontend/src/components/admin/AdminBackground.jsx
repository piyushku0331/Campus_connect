import React from 'react';
import PropTypes from 'prop-types';

const AdminBackground = ({ enableParticles = true }) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background with vignette */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0A0F2C] via-[#111C44] to-[#1A2759]">
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/20"></div>
      </div>

      {/* Abstract neon wave shapes */}
      <div className="absolute inset-0">
        {/* Wave shape 1 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

        {/* Wave shape 2 */}
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-linear-to-l from-indigo-500/8 to-cyan-500/8 rounded-full blur-2xl"></div>

        {/* Wave shape 3 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-br from-violet-500/6 to-blue-500/6 rounded-full blur-xl"></div>

        {/* Additional blurred blobs */}
        <div className="absolute top-1/6 right-1/6 w-48 h-48 bg-linear-to-t from-purple-400/5 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/6 left-1/6 w-56 h-56 bg-linear-to-b from-blue-400/4 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Optional particle field */}
      {enableParticles && (
        <div className="absolute inset-0">
          {/* Particle 1 */}
          <div className="absolute w-1 h-1 bg-white/20 rounded-full top-1/4 left-1/3"></div>
          {/* Particle 2 */}
          <div className="absolute w-1 h-1 bg-blue-300/15 rounded-full top-3/4 right-1/3"></div>
          {/* Particle 3 */}
          <div className="absolute w-1 h-1 bg-purple-300/10 rounded-full top-1/2 left-1/6"></div>
          {/* Particle 4 */}
          <div className="absolute w-1 h-1 bg-indigo-300/12 rounded-full bottom-1/4 right-1/6"></div>
          {/* Particle 5 */}
          <div className="absolute w-1 h-1 bg-cyan-300/8 rounded-full top-1/6 right-1/2"></div>
        </div>
      )}

      {/* Subtle noise texture overlay for depth */}
      <div className="absolute inset-0 bg-noise opacity-5"></div>
    </div>
  );
};

AdminBackground.propTypes = {
  enableParticles: PropTypes.bool
};

export default AdminBackground;