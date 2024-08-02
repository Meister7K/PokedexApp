/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type Pokemon = {
  name: string;
  url: string;
};

type MainScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Pokedex'>;
};

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredList, setFilteredList] = useState<Pokemon[]>([]);
  const [searchText, setSearchText] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sortBy, setSortBy] = useState<'name' | 'type'>('name');

  useEffect(() => {
    fetchPokemonList();
  }, []);

  const fetchPokemonList = async () => {
    try {
      const response = await axios.get<{ results: Pokemon[] }>('https://pokeapi.co/api/v2/pokemon?limit=1000');
      setPokemonList(response.data.results);
      setFilteredList(response.data.results);
    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
    }
  };

  const handleSearch = () => {
    const pokemon = filteredList.find(p => p.name.toLowerCase() === searchText.toLowerCase());
    if (pokemon) {
      navigation.navigate('PokemonDetail', { pokemonName: pokemon.name });
    } else {
      alert('Pokemon not found!');
    }
  };

  const handleSort = (sortType: 'name' | 'type') => {
    setSortBy(sortType);
    let sorted = [...filteredList];
    if (sortType === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    // Type sorting would require additional API calls and is left as an exercise
    setFilteredList(sorted);
  };

  const handleFilter = (text: string) => {
    setSearchText(text);
    const filtered = pokemonList.filter(pokemon => 
      pokemon.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const handlePokemonPress = (pokemonName: string) => {
    setSearchText(pokemonName);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={handleFilter}
        placeholder="Search Pokemon"
      />
      <Button title="Search" onPress={handleSearch} />
      <View style={styles.sortButtons}>
        <Button title="Sort by Name" onPress={() => handleSort('name')} />
        <Button title="Sort by Type" onPress={() => handleSort('type')} />
      </View>
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePokemonPress(item.name)}>
            <Text style={styles.item}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default MainScreen;

function alert(_arg0: string) {
    throw new Error('Function not implemented.');
}
