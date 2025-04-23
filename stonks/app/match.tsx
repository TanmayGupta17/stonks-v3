import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Animated,
  Alert
} from 'react-native';

// Stock market terms and definitions
const stockTerms = [
  { term: 'Bull Market', definition: 'A market in which share prices are rising' },
  { term: 'Bear Market', definition: 'A market in which share prices are falling' },
  { term: 'Dividend', definition: 'A portion of company profits paid to shareholders' },
  { term: 'Blue Chip', definition: 'Shares in large, well-established companies' },
  { term: 'IPO', definition: 'Initial Public Offering when a company first sells stock' },
  { term: 'Volume', definition: 'Number of shares traded during a given period' },
  { term: 'Volatility', definition: 'Measure of price fluctuations of a security' },
  { term: 'Market Cap', definition: 'Total value of a company\'s outstanding shares' },
];

const Match = () => {
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [level, setLevel] = useState(1);
  const [termOptions, setTermOptions] = useState<string[]>([]);
  const [definitionOptions, setDefinitionOptions] = useState<string[]>([]);
  const [currentTerm, setCurrentTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);
  const [correctPairs, setCorrectPairs] = useState<string[]>([]);
  const [shake] = useState(new Animated.Value(0));

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  const setupNewRound = () => {
    // Prepare terms for current level (2 pairs for level 1, 3 pairs for level 2, 4 pairs for level 3+)
    const pairsCount = Math.min(Math.max(level + 1, 2), stockTerms.length);
    const shuffledTerms = [...stockTerms].sort(() => 0.5 - Math.random()).slice(0, pairsCount);
    
    const terms = shuffledTerms.map(item => item.term);
    const definitions = shuffledTerms.map(item => item.definition);
    
    setTermOptions(terms.sort(() => 0.5 - Math.random()));
    setDefinitionOptions(definitions.sort(() => 0.5 - Math.random()));
    setCorrectPairs([]);
  };

  useEffect(() => {
    setupNewRound();
  }, [level]);

  const handleTermPress = (term: string) => {
    if (correctPairs.includes(term)) return;
    setSelectedTerm(term);

    // Check if we already have a definition selected
    if (selectedDefinition) {
      // Find definition for this term
      const matchingPair = stockTerms.find(item => item.term === term);
      
      if (matchingPair && matchingPair.definition === selectedDefinition) {
        // Correct match
        setCorrectPairs([...correctPairs, term]);
        setScore(score + 10);
        setSelectedTerm(null);
        setSelectedDefinition(null);
        
        // Check if round is complete
        if (correctPairs.length + 1 === termOptions.length) {
          setTimeout(() => {
            Alert.alert("Round Complete", "Great job! Moving to next level.");
            setLevel(level + 1);
          }, 1000);
        }
      } else {
        // Incorrect match
        shakeAnimation();
        setTimeout(() => {
          setSelectedTerm(null);
          setSelectedDefinition(null);
          setHearts(hearts - 1);
        }, 500);
        
        if (hearts <= 1) {
          setTimeout(() => {
            Alert.alert("Game Over", `Your score: ${score}`, [
              { text: "Try Again", onPress: () => {
                setScore(0);
                setHearts(3);
                setLevel(1);
                setupNewRound();
              }}
            ]);
          }, 1000);
        }
      }
    }
  };

  const handleDefinitionPress = (definition: string) => {
    if (correctPairs.some(term => {
      const pair = stockTerms.find(item => item.term === term);
      return pair && pair.definition === definition;
    })) return;
    
    setSelectedDefinition(definition);

    if (selectedTerm) {
      // Find definition for the selected term
      const matchingPair = stockTerms.find(item => item.term === selectedTerm);
      
      if (matchingPair && matchingPair.definition === definition) {
        // Correct match
        setCorrectPairs([...correctPairs, selectedTerm]);
        setScore(score + 10);
        setSelectedTerm(null);
        setSelectedDefinition(null);
        
        // Check if round is complete
        if (correctPairs.length + 1 === termOptions.length) {
          setTimeout(() => {
            Alert.alert("Round Complete", "Great job! Moving to next level.");
            setLevel(level + 1);
          }, 1000);
        }
      } else {
        // Incorrect match
        shakeAnimation();
        setTimeout(() => {
          setSelectedTerm(null);
          setSelectedDefinition(null);
          setHearts(hearts - 1);
        }, 500);
        
        if (hearts <= 1) {
          setTimeout(() => {
            Alert.alert("Game Over", `Your score: ${score}`, [
              { text: "Try Again", onPress: () => {
                setScore(0);
                setHearts(3);
                setLevel(1);
                setupNewRound();
              }}
            ]);
          }, 1000);
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.levelText}>Level {level}</Text>
          <View style={styles.hearts}>
            {[...Array(hearts)].map((_, i) => (
              <Text key={i} style={styles.heart}>❤️</Text>
            ))}
          </View>
          <Text style={styles.score}>{score}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${(correctPairs.length / termOptions.length) * 100}%` }]} />
        </View>
      </View>

      <Text style={styles.instructionText}>Match the stock market terms with their definitions</Text>

      <Animated.View style={[styles.gameContainer, { transform: [{ translateX: shake }] }]}>
        <View style={styles.termsContainer}>
          {termOptions.map((term) => (
            <TouchableOpacity
              key={term}
              style={[
                styles.termButton,
                correctPairs.includes(term) ? styles.correctButton : {},
                selectedTerm === term ? styles.selectedButton : {}
              ]}
              onPress={() => handleTermPress(term)}
              disabled={correctPairs.includes(term)}
            >
              <Text style={styles.termText}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.definitionsContainer}>
          {definitionOptions.map((definition) => {
            const isCorrect = correctPairs.some(term => {
              const pair = stockTerms.find(item => item.term === term);
              return pair && pair.definition === definition;
            });
            
            return (
              <TouchableOpacity
                key={definition}
                style={[
                  styles.definitionButton,
                  isCorrect ? styles.correctButton : {},
                  selectedDefinition === definition ? styles.selectedButton : {}
                ]}
                onPress={() => handleDefinitionPress(definition)}
                disabled={isCorrect}
              >
                <Text style={styles.definitionText}>{definition}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A3740',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#58CC02',
  },
  hearts: {
    flexDirection: 'row',
  },
  heart: {
    fontSize: 20,
    marginHorizontal: 2,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFDE00',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#1D262C',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#58CC02',
  },
  instructionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  termsContainer: {
    marginBottom: 20,
  },
  definitionsContainer: {
    marginTop: 20,
  },
  termButton: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1F2937',
  },
  definitionButton: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  selectedButton: {
    borderColor: '#FFDE00',
  },
  correctButton: {
    borderColor: '#58CC02',
    backgroundColor: '#3B4A3F',
  },
  termText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  definitionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Match;