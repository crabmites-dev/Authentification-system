import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Check, X, ArrowLeft } from 'lucide-react';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); 
  const navigate = useNavigate(); 

  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const length = newPassword.length >= 6;
  const uppercase = /[A-Z]/.test(newPassword);
  const lowercase = /[a-z]/.test(newPassword);
  const number = /[0-9]/.test(newPassword);
  const special = /[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\\/]/.test(newPassword);

  const strength = [length, uppercase, lowercase, number, special].filter(Boolean).length;

  const text = () => {
    if (newPassword.length === 0) return '';
    if (strength <= 2) return 'Très Faible';
    if (strength <= 4) return 'Moyen';
    return 'Fort';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (strength < 5) {
      setError("Veuillez respecter tous les critères de sécurité.");
      return;
    }

    if (!token) {
      setError("Le jeton de sécurité est manquant. Veuillez recliquer sur le lien de votre email.");
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/auth/reset-password', {
        token,
        newPassword
      });

      setSuccess("Mot de passe réinitialisé avec succès ! Redirection...");
      setNewPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      const serverMessage = err.response?.data?.message || "Une erreur est survenue lors de la réinitialisation.";
      setError(serverMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[radial-gradient(circle,_#1a4d32_0%,_#0d1f14_100%)] font-sans m-0 overflow-hidden">
      
      <div className="bg-[#19261e]/85 p-10 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full max-w-[400px] text-center border border-white/5">
        
        <h2 className="text-[#2ecc71] mb-4 text-3xl font-bold">Nouveau mot de passe</h2>
        
        <p className="text-white/60 mb-6 text-sm">
          Saisissez votre nouveau mot de passe sécurisé pour mettre à jour vos accès.
        </p>
        
        {error && <p className="text-red-400 bg-red-500/10 p-2 rounded mb-4 text-sm border border-red-500/20">{error}</p>}
        {success && <p className="text-[#2ecc71] bg-[#2ecc71]/10 p-2 rounded mb-4 text-sm border border-[#2ecc71]/20">{success}</p>}

        <form onSubmit={handleSubmit} className="text-left">
          
          <div className="flex items-center bg-[#16241c] rounded-md mb-3 px-4 py-3 border border-[#253a2d] focus-within:border-[#2ecc71] transition-colors">
            <Lock className="text-white/50 mr-3 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-transparent border-none text-white outline-none w-full text-base"
              required
            />
          </div>

          {/* Indicateur de force dynamique */}
          {newPassword.length > 0 && (
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
                  {length ? <Check className="w-3.5 h-3.5 text-[#2ecc71]" /> : <X className="w-3.5 h-3.5 text-red-400" />}
                  <span className={length ? 'text-white/80' : 'text-white/40'}>Au moins 6 caractères</span>
                </div>
                <div className="flex items-center gap-2">
                  {uppercase ? <Check className="w-3.5 h-3.5 text-[#2ecc71]" /> : <X className="w-3.5 h-3.5 text-red-400" />}
                  <span className={hasUppercase ? 'text-white/80' : 'text-white/40'}>Une lettre majuscule</span>
                </div>
                <div className="flex items-center gap-2">
                  {lowercase ? <Check className="w-3.5 h-3.5 text-[#2ecc71]" /> : <X className="w-3.5 h-3.5 text-red-400" />}
                  <span className={lowercase ? 'text-white/80' : 'text-white/40'}>Une lettre minuscule</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasNumber ? <Check className="w-3.5 h-3.5 text-[#2ecc71]" /> : <X className="w-3.5 h-3.5 text-red-400" />}
                  <span className={number ? 'text-white/80' : 'text-white/40'}>Un chiffre</span>
                </div>
                <div className="flex items-center gap-2">
                  {special ? <Check className="w-3.5 h-3.5 text-[#2ecc71]" /> : <X className="w-3.5 h-3.5 text-red-400" />}
                  <span className={special ? 'text-white/80' : 'text-white/40'}>Un caractère spécial</span>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="bg-gradient-to-r from-[#2ecc71] to-[#27ae60] hover:from-[#27ae60] hover:to-[#219653] text-white border-none rounded-md py-3 w-full text-base font-bold cursor-pointer transition-all shadow-md active:scale-[0.98]">
            Enregistrer le mot de passe
          </button>
        </form>

        <div className="mt-8">
          <Link to="/login" className="inline-flex items-center text-white/50 hover:text-white text-sm no-underline transition-colors gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;
