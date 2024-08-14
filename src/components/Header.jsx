import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { YoutubeContext } from '../context/YoutubeContext';

function Header() {
  const { connectWallet, currentAccount, youtubeContract } = useContext(YoutubeContext);
  return (
    <header className="bg-gray-400 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          DeTube
        </Link>
        
        <nav className="space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link to="upload" className="text-gray-600 hover:text-blue-600">
            Upload
          </Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
            Dashboard
          </Link>

        </nav>
        
        <div>
          {currentAccount ? (
            <span className="text-gray-600">
              Connected: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
            </span>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}


export default Header;