import React, { useState, useEffect } from 'react';
import { Container, Snackbar, Alert, Button, Box } from '@mui/material';
import GrilleMot from './grillemots';
import { obtenirMotAleatoire, listeMots } from '../utils/mots';
import Clavier from './clavier';

const Jeu: React.FC = () => {
  const [motCible, setMotCible] = useState<string>('');
  const [essais, setEssais] = useState<string[]>([]);
  const [essaiCourant, setEssaiCourant] = useState<string>('');
  const [finPartie, setFinPartie] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    severity: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    setMotCible(obtenirMotAleatoire());
  }, []);

  useEffect(() => {
    if (essais.length > 0) {
      verifierDernierEssai();
    }
  }, [essais]);

  // FC : Fonction pour recommencer la partie, réinitialise les variables et sélectionne un nouveau mot
  const recommencerPartie = () => {
    setMotCible(obtenirMotAleatoire());
    setEssais([]);
    setEssaiCourant("");
    setFinPartie(false);
    setMessage({text:"Recommencé!", severity: 'success'});
  }

  const verifierDernierEssai = () => {
    const dernierEssai = essais[essais.length - 1];
    //if (dernierEssai === motCible) {
    // FC : localeCompare pour comparer en ignorant les accents
    if(dernierEssai.localeCompare(motCible.toLowerCase(), 'fr', {sensitivity: 'base'}) == 0) {
      setFinPartie(true);
      setMessage({
        text: 'Félicitations ! Vous avez trouvé le mot !',
        severity: 'success',
      });
    } else if (essais.length >= 6) {
      setFinPartie(true);
      setMessage({
        text: `Dommage ! Le mot était "${motCible}".`,
        severity: 'error',
      });
    }
  };

  const handleSoumettreEssai = () => {
    if (essaiCourant.length !== 5) {
      setMessage({
        text: 'Le mot doit comporter 5 lettres.',
        severity: 'error',
      });
      return;
    }
    //FC : Parcourir la liste pour trouver le mot peu importe les accents
    let estDansListe = false;
    for (let i = 0; i < listeMots.length; i++) {
      if (listeMots[i].localeCompare(essaiCourant.toLowerCase(),'fr', {sensitivity: 'base'})==0) {
        estDansListe = true;
      }
    }
    if (
      !estDansListe
      //FC : La liste de mots est entièrement en lettres miniscules, on peut juste prendre l'essai actuel
      /*!listeMots.includes(essaiCourant.toLowerCase()
        essaiCourant.charAt(0).toUpperCase() +
        essaiCourant.slice(1).toLowerCase()
      )*/
    ) {
      setMessage({
        text: "Ce mot n'est pas dans la liste.",
        severity: 'error',
      });
      return;
    }
    setEssais([...essais, essaiCourant.toUpperCase()]);
    setEssaiCourant('');
  };

//FC : J'ai ajouté un bouton pour recommencer la partie
  return (
    <Container maxWidth="sm">
      <GrilleMot
        essais={essais}
        motCible={motCible}
        essaiCourant={essaiCourant}
      />
      <Clavier
        essaiCourant={essaiCourant}
        setEssaiCourant={setEssaiCourant}
        onEnter={handleSoumettreEssai}
        inactif={finPartie}
      />
      
      {message && (
        <Snackbar open autoHideDuration={6000} onClose={() => setMessage(null)}>
          <Alert
            onClose={() => setMessage(null)}
            severity={message.severity}
            sx={{ width: '100%' }}
          >
            {message.text}
          </Alert>
        </Snackbar>
      )}
      <Box sx={{display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={recommencerPartie}>
          Redémarrer la partie
        </Button>
      </Box>
      
    </Container>
  );
};

export default Jeu;
