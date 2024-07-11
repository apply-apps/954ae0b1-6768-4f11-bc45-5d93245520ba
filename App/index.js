// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, Alert, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const CELL_SIZE = 20;
const SPEED = 200;

const getRandomPosition = () => {
    const x = Math.floor(Math.random() * Math.floor(width / CELL_SIZE)) * CELL_SIZE;
    const y = Math.floor(Math.random() * Math.floor((height - CELL_SIZE * 4) / CELL_SIZE)) * CELL_SIZE;
    return { x, y };
};

const useTick = (callback, delay) => {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => {
            savedCallback.current();
        };
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

const SnakeGame = () => {
    const [snake, setSnake] = useState([{ x: 160, y: 160 }]);
    const [direction, setDirection] = useState('RIGHT');
    const [food, setFood] = useState(getRandomPosition());
    const [isGameOver, setIsGameOver] = useState(false);

    const handleGameOver = useCallback(() => {
        Alert.alert('Game Over', 'Your snake is dead!', [{ text: 'Restart', onPress: () => resetGame() }]);
        setIsGameOver(true);
    }, []);

    const moveSnake = useCallback(() => {
        if (isGameOver) return;

        setSnake((prevSnake) => {
            const head = { ...prevSnake[0] };

            if (direction == 'UP') head.y -= CELL_SIZE;
            if (direction == 'DOWN') head.y += CELL_SIZE;
            if (direction == 'LEFT') head.x -= CELL_SIZE;
            if (direction == 'RIGHT') head.x += CELL_SIZE;

            const newSnake = [head, ...prevSnake.slice(0, -1)];

            if (head.x === food.x && head.y === food.y) {
                setFood(getRandomPosition());
                newSnake.push({});
            }

            if (
                head.x < 0 ||
                head.x >= width ||
                head.y < 0 ||
                head.y >= height ||
                newSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
            ) {
                handleGameOver();
            }

            return newSnake;
        });
    }, [direction, isGameOver, food, handleGameOver]);

    useEffect(() => {
        const swipeHandlers = {
            swipeUp: () => setDirection((prevDir) => (prevDir !== 'DOWN' ? 'UP' : prevDir)),
            swipeDown: () => setDirection((prevDir) => (prevDir !== 'UP' ? 'DOWN' : prevDir)),
            swipeLeft: () => setDirection((prevDir) => (prevDir !== 'RIGHT' ? 'LEFT' : prevDir)),
            swipeRight: () => setDirection((prevDir) => (prevDir !== 'LEFT' ? 'RIGHT' : prevDir)),
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') swipeHandlers.swipeUp();
            if (e.key === 'ArrowDown') swipeHandlers.swipeDown();
            if (e.key === 'ArrowLeft') swipeHandlers.swipeLeft();
            if (e.key === 'ArrowRight') swipeHandlers.swipeRight();
        });

        return () => {
            document.removeEventListener('keydown', swipeHandlers);
        };
    }, []);

    useTick(moveSnake, SPEED);

    const resetGame = () => {
        setSnake([{ x: 160, y: 160 }]);
        setDirection('RIGHT');
        setFood(getRandomPosition());
        setIsGameOver(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.gameArea}>
                {snake.map((segment, index) => (
                    <View key={index} style={[styles.snake, { left: segment.x, top: segment.y }]} />
                ))}
                <View style={[styles.food, { left: food.x, top: food.y }]} />
            </View>
            <View style={styles.controlPanel}>
                <TouchableOpacity onPress={() => setDirection('UP')} style={styles.controlButton}><Text>Up</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setDirection('LEFT')} style={styles.controlButton}><Text>Left</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setDirection('RIGHT')} style={styles.controlButton}><Text>Right</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setDirection('DOWN')} style={styles.controlButton}><Text>Down</Text></TouchableOpacity>
            </View>
            <Button title="Restart" onPress={resetGame} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameArea: {
        width: width,
        height: height - CELL_SIZE * 4,
        backgroundColor: '#F0F0F0',
        position: 'relative',
    },
    snake: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'green',
        position: 'absolute',
    },
    food: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'red',
        position: 'absolute',
    },
    controlPanel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 10,
    },
    controlButton: {
        padding: 10,
        backgroundColor: '#DDD',
        margin: 5,
        width: 50,
        alignItems: 'center',
    }
});

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Snake Game</Text>
            <SnakeGame />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
});