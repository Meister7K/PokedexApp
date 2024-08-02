/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type PokemonDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'PokemonDetail'>;
};

type PokemonData = {
  name: string;
  height: number;
  weight: number;
  types: Array<{ type: { name: string } }>;
  sprites: { front_default: string };
};

const PokemonDetailScreen: React.FC<PokemonDetailScreenProps> = ({ route }) => {
  const { pokemonName } = route.params;
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);

  useEffect(() => {
    fetchPokemonData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPokemonData = async () => {
    try {
      const response = await axios.get<PokemonData>(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      setPokemonData(response.data);
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    }
  };

  if (!pokemonData) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Image 
        style={styles.image}
        source={{ uri: pokemonData.sprites.front_default }}
      />
      <Text style={styles.name}>{pokemonData.name}</Text>
      <Text>Height: {pokemonData.height}</Text>
      <Text>Weight: {pokemonData.weight}</Text>
      <Text>Types: {pokemonData.types.map(type => type.type.name).join(', ')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default PokemonDetailScreen;