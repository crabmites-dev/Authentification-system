import { useState } from 'react';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';


function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      }, { withCredentials: true });

      setSuccess("Connexion réussie ! Bienvenue.");
      console.log("Utilisateur connecté :", response.data);

    } catch (err) {
      const serverMessage = err.response?.data || "Une erreur est survenue lors de la connexion";
      setError(typeof serverMessage === 'object' ? serverMessage.message : serverMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[radial-gradient(circle,_#1a4d32_0%,_#0d1f14_100%)] font-sans m-0 overflow-hidden">
      <div className="bg-[#19261e]/85 p-10 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full max-w-[400px] text-center border border-white/5">
        
        <h2 className="text-[#2ecc71] mb-8 text-3xl font-bold">Connexion</h2>
        
        {error && <p className="text-red-400 bg-red-500/10 p-2 rounded mb-4 text-sm border border-red-500/20">{error}</p>}
        {success && <p className="text-[#2ecc71] bg-[#2ecc71]/10 p-2 rounded mb-4 text-sm border border-[#2ecc71]/20">{success}</p>}

        <form onSubmit={handleSubmit} className="text-left">
          <div className="flex items-center bg-[#16241c] rounded-md mb-5 px-4 py-3 border border-[#253a2d] focus-within:border-[#2ecc71] transition-colors">
            <Mail className="text-white/50 mr-3 w-5 h-5" />
            <input 
              type="email" 
              placeholder="Adresse Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none text-white outline-none w-full text-base"
              required
            />
          </div>

          <div className="flex items-center bg-[#16241c] rounded-md mb-3 px-4 py-3 border border-[#253a2d] focus-within:border-[#2ecc71] transition-colors">
            <Lock className="text-white/50 mr-3 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-none text-white outline-none w-full text-base"
              required
            />
          </div>

          <div className="text-left mb-6">
            <Link to="/forget-password" className="text-[#2ecc71] text-sm no-underline hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <button type="submit" className="bg-gradient-to-r from-[#2ecc71] to-[#27ae60] hover:from-[#27ae60] hover:to-[#219653] text-white border-none rounded-md py-3 w-full text-base font-bold cursor-pointer transition-all shadow-md active:scale-[0.98]">
            Se connecter
          </button>
        </form>

        <span className='text-white/60 text-sm mt-3'>Pas encore de compte ? </span>
          <Link to="/register" className="text-white text-sm no-underline font-bold hover:underline">S'inscrire</Link>

      </div>
    </div>
  );
}

export default Signin;
