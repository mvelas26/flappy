'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './page.module.css';

export default function Home() {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState('start');
  const [corruptionLevel, setCorruptionLevel] = useState(0);
  
  // Power-up states
  const [invincible, setInvincible] = useState(false);
  const [invincibleTimer, setInvincibleTimer] = useState(0);
  const [megaMushroom, setMegaMushroom] = useState(false);
  const [megaMushroomTimer, setMegaMushroomTimer] = useState(0);
  const [fireFlower, setFireFlower] = useState(false);
  const [fireFlowerTimer, setFireFlowerTimer] = useState(0);
  const [tetrisLineClear, setTetrisLineClear] = useState(false);
  const [tetrisLineClearTimer, setTetrisLineClearTimer] = useState(0);
  const [pacmanEnergizer, setPacmanEnergizer] = useState(false);
  const [pacmanEnergizerTimer, setPacmanEnergizerTimer] = useState(0);
  const [zeldaTriforce, setZeldaTriforce] = useState(false);
  const [zeldaTriforceTimer, setZeldaTriforceTimer] = useState(0);
  const [sonicRings, setSonicRings] = useState(false);
  const [sonicRingsTimer, setSonicRingsTimer] = useState(0);
  const [slowTime, setSlowTime] = useState(false);
  const [slowTimeTimer, setSlowTimeTimer] = useState(0);
  const [miniBird, setMiniBird] = useState(false);
  const [miniBirdTimer, setMiniBirdTimer] = useState(0);
  
  // Game environment themes
  const [gameTheme, setGameTheme] = useState('normal');
  const themeTimerRef = useRef(null);
  
  // Visual corruption effects
  const [showGlitchBanner, setShowGlitchBanner] = useState(false);
  const [showScreenTearing, setShowScreenTearing] = useState(false);
  const [showCorruptedCursor, setShowCorruptedCursor] = useState(false);
  const [showBsod, setShowBsod] = useState(false);
  const [showCorruptedImage, setShowCorruptedImage] = useState(false);
  const [corruptedImageStyle, setCorruptedImageStyle] = useState({});
  const [invertColors, setInvertColors] = useState(false);
  const [mirrorMode, setMirrorMode] = useState(false);
  const [pixelated, setPixelated] = useState(false);
  const [scanlines, setScanlines] = useState(false);
  
  // Game constants
  const [gravity, setGravity] = useState(0.3);
  const [jumpForce, setJumpForce] = useState(-6);
  const [pipeWidth, setPipeWidth] = useState(60);
  const [pipeGap, setPipeGap] = useState(200);
  const [pipeSpeed, setPipeSpeed] = useState(1.5);
  const [birdSize, setBirdSize] = useState(15);
  
  // Chaos elements
  const [flyingPipes, setFlyingPipes] = useState([]);
  const [movingPipes, setMovingPipes] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [fireballs, setFireballs] = useState([]);
  
  // Game objects
  const birdRef = useRef({
    x: 100,
    y: 250,
    velocity: 0,
    radius: 15
  });
  
  const pipesRef = useRef([]);
  const frameRef = useRef();
  const scoreRef = useRef(0);

  // All possible power-ups
  const allPowerUps = [
    { name: '🍄 MEGA MUSHROOM', icon: '🍄', effect: 'mario', color: '#FF4444', duration: 6, description: 'Touch pipes to destroy them!' },
    { name: '🔥 FIRE FLOWER', icon: '🔥', effect: 'fire', color: '#FF8800', duration: 6, description: 'Shoot fireballs to kill enemies!' },
    { name: '⭐ STAR', icon: '⭐', effect: 'invincible', color: '#FFD700', duration: 5, description: 'Invincibility!' },
    { name: '⬜ LINE CLEAR', icon: '⬜', effect: 'tetris', color: '#00FFFF', duration: 5, description: 'Clear a line!' },
    { name: '⚪ ENERGIZER', icon: '⚪', effect: 'pacman', color: '#FFFF00', duration: 6, description: 'Invincible!' },
    { name: '👻 GHOST', icon: '👻', effect: 'ghost', color: '#FF00FF', duration: 5, description: 'Phase through pipes!' },
    { name: '🔺 TRIFORCE', icon: '🔺', effect: 'zelda', color: '#FFD700', duration: 4, description: 'Warp to safety!' },
    { name: '💍 SUPER RINGS', icon: '💍', effect: 'sonic', color: '#FFD700', duration: 5, description: 'Speed boost!' },
    { name: '⏱️ SLOW TIME', icon: '⏱️', effect: 'slow', color: '#00FF00', duration: 4, description: 'Slow down pipes!' },
    { name: '📏 MINI BIRD', icon: '📏', effect: 'mini', color: '#FF00FF', duration: 5, description: 'Smaller bird!' },
  ];

  // Timer effects
  useEffect(() => {
    let interval;
    if (invincible && invincibleTimer > 0) {
      interval = setInterval(() => {
        setInvincibleTimer(prev => {
          if (prev <= 1) {
            setInvincible(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [invincible, invincibleTimer]);

  useEffect(() => {
    let interval;
    if (megaMushroom && megaMushroomTimer > 0) {
      interval = setInterval(() => {
        setMegaMushroomTimer(prev => {
          if (prev <= 1) {
            setMegaMushroom(false);
            setBirdSize(15);
            birdRef.current.radius = 15;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [megaMushroom, megaMushroomTimer]);

  useEffect(() => {
    let interval;
    if (fireFlower && fireFlowerTimer > 0) {
      interval = setInterval(() => {
        setFireFlowerTimer(prev => {
          if (prev <= 1) {
            setFireFlower(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [fireFlower, fireFlowerTimer]);

  useEffect(() => {
    let interval;
    if (tetrisLineClear && tetrisLineClearTimer > 0) {
      interval = setInterval(() => {
        setTetrisLineClearTimer(prev => {
          if (prev <= 1) {
            setTetrisLineClear(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tetrisLineClear, tetrisLineClearTimer]);

  useEffect(() => {
    let interval;
    if (pacmanEnergizer && pacmanEnergizerTimer > 0) {
      interval = setInterval(() => {
        setPacmanEnergizerTimer(prev => {
          if (prev <= 1) {
            setPacmanEnergizer(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pacmanEnergizer, pacmanEnergizerTimer]);

  useEffect(() => {
    let interval;
    if (zeldaTriforce && zeldaTriforceTimer > 0) {
      interval = setInterval(() => {
        setZeldaTriforceTimer(prev => {
          if (prev <= 1) {
            setZeldaTriforce(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [zeldaTriforce, zeldaTriforceTimer]);

  useEffect(() => {
    let interval;
    if (sonicRings && sonicRingsTimer > 0) {
      interval = setInterval(() => {
        setSonicRingsTimer(prev => {
          if (prev <= 1) {
            setSonicRings(false);
            setPipeSpeed(1.5);
            setInvincible(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sonicRings, sonicRingsTimer]);

  useEffect(() => {
    let interval;
    if (slowTime && slowTimeTimer > 0) {
      interval = setInterval(() => {
        setSlowTimeTimer(prev => {
          if (prev <= 1) {
            setSlowTime(false);
            setPipeSpeed(1.5);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [slowTime, slowTimeTimer]);

  useEffect(() => {
    let interval;
    if (miniBird && miniBirdTimer > 0) {
      interval = setInterval(() => {
        setMiniBirdTimer(prev => {
          if (prev <= 1) {
            setMiniBird(false);
            setBirdSize(15);
            birdRef.current.radius = 15;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [miniBird, miniBirdTimer]);

  // Change theme randomly
  const changeTheme = useCallback(() => {
    const themeNames = ['normal', 'mario', 'tetris', 'pacman', 'zelda', 'sonic'];
    const randomTheme = themeNames[Math.floor(Math.random() * themeNames.length)];
    setGameTheme(randomTheme);
    
    if (themeTimerRef.current) {
      clearTimeout(themeTimerRef.current);
    }
    
    const nextThemeTime = 8000 + Math.random() * 7000;
    themeTimerRef.current = setTimeout(() => {
      if (gameState === 'playing') {
        changeTheme();
      }
    }, nextThemeTime);
    
  }, [gameState]);

  // Spawn random power-up
  const spawnRandomPowerUp = useCallback((parentPipe) => {
    const randomIndex = Math.floor(Math.random() * allPowerUps.length);
    const powerUpTemplate = allPowerUps[randomIndex];
    
    const gapCenterY = parentPipe.topHeight + pipeGap / 2;
    
    const powerUp = {
      id: Date.now() + Math.random(),
      name: powerUpTemplate.name,
      icon: powerUpTemplate.icon,
      effect: powerUpTemplate.effect,
      pipeId: parentPipe.id,
      x: parentPipe.x + pipeWidth / 2,
      y: gapCenterY + (Math.random() * 30 - 15),
      size: 22,
      color: powerUpTemplate.color,
      duration: powerUpTemplate.duration,
      collected: false,
    };
    
    setPowerUps(prev => [...prev, powerUp]);
    
    setTimeout(() => {
      setPowerUps(prev => prev.filter(p => p.id !== powerUp.id));
    }, 5000);
  }, [pipeWidth, pipeGap]);

  // Spawn enemy
  const spawnEnemy = useCallback(() => {
    const enemies_list = [
      { name: '👾', size: 22, color: '#FF00FF', speed: 2 + Math.random() * 2, health: 1, points: 100 },
      { name: '👻', size: 20, color: '#FFFFFF', speed: 1.5 + Math.random() * 2, health: 1, points: 100 },
      { name: '🐢', size: 20, color: '#00FF00', speed: 1 + Math.random() * 2, health: 1, points: 100 },
      { name: '🦇', size: 15, color: '#800080', speed: 3 + Math.random() * 2, health: 1, points: 100 },
      { name: '🐉', size: 25, color: '#FFAA00', speed: 1.5 + Math.random() * 2, health: 2, points: 200 },
      { name: '🦅', size: 18, color: '#8B4513', speed: 2.5 + Math.random() * 2, health: 1, points: 100 },
    ];
    
    const enemyType = enemies_list[Math.floor(Math.random() * enemies_list.length)];
    
    const direction = Math.random() > 0.5 ? 1 : -1;
    const startX = direction > 0 ? -30 : 530;
    const y = Math.random() * 400 + 50;
    
    const enemy = {
      id: Date.now() + Math.random(),
      name: enemyType.name,
      x: startX,
      y: y,
      size: enemyType.size,
      color: enemyType.color,
      speed: enemyType.speed * direction,
      health: enemyType.health,
      points: enemyType.points,
    };
    
    setEnemies(prev => [...prev, enemy]);
  }, []);

  // Spawn fireball (for fire flower)
  const spawnFireball = useCallback(() => {
    const fireball = {
      id: Date.now() + Math.random(),
      x: birdRef.current.x + 30,
      y: birdRef.current.y,
      vx: 8,
      size: 10,
      color: '#FF8800',
    };
    
    setFireballs(prev => [...prev, fireball]);
    
    // Remove after 1 second
    setTimeout(() => {
      setFireballs(prev => prev.filter(f => f.id !== fireball.id));
    }, 1000);
  }, []);

  // Spawn flying pipes
  const spawnFlyingPipes = useCallback(() => {
    const numPipes = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numPipes; i++) {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const startX = direction > 0 ? -50 : 550;
      const y = Math.random() * 400 + 50;
      
      const pipe = {
        id: Date.now() + i + Math.random(),
        x: startX,
        y: y,
        width: 30 + Math.random() * 20,
        height: 60 + Math.random() * 40,
        vx: (2 + Math.random() * 3) * direction,
        rotation: Math.random() * 30,
        rotationSpeed: (Math.random() - 0.5) * 3,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      };
      
      setFlyingPipes(prev => [...prev, pipe]);
    }
  }, []);

  // Spawn moving pipes
  const spawnMovingPipes = useCallback(() => {
    const numPipes = Math.floor(Math.random() * 2) + 1;
    
    for (let i = 0; i < numPipes; i++) {
      const pipe = {
        id: Date.now() + i + Math.random(),
        x: 500,
        y: 0,
        width: pipeWidth,
        topHeight: 100 + Math.random() * 150,
        gap: pipeGap,
        speed: pipeSpeed,
        moveSpeed: 0.5 + Math.random() * 1.5,
        moveRange: 30 + Math.random() * 50,
        direction: 1,
      };
      
      setMovingPipes(prev => [...prev, pipe]);
    }
  }, [pipeWidth, pipeGap, pipeSpeed]);

  // Apply power-up effects
  const applyPowerUp = useCallback((powerUp) => {
    switch(powerUp.effect) {
      case 'mario': // Mushroom - touch pipes to destroy them
        setMegaMushroom(true);
        setMegaMushroomTimer(powerUp.duration);
        setBirdSize(30);
        birdRef.current.radius = 30;
        break;
        
      case 'fire': // Fire Flower - shoot fireballs
        setFireFlower(true);
        setFireFlowerTimer(powerUp.duration);
        break;
        
      case 'invincible':
        setInvincible(true);
        setInvincibleTimer(powerUp.duration);
        break;
        
      case 'tetris':
        setTetrisLineClear(true);
        setTetrisLineClearTimer(powerUp.duration);
        
        const clearY = birdRef.current.y;
        setFlyingPipes(prev => prev.filter(pipe => Math.abs(pipe.y - clearY) > 40));
        setMovingPipes(prev => prev.filter(pipe => 
          Math.abs(pipe.topHeight - clearY) > 40 && 
          Math.abs(pipe.topHeight + pipe.gap - clearY) > 40
        ));
        setEnemies(prev => prev.filter(enemy => Math.abs(enemy.y - clearY) > 30));
        break;
        
      case 'pacman':
        setPacmanEnergizer(true);
        setPacmanEnergizerTimer(powerUp.duration);
        setInvincible(true);
        setInvincibleTimer(powerUp.duration);
        break;
        
      case 'ghost':
        setInvincible(true);
        setInvincibleTimer(powerUp.duration);
        break;
        
      case 'zelda':
        setZeldaTriforce(true);
        setZeldaTriforceTimer(powerUp.duration);
        const safeY = 100 + Math.random() * 300;
        birdRef.current.y = safeY;
        break;
        
      case 'sonic':
        setSonicRings(true);
        setSonicRingsTimer(powerUp.duration);
        setInvincible(true);
        setInvincibleTimer(powerUp.duration);
        setPipeSpeed(3.0);
        break;
        
      case 'slow':
        setSlowTime(true);
        setSlowTimeTimer(powerUp.duration);
        setPipeSpeed(0.5);
        break;
        
      case 'mini':
        setMiniBird(true);
        setMiniBirdTimer(powerUp.duration);
        setBirdSize(8);
        birdRef.current.radius = 8;
        break;
        
      default:
        setInvincible(true);
        setInvincibleTimer(powerUp.duration || 4);
    }
  }, []);

  // Trigger chaos on score milestones
  useEffect(() => {
    if (gameState === 'playing' && score > 0 && score % 5 === 0) {
      const newLevel = Math.floor(score / 5) * 5;
      setCorruptionLevel(newLevel);
      
      const numChaos = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numChaos; i++) {
        const chaosType = Math.floor(Math.random() * 4);
        
        setTimeout(() => {
          if (gameState !== 'playing') return;
          
          switch(chaosType) {
            case 0:
              spawnFlyingPipes();
              break;
            case 1:
              spawnMovingPipes();
              break;
            case 2:
              spawnEnemy();
              break;
            case 3:
              if (pipesRef.current.length > 0) {
                const randomPipe = pipesRef.current[Math.floor(Math.random() * pipesRef.current.length)];
                spawnRandomPowerUp(randomPipe);
              }
              break;
          }
        }, i * 300);
      }
      
      if (Math.random() < 0.25) {
        changeTheme();
      }
      
      if (Math.random() < 0.3) {
        addRandomVisualCorruption();
      }
    }
  }, [score, gameState, spawnFlyingPipes, spawnMovingPipes, spawnEnemy, spawnRandomPowerUp, changeTheme]);

  const addRandomVisualCorruption = useCallback(() => {
    const effects = [
      () => setInvertColors(true),
      () => setMirrorMode(true),
      () => setPixelated(true),
      () => setScanlines(true),
      () => setShowGlitchBanner(true),
      () => setShowScreenTearing(true),
      () => setShowCorruptedCursor(true),
      () => showRandomCorruptedImage(),
    ];
    
    const effect = effects[Math.floor(Math.random() * effects.length)];
    effect();
    
    setTimeout(() => {
      setInvertColors(false);
      setMirrorMode(false);
      setPixelated(false);
      setScanlines(false);
      setShowGlitchBanner(false);
      setShowScreenTearing(false);
      setShowCorruptedCursor(false);
    }, 3000);
  }, []);

  const showRandomCorruptedImage = useCallback(() => {
    const styles = {
      top: `${Math.random() * 70 + 10}%`,
      left: `${Math.random() * 70 + 10}%`,
      width: `${Math.random() * 200 + 100}px`,
      transform: `rotate(${Math.random() * 20 - 10}deg) scale(${Math.random() * 0.5 + 0.8})`,
      filter: `hue-rotate(${Math.random() * 360}deg)`,
    };
    
    setCorruptedImageStyle(styles);
    setShowCorruptedImage(true);
    
    setTimeout(() => {
      setShowCorruptedImage(false);
    }, 3000);
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing' && !showBsod) {
      birdRef.current.velocity = jumpForce;
      
      // Shoot fireball if fire flower is active
      if (fireFlower) {
        spawnFireball();
      }
    } else if (gameState === 'start' && !showBsod) {
      setGameState('playing');
      setGameStarted(true);
      birdRef.current.velocity = jumpForce;
    }
  }, [gameState, jumpForce, showBsod, fireFlower, spawnFireball]);

  const resetGame = useCallback(() => {
    birdRef.current = {
      x: 100,
      y: 250,
      velocity: 0,
      radius: 15
    };
    pipesRef.current = [];
    setScore(0);
    scoreRef.current = 0;
    setCorruptionLevel(0);
    setFlyingPipes([]);
    setMovingPipes([]);
    setEnemies([]);
    setPowerUps([]);
    setFireballs([]);
    
    setInvincible(false);
    setInvincibleTimer(0);
    setMegaMushroom(false);
    setMegaMushroomTimer(0);
    setFireFlower(false);
    setFireFlowerTimer(0);
    setTetrisLineClear(false);
    setTetrisLineClearTimer(0);
    setPacmanEnergizer(false);
    setPacmanEnergizerTimer(0);
    setZeldaTriforce(false);
    setZeldaTriforceTimer(0);
    setSonicRings(false);
    setSonicRingsTimer(0);
    setSlowTime(false);
    setSlowTimeTimer(0);
    setMiniBird(false);
    setMiniBirdTimer(0);
    
    setGameTheme('normal');
    setBirdSize(15);
    setGameState('playing');
    setGameStarted(true);
    
    setShowGlitchBanner(false);
    setShowScreenTearing(false);
    setShowCorruptedCursor(false);
    setShowBsod(false);
    setShowCorruptedImage(false);
    setInvertColors(false);
    setMirrorMode(false);
    setPixelated(false);
    setScanlines(false);
    
    setGravity(0.3);
    setJumpForce(-6);
    setPipeWidth(60);
    setPipeGap(200);
    setPipeSpeed(1.5);
    
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(gameLoop);
    }
  }, []);

  const handleGameOver = useCallback(() => {
    const isProtected = invincible || megaMushroom || sonicRings || pacmanEnergizer;
    
    if (isProtected) {
      return;
    }
    
    setGameOver(true);
    setGameState('gameOver');
    
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
    }
  }, [highScore, invincible, megaMushroom, sonicRings, pacmanEnergizer]);

  const updateGame = useCallback(() => {
    if (gameState !== 'playing' || showBsod) return;

    const bird = birdRef.current;
    
    // Update bird physics
    bird.velocity += gravity;
    bird.y += bird.velocity;
    
    // Check boundaries
    if (bird.y < 0) {
      bird.y = 0;
      bird.velocity = 0;
    } else if (bird.y > 500) {
      if (!invincible && !megaMushroom && !sonicRings && !pacmanEnergizer) {
        handleGameOver();
      } else {
        bird.y = 480;
        bird.velocity = -5;
      }
    }
    
    // Update normal pipes
    const pipes = pipesRef.current;
    
    if (pipes.length === 0 || pipes[pipes.length - 1].x < 300) {
      let pipeHeight = Math.random() * 150 + 100;
      const newPipe = {
        id: Date.now() + Math.random(),
        x: 500,
        topHeight: pipeHeight,
        bottomY: pipeHeight + pipeGap,
      };
      pipes.push(newPipe);
      
      // 30% chance to spawn power-up
      if (Math.random() < 0.3) {
        spawnRandomPowerUp(newPipe);
      }
    }
    
    // Check pipe collisions and destruction (MUSHROOM POWER-UP)
    for (let i = pipes.length - 1; i >= 0; i--) {
      const pipe = pipes[i];
      pipe.x -= pipeSpeed;
      
      // Check if bird touches pipe while mushroom is active
      if (megaMushroom) {
        if (bird.x + bird.radius > pipe.x && 
            bird.x - bird.radius < pipe.x + pipeWidth) {
          
          // Destroy the pipe and give points
          pipes.splice(i, 1);
          setScore(prev => prev + 50); // Bonus points for destroying pipe
          scoreRef.current += 50;
          
          // Also remove any power-ups attached to this pipe
          setPowerUps(prev => prev.filter(p => p.pipeId !== pipe.id));
          continue;
        }
      }
      
      if (!pipe.passed && pipe.x < bird.x) {
        pipe.passed = true;
        setScore(prev => prev + 1);
        scoreRef.current += 1;
      }
      
      if (pipe.x + pipeWidth < 0) {
        setPowerUps(prev => prev.filter(p => p.pipeId !== pipe.id));
        pipes.splice(i, 1);
      }
    }
    
    // Update power-ups position
    setPowerUps(prev => prev.map(powerUp => {
      const parentPipe = pipes.find(p => p.id === powerUp.pipeId);
      if (parentPipe) {
        return {
          ...powerUp,
          x: parentPipe.x + pipeWidth / 2
        };
      }
      return powerUp;
    }).filter(powerUp => {
      return pipes.some(p => p.id === powerUp.pipeId);
    }));
    
    // Check power-up collisions
    setPowerUps(prev => {
      const remaining = [];
      for (const powerUp of prev) {
        if (!powerUp.collected) {
          const dx = bird.x - powerUp.x;
          const dy = bird.y - powerUp.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < bird.radius + powerUp.size / 2) {
            powerUp.collected = true;
            applyPowerUp(powerUp);
          } else {
            remaining.push(powerUp);
          }
        }
      }
      return remaining;
    });
    
    // Update fireballs
    setFireballs(prev => prev.map(fireball => ({
      ...fireball,
      x: fireball.x + fireball.vx
    })).filter(fireball => fireball.x < 600));
    
    // Check fireball collisions with enemies
    setFireballs(prev => {
      const remainingFireballs = [];
      for (const fireball of prev) {
        let hit = false;
        setEnemies(enemyList => {
          const updatedEnemies = [];
          for (const enemy of enemyList) {
            const dx = fireball.x - enemy.x;
            const dy = fireball.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < fireball.size + enemy.size / 2) {
              // Hit enemy
              hit = true;
              if (enemy.health > 1) {
                // Enemy has multiple health
                updatedEnemies.push({ ...enemy, health: enemy.health - 1 });
              } else {
                // Enemy defeated - add points
                setScore(prev => prev + enemy.points);
                scoreRef.current += enemy.points;
              }
            } else {
              updatedEnemies.push(enemy);
            }
          }
          return updatedEnemies;
        });
        
        if (!hit) {
          remainingFireballs.push(fireball);
        }
      }
      return remainingFireballs;
    });
    
    // Check flying pipes collisions and destruction (MUSHROOM POWER-UP)
    setFlyingPipes(prev => {
      const remaining = [];
      for (const pipe of prev) {
        // Update position
        pipe.x += pipe.vx;
        pipe.rotation += pipe.rotationSpeed;
        
        // Check if bird touches flying pipe while mushroom is active
        if (megaMushroom) {
          if (bird.x + bird.radius > pipe.x && 
              bird.x - bird.radius < pipe.x + pipe.width) {
            if (bird.y - bird.radius < pipe.y + pipe.height/2 ||
                bird.y + bird.radius > pipe.y + pipe.height/2) {
              // Destroy the pipe
              setScore(prev => prev + 30);
              scoreRef.current += 30;
              continue; // Skip adding to remaining (destroy it)
            }
          }
        }
        
        // Keep pipe if within bounds
        if (pipe.x > -100 && pipe.x < 600) {
          remaining.push(pipe);
        }
      }
      return remaining;
    });
    
    // Check moving pipes collisions and destruction (MUSHROOM POWER-UP)
    setMovingPipes(prev => {
      const remaining = [];
      for (const pipe of prev) {
        // Update position
        const newY = pipe.y + pipe.moveSpeed * pipe.direction;
        if (Math.abs(newY) > pipe.moveRange) {
          pipe.direction *= -1;
        }
        
        pipe.x -= pipe.speed;
        pipe.y += pipe.moveSpeed * pipe.direction;
        pipe.topHeight += pipe.moveSpeed * pipe.direction;
        
        // Check if bird touches moving pipe while mushroom is active
        if (megaMushroom) {
          if (bird.x + bird.radius > pipe.x && 
              bird.x - bird.radius < pipe.x + pipe.width) {
            const topPipeY = pipe.topHeight;
            const bottomPipeY = pipe.topHeight + pipe.gap;
            
            if (bird.y - bird.radius < topPipeY || 
                bird.y + bird.radius > bottomPipeY) {
              // Destroy the pipe
              setScore(prev => prev + 40);
              scoreRef.current += 40;
              continue; // Skip adding to remaining (destroy it)
            }
          }
        }
        
        // Keep pipe if within bounds
        if (pipe.x + pipeWidth > 0) {
          remaining.push(pipe);
        }
      }
      return remaining;
    });
    
    // Update enemies
    setEnemies(prev => prev.map(enemy => ({
      ...enemy,
      x: enemy.x + enemy.speed
    })).filter(enemy => enemy.x > -50 && enemy.x < 550));
    
    // Check collisions (if not protected and not mushroom)
    const isProtected = invincible || sonicRings || pacmanEnergizer;
    
    if (!isProtected && !megaMushroom) {
      // Normal pipe collisions (only if not mushroom)
      for (const pipe of pipes) {
        if (bird.x + bird.radius > pipe.x && 
            bird.x - bird.radius < pipe.x + pipeWidth) {
          if (bird.y - bird.radius < pipe.topHeight || 
              bird.y + bird.radius > pipe.bottomY) {
            handleGameOver();
          }
        }
      }
      
      // Flying pipe collisions
      for (const pipe of flyingPipes) {
        if (bird.x + bird.radius > pipe.x && 
            bird.x - bird.radius < pipe.x + pipe.width) {
          if (bird.y - bird.radius < pipe.y + pipe.height/2 ||
              bird.y + bird.radius > pipe.y + pipe.height/2) {
            handleGameOver();
          }
        }
      }
      
      // Moving pipe collisions
      for (const pipe of movingPipes) {
        if (bird.x + bird.radius > pipe.x && 
            bird.x - bird.radius < pipe.x + pipe.width) {
          const topPipeY = pipe.topHeight;
          const bottomPipeY = pipe.topHeight + pipe.gap;
          
          if (bird.y - bird.radius < topPipeY || 
              bird.y + bird.radius > bottomPipeY) {
            handleGameOver();
          }
        }
      }
      
      // Enemy collisions
      for (const enemy of enemies) {
        const dx = bird.x - enemy.x;
        const dy = bird.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < bird.radius + enemy.size / 2) {
          handleGameOver();
        }
      }
    }
    
    // Update bird size
    if (megaMushroom) {
      bird.radius = 30;
    } else if (miniBird) {
      bird.radius = 8;
    } else {
      bird.radius = 15;
    }
    
  }, [gameState, gravity, pipeSpeed, pipeGap, pipeWidth, invincible, megaMushroom, sonicRings, pacmanEnergizer, miniBird, handleGameOver, applyPowerUp, spawnRandomPowerUp]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const bird = birdRef.current;
    const pipes = pipesRef.current;
    
    // Theme colors
    let bgColor1, bgColor2, pipeColor, pipeCapColor, textColor;
    
    switch(gameTheme) {
      case 'mario':
        bgColor1 = '#6B8CFF'; bgColor2 = '#4A6FFF'; pipeColor = '#4CAF50'; pipeCapColor = '#2E7D32'; textColor = '#FFD700';
        break;
      case 'tetris':
        bgColor1 = '#000000'; bgColor2 = '#111111'; pipeColor = '#00FFFF'; pipeCapColor = '#00CCCC'; textColor = '#00FF00';
        break;
      case 'pacman':
        bgColor1 = '#000022'; bgColor2 = '#000033'; pipeColor = '#FFFF00'; pipeCapColor = '#FFAA00'; textColor = 'white';
        break;
      case 'zelda':
        bgColor1 = '#2A5230'; bgColor2 = '#1E3B24'; pipeColor = '#C0C0C0'; pipeCapColor = '#8B8970'; textColor = '#FFD700';
        break;
      case 'sonic':
        bgColor1 = '#00A2E8'; bgColor2 = '#0080C0'; pipeColor = '#FFD700'; pipeCapColor = '#FFAA00'; textColor = '#FFFFFF';
        break;
      default:
        bgColor1 = '#87CEEB'; bgColor2 = '#98D8E8'; pipeColor = '#228B22'; pipeCapColor = '#006400'; textColor = 'white';
    }
    
    // Apply visual corruptions
    if (invertColors) ctx.filter = 'invert(100%)';
    if (pixelated) ctx.imageSmoothingEnabled = false;
    if (mirrorMode) {
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
    }
    
    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, bgColor1);
    gradient.addColorStop(1, bgColor2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw normal pipes
    for (const pipe of pipes) {
      ctx.fillStyle = pipeColor;
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
      ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
      
      ctx.fillStyle = pipeCapColor;
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, pipeWidth + 10, 30);
      ctx.fillRect(pipe.x - 5, pipe.bottomY, pipeWidth + 10, 30);
      
      // Highlight pipes when mushroom is active
      if (megaMushroom) {
        ctx.strokeStyle = '#FF4444';
        ctx.lineWidth = 3;
        ctx.strokeRect(pipe.x - 5, pipe.topHeight - 30, pipeWidth + 10, 30);
        ctx.strokeRect(pipe.x - 5, pipe.bottomY, pipeWidth + 10, 30);
      }
    }
    
    // Draw flying pipes
    for (const pipe of flyingPipes) {
      ctx.save();
      ctx.translate(pipe.x + pipe.width/2, pipe.y + pipe.height/2);
      ctx.rotate(pipe.rotation * Math.PI / 180);
      ctx.fillStyle = pipe.color;
      ctx.fillRect(-pipe.width/2, -pipe.height/2, pipe.width, pipe.height);
      
      // Highlight when mushroom is active
      if (megaMushroom) {
        ctx.strokeStyle = '#FF4444';
        ctx.lineWidth = 3;
        ctx.strokeRect(-pipe.width/2, -pipe.height/2, pipe.width, pipe.height);
      }
      
      ctx.restore();
    }
    
    // Draw moving pipes
    for (const pipe of movingPipes) {
      ctx.fillStyle = pipeColor;
      ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.topHeight);
      ctx.fillRect(pipe.x, pipe.topHeight + pipe.gap, pipe.width, canvas.height - pipe.topHeight - pipe.gap);
      
      ctx.fillStyle = pipeCapColor;
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, pipe.width + 10, 30);
      ctx.fillRect(pipe.x - 5, pipe.topHeight + pipe.gap, pipe.width + 10, 30);
      
      // Highlight when mushroom is active
      if (megaMushroom) {
        ctx.strokeStyle = '#FF4444';
        ctx.lineWidth = 3;
        ctx.strokeRect(pipe.x - 5, pipe.topHeight - 30, pipe.width + 10, 30);
        ctx.strokeRect(pipe.x - 5, pipe.topHeight + pipe.gap, pipe.width + 10, 30);
      }
    }
    
    // Draw power-ups
    for (const powerUp of powerUps) {
      ctx.save();
      ctx.translate(powerUp.x, powerUp.y);
      
      const scale = 1 + Math.sin(Date.now() * 0.01) * 0.2;
      ctx.scale(scale, scale);
      
      ctx.shadowColor = powerUp.color;
      ctx.shadowBlur = 20;
      ctx.font = `${powerUp.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = powerUp.color;
      ctx.fillText(powerUp.icon, 0, 0);
      
      ctx.restore();
    }
    
    // Draw enemies
    for (const enemy of enemies) {
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      
      ctx.shadowColor = enemy.color;
      ctx.shadowBlur = 15;
      
      // Show health for enemies with >1 health
      if (enemy.health > 1) {
        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`❤️${enemy.health}`, -10, -enemy.size);
      }
      
      ctx.font = `${enemy.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = enemy.color;
      ctx.fillText(enemy.name, 0, 0);
      
      ctx.restore();
    }
    
    // Draw fireballs
    for (const fireball of fireballs) {
      ctx.save();
      ctx.translate(fireball.x, fireball.y);
      
      ctx.shadowColor = fireball.color;
      ctx.shadowBlur = 15;
      ctx.fillStyle = fireball.color;
      ctx.beginPath();
      ctx.arc(0, 0, fireball.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#FFFF00';
      ctx.beginPath();
      ctx.arc(0, 0, fireball.size/2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
    
    // Draw bird
    ctx.save();
    ctx.translate(bird.x, bird.y);
    
    if (megaMushroom) {
      ctx.shadowColor = '#FF4444';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#FF6B6B';
    } else if (fireFlower) {
      ctx.shadowColor = '#FF8800';
      ctx.shadowBlur = 25;
      ctx.fillStyle = '#FFA500';
    } else if (sonicRings) {
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 25;
      ctx.fillStyle = '#0000FF';
    } else if (pacmanEnergizer) {
      const flash = Math.sin(Date.now() * 0.02) > 0 ? '#FFFF00' : '#FFFFFF';
      ctx.fillStyle = flash;
    } else if (zeldaTriforce) {
      ctx.fillStyle = '#FFD700';
    } else if (tetrisLineClear) {
      ctx.fillStyle = '#00FFFF';
    } else if (invincible) {
      const hue = (Date.now() * 0.1) % 360;
      ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#FFD700';
    } else {
      ctx.fillStyle = '#FFD700';
    }
    
    ctx.beginPath();
    ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(megaMushroom ? 8 : 5, megaMushroom ? -8 : -5, megaMushroom ? 8 : 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(megaMushroom ? 12 : 7, megaMushroom ? -12 : -7, megaMushroom ? 3 : 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(megaMushroom ? 25 : 15, 0);
    ctx.lineTo(megaMushroom ? 40 : 25, megaMushroom ? -10 : -5);
    ctx.lineTo(megaMushroom ? 40 : 25, megaMushroom ? 10 : 5);
    ctx.closePath();
    ctx.fill();
    
    // Mushroom cap effect
    if (megaMushroom) {
      ctx.fillStyle = '#FF4444';
      ctx.beginPath();
      ctx.ellipse(0, -15, 15, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(-5, -18, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(5, -18, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
    
    // Draw scanlines
    if (scanlines) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 1);
      }
    }
    
    ctx.restore(); // Restore from mirror
    
    // Draw UI
    ctx.save();
    
    ctx.fillStyle = textColor;
    ctx.font = 'bold 48px Arial';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    ctx.textAlign = 'center';
    ctx.fillText(`${score}`, canvas.width / 2, 70);
    
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = 'gold';
    ctx.textAlign = 'right';
    ctx.fillText(`🏆 ${highScore}`, canvas.width - 20, 40);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.fillText(`🎮 ${gameTheme.toUpperCase()}`, 20, 40);
    
    // Power-up timers
    let yPos = 100;
    if (megaMushroom) {
      ctx.fillStyle = '#FF4444';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`🍄 MUSHROOM: ${megaMushroomTimer}s - TOUCH TO DESTROY!`, 20, yPos);
      yPos += 25;
    }
    if (fireFlower) {
      ctx.fillStyle = '#FF8800';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`🔥 FIRE: ${fireFlowerTimer}s - SPACE TO SHOOT!`, 20, yPos);
      yPos += 25;
    }
    if (sonicRings) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`💍 SUPER: ${sonicRingsTimer}s`, 20, yPos);
      yPos += 25;
    }
    if (pacmanEnergizer) {
      ctx.fillStyle = '#FFFF00';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`⚪ ENERGIZER: ${pacmanEnergizerTimer}s`, 20, yPos);
      yPos += 25;
    }
    if (zeldaTriforce) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`🔺 TRIFORCE: ${zeldaTriforceTimer}s`, 20, yPos);
      yPos += 25;
    }
    if (tetrisLineClear) {
      ctx.fillStyle = '#00FFFF';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`⬜ LINE: ${tetrisLineClearTimer}s`, 20, yPos);
      yPos += 25;
    }
    if (slowTime) {
      ctx.fillStyle = '#00FF00';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`⏱️ SLOW: ${slowTimeTimer}s`, 20, yPos);
      yPos += 25;
    }
    if (miniBird) {
      ctx.fillStyle = '#FF00FF';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`📏 MINI: ${miniBirdTimer}s`, 20, yPos);
      yPos += 25;
    }
    if (invincible && !megaMushroom && !sonicRings && !pacmanEnergizer) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`✨ INVINCIBLE: ${invincibleTimer}s`, 20, yPos);
    }
    
    ctx.restore();
    
    // Draw start screen
    if (gameState === 'start') {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';    
      
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText('Press SPACE to Start', canvas.width / 2, 360);
      ctx.restore();
    }
    
    // Draw game over screen
    if (gameState === 'gameOver') {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'white';
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, 200);
      
      ctx.font = '48px Arial';
      ctx.fillStyle = 'gold';
      ctx.fillText(`${score}`, canvas.width / 2, 280);
      
      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(`Best: ${highScore}`, canvas.width / 2, 330);
      ctx.fillText(`Chaos Level: ${corruptionLevel}%`, canvas.width / 2, 360);
      
      ctx.font = '24px Arial';
      ctx.fillText('Press SPACE to Try Again', canvas.width / 2, 430);
      ctx.restore();
    }
  }, [gameState, score, highScore, corruptionLevel, gameTheme, invincible, invincibleTimer, megaMushroom, megaMushroomTimer, fireFlower, fireFlowerTimer, tetrisLineClear, tetrisLineClearTimer, pacmanEnergizer, pacmanEnergizerTimer, zeldaTriforce, zeldaTriforceTimer, sonicRings, sonicRingsTimer, slowTime, slowTimeTimer, miniBird, miniBirdTimer, flyingPipes, movingPipes, enemies, powerUps, fireballs, invertColors, mirrorMode, pixelated, scanlines, pipeWidth]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!showBsod) {
      updateGame();
      drawGame();
    }
    frameRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, drawGame, showBsod]);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [gameLoop]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (showBsod) {
          setShowBsod(false);
          resetGame();
        } else if (gameState === 'playing') {
          jump();
        } else if (gameState === 'gameOver') {
          resetGame();
        } else if (gameState === 'start') {
          setGameState('playing');
          jump();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, jump, resetGame, showBsod]);

  // Handle touch
  const handleCanvasClick = useCallback(() => {
    if (showBsod) {
      setShowBsod(false);
      resetGame();
    } else if (gameState === 'playing') {
      jump();
    } else if (gameState === 'gameOver') {
      resetGame();
    } else if (gameState === 'start') {
      setGameState('playing');
      jump();
    }
  }, [gameState, jump, resetGame, showBsod]);

  return (
    <div className={`${styles.container} ${showCorruptedCursor ? styles.corruptedCursor : ''}`}>
      
      {/* Glitch Banner */}
      {showGlitchBanner && (
        <div className={styles.glitchBanner}>
          <marquee behavior="alternate" scrollamount="15">
            ⚡ MUSHROOM: TOUCH PIPES TO DESTROY • FIRE FLOWER: SPACE TO SHOOT ⚡
          </marquee>
        </div>
      )}
      
      {/* Screen Tearing */}
      {showScreenTearing && (
        <div className={styles.screenTear}>
          <div className={styles.tearLine}></div>
          <div className={styles.tearLine}></div>
          <div className={styles.tearLine}></div>
        </div>
      )}
      
      {/* Corrupted Image */}
      {showCorruptedImage && (
        <div 
          className={styles.corruptedImageContainer}
          style={corruptedImageStyle}
        >
          <img 
            src="https://docs.google.com/s/0xy1kIDeE"
            alt="像 景小 鸟"
            className={styles.corruptedImage}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '🖼️ IMG_1001.jpg';
            }}
          />
          <div className={styles.imageGlitch}></div>
        </div>
      )}
      
      {/* Fake BSOD */}
      {showBsod && (
        <div className={styles.bsod}>
          <div className={styles.bsodContent}>
            <div className={styles.bsodEmoji}>:(</div>
            <div className={styles.bsodMessage}>
              CHAOS EDITION OVERLOAD
            </div>
            <div className={styles.bsodCode}>
              Score: {score} • Best: {highScore}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Game Canvas */}
      <h1 className={styles.title}>
        Flappy Bird Chaos Edition 
        {megaMushroom ? '🍄' : fireFlower ? '🔥' : sonicRings ? '💍' : pacmanEnergizer ? '⚪' : zeldaTriforce ? '🔺' : tetrisLineClear ? '⬜' : invincible ? '✨' : miniBird ? '📏' : slowTime ? '⏱️' : ''}
      </h1>
      
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onClick={handleCanvasClick}
        className={`${styles.gameCanvas} ${showScreenTearing ? styles.tearing : ''}`}
      />
      
      <p className={styles.instructions}>
        {showBsod && 'Press SPACE to restart...'}
        {!showBsod && gameState === 'start' && 'Press SPACE or Click to Start'}
        {!showBsod && gameState === 'playing' && 'Press SPACE or Click to Fly'}
        {!showBsod && gameState === 'gameOver' && 'Press SPACE or Click to Try Again'}
      </p>
      
      {/* Stats badges */}
      <div className={styles.scoreBadges}>
        <div className={styles.scoreBadge}>
          <span>🎯 SCORE</span>
          <strong>{score}</strong>
        </div>
        <div className={styles.scoreBadge}>
          <span>🏆 BEST</span>
          <strong>{highScore}</strong>
        </div>
        <div className={styles.scoreBadge} style={{ background: 'rgba(255,0,255,0.3)' }}>
          <span>⚡ CHAOS</span>
          <strong>{corruptionLevel}%</strong>
        </div>
        <div className={styles.scoreBadge} style={{ 
          background: gameTheme === 'mario' ? 'rgba(255,68,68,0.3)' :
                      gameTheme === 'tetris' ? 'rgba(0,255,255,0.3)' :
                      gameTheme === 'pacman' ? 'rgba(255,255,0,0.3)' :
                      gameTheme === 'zelda' ? 'rgba(255,215,0,0.3)' :
                      gameTheme === 'sonic' ? 'rgba(0,0,255,0.3)' :
                      'rgba(255,255,255,0.3)'
        }}>
          <span>🎮 THEME</span>
          <strong>{gameTheme.toUpperCase()}</strong>
        </div>
      </div>
      
      {/* Active power-up indicator */}
      {(megaMushroom || fireFlower || invincible || sonicRings || pacmanEnergizer || zeldaTriforce || tetrisLineClear || slowTime || miniBird) && (
        <div className={styles.activePowerUp}>
          {megaMushroom && '🍄 MUSHROOM ACTIVE - Touch pipes to destroy! +50 points!'}
          {fireFlower && '🔥 FIRE FLOWER ACTIVE - Press SPACE to shoot!'}
          {sonicRings && '💍 SUPER RINGS ACTIVE'}
          {pacmanEnergizer && '⚪ ENERGIZER ACTIVE'}
          {zeldaTriforce && '🔺 TRIFORCE ACTIVE'}
          {tetrisLineClear && '⬜ LINE CLEAR ACTIVE'}
          {slowTime && '⏱️ SLOW TIME ACTIVE'}
          {miniBird && '📏 MINI BIRD ACTIVE'}
          {invincible && !megaMushroom && !fireFlower && !sonicRings && !pacmanEnergizer && '✨ INVINCIBLE ACTIVE'}
        </div>
      )}
    </div>
  );
}