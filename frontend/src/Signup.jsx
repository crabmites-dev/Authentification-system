import { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';


function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\\/]/.test(password);

  const strengthScore = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthText = () => {
    if (password.length === 0) return '';
    if (strengthScore <= 2) return 'Très Faible';
    if (strengthScore <= 4) return 'Moyen';
    return 'Fort';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (strengthScore < 5) {
      setError("Veuillez respecter tous les critères de sécurité pour le mot de passe.");
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/auth/register', {
        username,
        email,
        password
      }, { withCredentials: true });

      setSuccess("Compte créé avec succès !");
      setUsername('');
      setEmail('');
      setPassword('');

      setTimeout(() => {
        setSuccess('')
      }, 4000);

    } catch (err) {
      const serverMessage = err.response?.data?.message || "Une erreur est survenue lors de l'inscription";
      setError(serverMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[radial-gradient(circle,_#1a4d32_0%,_#0d1f14_100%)] font-sans m-0 overflow-hidden">
      
      {/* La Carte d'inscription avec effet de verre transparent */}
      <div className="bg-[#19261e]/85 p-10 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full max-w-[400px] text-center border border-white/5">
        
        <h2 className="text-[#2ecc71] mb-8 text-3xl font-bold">Créer un compte</h2>
        
        {error && <p className="text-red-400 bg-red-500/10 p-2 rounded mb-4 text-sm border border-red-500/20">{error}</p>}
        {success && <p className="text-[#2ecc71] bg-[#2ecc71]/10 p-2 rounded mb-4 text-sm border border-[#2ecc71]/20">{success}</p>}

        <form onSubmit={handleSubmit} className="text-left">
          
          {/* Champ : Nom d'utilisateur */}
          <div className="flex items-center bg-[#16241c] rounded-md mb-5 px-4 py-3 border border-[#253a2d] focus-within:border-[#2ecc71] transition-colors">
            <User className="text-white/50 mr-3 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent border-none text-white outline-none w-full text-base"
              required
            />
          </div>

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

          {password.length > 0 && (
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/40 text-xs">Force du mot de passe</span>
                <span className={`text-xs font-bold ${strengthScore <= 2 ? 'text-red-400' : strengthScore <= 4 ? 'text-yellow-400' : 'text-[#2ecc71]'}`}>
                  {getStrengthText()}
                </span>
              </div>
              
              <div className="grid grid-cols-5 gap-1 mb-4">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div 
                    key={index} 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index < strengthScore 
                        ? strengthScore <= 2 ? 'bg-red-400' : strengthScore <= 4 ? 'bg-yellow-400' : 'bg-[#2ecc71]'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>

              <div className="space-y-1 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  {hasMinLength ? <Check className="w-3.5 h-3.5 text-[#2ecc71]" /> : <X className="w-3.5 h-3.5 text-red-400" />}
                  <span className={hasMinLength ? 'text-white/80' : 'text-white/40'}>Au moins 6 caractères</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasUppercase ? <Check className="w-3.5 h-3.5 text-[#2ecc71]" /> : <X className="w-3.5 h-3.5 text-red-400" />}
                  <span className={hasUppercase ? 'text-white/80' : 'text-white/40'}>Une lettre majuscule</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasLowercase ? <Check className="w-3.5 h-3.5 text-[#2ecc71]" /> : <X className="w-3.5 h-3.5 text-red-400" />}
                  <span className={hasLowercase ? 'text-white/80' : 'text-white/40'}>Une lettre minuscule</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasNumber ? <Check className="w-3.5 h-3.5 text-[#2ecc71]" /> : <X className="w-3.5 h-3.5 text-red-400" />}
                  <span className={hasNumber ? 'text-white/80' : 'text-white/40'}>Un chiffre</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasSpecial ? <Check className="w-3.5 h-3.5 text-[#2ecc71]" /> : <X className="w-3.5 h-3.5 text-red-400" />}
                  <span className={hasSpecial ? 'text-white/80' : 'text-white/40'}>Un caractère spécial</span>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="bg-gradient-to-r from-[#2ecc71] to-[#27ae60] hover:from-[#27ae60] hover:to-[#219653] text-white border-none rounded-md py-3 w-full text-base font-bold cursor-pointer mt-2 transition-all shadow-md active:scale-[0.98]">
            S'inscrire
          </button>
        </form>

        <span className='text-white/60 text-sm mr-2'>Déjà un compte ? </span>
        <Link to="/login" className="text-white no-underline text-sm font-bold hover:underline">Connexion</Link>

      </div>
    </div>
  );
}

export default Signup;
