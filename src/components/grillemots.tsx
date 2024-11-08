import React from 'react';
import { Grid, Paper } from '@mui/material';

interface GrilleMotsProps {
  essais: string[];
  essaiCourant: string;
  motCible: string;
}

const GrilleMot: React.FC<GrilleMotsProps> = ({
  essais,
  essaiCourant,
  motCible,
}) => {
  //FC : length:6 au lieu de 5 pour avoir 6 essais
  const rows = Array.from({ length: 6 }, (_, i) => {
    const guess =
      essais[i] || (i === essais.length ? essaiCourant.toUpperCase() : "");
    return guess.padEnd(5, ' ');
  });

  const obtenirCouleurLettre = (letter: string, index: number, rowIndex: number) => {
    //FC : ajouter les couleurs juste aux essais envoyés
    if (rowIndex < essais.length) {
      if (!motCible) return 'default';
      //if (motCible[index] === letter) return 'success.main';
      //FC : pour comparer en ignorant les accents
      if (motCible[index].localeCompare(letter, 'fr', {sensitivity: 'base'}) === 0) return 'success.main';
      // FC : encore pour ignorer les accents, façon différente
      let motCibleNormalized = motCible.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (motCibleNormalized.includes(letter)) return 'warning.main';
      return 'grey.500';
    }
    
    return 'grey.200';
  };

  return (
    <Grid container spacing={1} sx={{ marginTop: 2 }}>
      {rows.map((row, rowIndex) => (
        <Grid container item spacing={1} key={rowIndex}>
          {row.split('').map((letter, index) => (
            // FC : ajouté sx={{width:40}} pour pas que la grille grandisse par elle-même
            <Grid item xs={2.4} key={index} sx={{width:40}}>
              <Paper
                sx={{
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  //FC: j'ai rajouté un toLowerCase pour envoyer une lettre minuscule et rajouté le paramètre rowIndex pour ajouter des couleurs juste aux essais soumis
                  backgroundColor: obtenirCouleurLettre(letter.toLowerCase(), index, rowIndex),
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              >
                {letter}
              </Paper>
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default GrilleMot;
