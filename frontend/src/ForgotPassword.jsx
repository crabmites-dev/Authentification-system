import { useState } from "react";
import {Mail, ArrowLeft, CloudSync} from "lucide-react";
import {Link} from "react-router-dom"
import axios from "axios";


function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('');
    const [succes, setSucces] = useState('');

    const handleSubmit = async (e)  => {
      e.preventDefault();
      setSucces('');
      setError('');
      
      try {
        const response = await axios.post('http://localhost:3000/api/auth/forget-password', {
          email
        }, {withCredentials: true});
  
        setSucces(`Si le l'email existe un message vous a été envoyé`);
        setEmail('')
  
        setTimeout(() => {
          setSucces('')
        }, 4000);

      } catch (err) {
        const serverMessage = err.response?.data?.message || 'Une erreur est survenue'
        setError(serverMessage)

        setTimeout(() => {
          setError('')
        }, 4000);
      }
    }


    return (
    <div className="flex justify-center items-center h-screen w-screen bg-[radial-gradient(circle,_#1a4d32_0%,_#0d1f14_100%)] font-sans m-0 overflow-hidden">
      
      <div className="bg-[#19261e]/85 p-10 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full max-w-[400px] text-center border border-white/5">
        
        <h2 className="text-[#2ecc71] mb-4 text-3xl font-bold">Mot de passe oublié</h2>
        
        {/* Un petit texte explicatif pour guider l'utilisateur */}
        <p className="text-white/60 mb-6 text-sm">
          Entrez votre adresse email. Nous vous enverrons un lien sécurisé pour créer un nouveau mot de passe.
        </p>
        
        {/* Gestion des messages d'alertes */}
        {error && <p className="text-red-400 bg-red-500/10 p-2 rounded mb-4 text-sm border border-red-500/20">{error}</p>}
        {succes && <p className="text-[#2ecc71] bg-[#2ecc71]/10 p-2 rounded mb-4 text-sm border border-[#2ecc71]/20">{success}</p>}

        <form onSubmit={handleSubmit} className="text-left">
          
          {/* Champ de saisie de l'email */}
          <div className="flex items-center bg-[#16241c] rounded-md mb-6 px-4 py-3 border border-[#253a2d] focus-within:border-[#2ecc71] transition-colors">
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

          {/* Bouton d'action principal */}
          <button type="submit" className="bg-gradient-to-r from-[#2ecc71] to-[#27ae60] hover:from-[#27ae60] hover:to-[#219653] text-white border-none rounded-md py-3 w-full text-base font-bold cursor-pointer transition-all shadow-md active:scale-[0.98]">
            Envoyer le lien
          </button>
        </form>


        <div className="mt-8">
          <Link to= "/reset-password" className="inline-flex items-center text-white/50 hover:text-white text-sm no-underline transition-colors gap-2">
          <CloudSync className="w-4 h-4" />
          Réinitialiser votre mot de passe
          </Link>
        </div>
        {/* Petit bouton discret pour revenir en arrière à la page de connexion */}
        <div className="mt-2">
          <Link to="/login" className="inline-flex items-center text-white/50 hover:text-white text-sm no-underline transition-colors gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;


