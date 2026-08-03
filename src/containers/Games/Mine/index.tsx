import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import _ready from "../../../assets/images/games/mine/ready.jpg";
import _1hit from "../../../assets/images/games/mine/1hit.jpg";
import _1swing from "../../../assets/images/games/mine/1swing.jpg";
import _1end from "../../../assets/images/games/mine/1end.jpg";
import _2hit from "../../../assets/images/games/mine/2hit.jpg";
import _2swing from "../../../assets/images/games/mine/2swing.jpg";
import _2end from "../../../assets/images/games/mine/2end.jpg";
import _3hit from "../../../assets/images/games/mine/3hit.jpg";
import _3swing from "../../../assets/images/games/mine/3swing.jpg";
import _3end from "../../../assets/images/games/mine/3end.jpg";
import _4hit from "../../../assets/images/games/mine/4hit.jpg";
import _4swing from "../../../assets/images/games/mine/4swing.jpg";
import _4end from "../../../assets/images/games/mine/4end.jpg";
import _5hit from "../../../assets/images/games/mine/5hit.jpg";
import _5swing from "../../../assets/images/games/mine/5swing.jpg";
import _5end from "../../../assets/images/games/mine/5end.jpg";
import _6hit from "../../../assets/images/games/mine/6hit.jpg";
import _6swing from "../../../assets/images/games/mine/6swing.jpg";
import _6end from "../../../assets/images/games/mine/6end.jpg";
import _lose from "../../../assets/images/games/mine/lose.png";
import _copperUrl from "../../../assets/images/resources/cooper.png";

const hitImages = [_1hit, _2hit, _3hit, _4hit, _5hit, _6hit];
const swingImages = [_1swing, _2swing, _3swing, _4swing, _5swing, _6swing];
const idleImages = [_1end, _2end, _3end, _4end, _5end, _6end];

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  gap: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SideWrapper = styled(Wrapper)`
  margin-bottom: 15vh;
  height: 80vh;
`;

interface AbsoluteWrapperProps {
  width?: string;
}

const AbsoluteWrapper = styled.div<AbsoluteWrapperProps>`
  position: absolute;
  bottom: 20px;
  padding: 20px;
  width: ${(props) => props.width || "50%"};
  background-color: rgba(5, 70, 0, 0.8);
  border-radius: 10px;
  border: 3px solid #002412;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const BAR_WIDTH = 800;
const BAR_HEIGHT = 40;
const BAR_SIDE_SAFE_MARGIN = 10;
const TARGET_SIDE_SAFE_MARGIN = 30;
const TARGET_DEFAULT_LENGTH = 100;
const MAX_CORRUPTION_LEVEL = 100;

const TopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ResourcesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ResourceDisplay = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 24px;
  color: #000000;
  background-color: rgb(255, 222, 124);
  padding: 5px 10px;
  border-radius: 10px;
  border: 3px solid #002412;
`;

const TimeDisplay = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  font-size: 24px;
  color: #000000;
  background-color: rgb(255, 222, 124);
  padding: 5px 10px;
  border-radius: 10px;
  border: 3px solid #002412;
`;

const BarBackground = styled.div`
  width: ${BAR_WIDTH}px;
  height: ${BAR_HEIGHT}px;
  background-color: #000000;
  border-radius: 10px;
  border: 2px solid #002412;
`;

const Target = styled.div<{ start: number; length: number }>`
  position: relative;
  top: 0;
  left: ${props => props.start}px;
  width: ${props => props.length}px;
  height: ${BAR_HEIGHT - 4}px;
  background-color: #c77100;
  border-radius: 10px;
  border: 2px solid #ffb84d;
`;

const AimLine = styled.div`
  position: relative;
  top: -${BAR_HEIGHT}px;
  width: 10px;
  height: ${BAR_HEIGHT - 4}px;
  background-color: #989898;
  border-radius: 5px;
  border: 2px solid #5c5c5c;
`;

interface TargetDetails {
  start: number;
  length: number;
}

interface TimerProps {
  startTime?: number;
  onTimeUp: () => void;
}

function Timer({ startTime = 30, onTimeUp }: TimerProps) {
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer(prev => {
        if (prev > 0) {
          return prev - 1;
        } else {
          onTimeUp();
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [onTimeUp]);

  const [timer, setTimer] = useState<number>(startTime);
  return (
    <TimeDisplay>{timer}</TimeDisplay>
  );
}

interface GameBarProps {
  onHit: () => void;
}

function GameBar({ onHit }: GameBarProps) {
  const [targetDetails, setTargetDetails] = useState<TargetDetails | null>(null);
  const aimPosition = useRef<number>(0);
  const aimLineRef = useRef<HTMLDivElement>(null);

  function generateTargetDetails() {
    const start = Math.floor(Math.random() * (BAR_WIDTH - TARGET_DEFAULT_LENGTH - 2 * TARGET_SIDE_SAFE_MARGIN)) + TARGET_SIDE_SAFE_MARGIN;
    const length = TARGET_DEFAULT_LENGTH;
    setTargetDetails({ start, length });
  }

  useEffect(() => {
    generateTargetDetails();
  }, []);

  useEffect(() => {
    const aimMoveingInterval = setInterval(() => {
      aimPosition.current = aimPosition.current + 2.2;
      if (aimPosition.current > BAR_WIDTH - (BAR_SIDE_SAFE_MARGIN * 2)) {
        aimPosition.current = BAR_SIDE_SAFE_MARGIN; // Reset to the left side if it goes beyond the bar width
      }
      if (aimLineRef.current) {
        aimLineRef.current.style.left = `${aimPosition.current}px`;
      }
    }, 5);

    return () => {
      clearInterval(aimMoveingInterval);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === " ") {
        shoot();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [targetDetails]);

  function shoot() {
    if (targetDetails) {
      const { start, length } = targetDetails;
      if (aimPosition.current >= start - 5 && aimPosition.current <= start + length + 5) {
        generateTargetDetails();
        onHit();
      }
    }
  }

  return (
    <BarBackground>
      {targetDetails && <Target start={targetDetails.start} length={targetDetails.length} />}
      <AimLine ref={aimLineRef} />
    </BarBackground>
  );
}

interface CorruptionBarProps {
  corruptionLevel: number;
}

function CorruptionBar({ corruptionLevel }: CorruptionBarProps) {
  const barWidth = 300;
  const barHeight = 30;
  const corruptionPercentage = Math.min(corruptionLevel, 100);

  return (
    <div style={{ width: `${barWidth}px`, height: `${barHeight}px`, backgroundColor: '#000000', borderRadius: '10px', border: '2px solid #002412' }}>
      <div style={{
        width: `${(corruptionPercentage / 100) * barWidth}px`,
        height: `${barHeight}px`,
        backgroundColor: '#60009c',
        borderRadius: '8px',
        transition: 'width 0.2s ease-in-out'
      }} />
    </div>
  );
}

interface GameMenuProps {
  onStartGame: () => void;
}

function GameMenu({ onStartGame }: GameMenuProps) {
  return (
    <AbsoluteWrapper width="200px">
      <button onClick={onStartGame}>Start Game</button>
    </AbsoluteWrapper>
  );
}

interface GamePanelProps {
  onHit: () => void;
  onTimeUp: () => void;
  score: number;
  corruptionLevel: number;
}

function GamePanel({ onHit, onTimeUp, score, corruptionLevel }: GamePanelProps) {
  return (
    <AbsoluteWrapper>
      <TopWrapper>
        <ResourcesWrapper>
          <ResourceDisplay>
            <img src={_copperUrl} alt="Copper" style={{ height: "32px", width: "32px" }} />: {score}
          </ResourceDisplay>
        </ResourcesWrapper>
        <Timer startTime={10} onTimeUp={onTimeUp} />
      </TopWrapper>
      <GameBar onHit={onHit} />
      <CorruptionBar corruptionLevel={corruptionLevel} />
    </AbsoluteWrapper>
  );
}

interface GameOverScreenProps {
  score: number;
  resetGame: () => void;
}

function GameOverScreen({ score, resetGame }: GameOverScreenProps) {
  return (
    <AbsoluteWrapper width="300px">
      <h2>Game Over!</h2>
      <h3>The goo got another body!</h3>
      <p>Your Score: {score}</p>
      <button onClick={resetGame}>Restart Game</button>
    </AbsoluteWrapper>
  );
}

interface PreRunScreenProps {
  corruptionLevel: number;
  handleShower: () => void;
  handleGoMining: () => void;
}

function PreRunScreen({ corruptionLevel, handleShower, handleGoMining }: PreRunScreenProps) {
  return (
    <AbsoluteWrapper width="300px">
      <h2>Get Ready!</h2>
      <button onClick={handleShower}>Shower</button>
      <CorruptionBar corruptionLevel={corruptionLevel} />
      <button onClick={handleGoMining}>Go mining</button>
    </AbsoluteWrapper>
  );
}

interface ControlRendererProps {
  gameState: "notStarted" | "pre-run" | "running" | "gameover";
  startGame: () => void;
  resetGame: () => void;
  onHit: () => void;
  handleTimeUp: () => void;
  score: number;
  corruptionLevel: number;
  handleShower: () => void;
  handleGoMining: () => void;
}

function ControlRenderer({
  gameState,
  startGame,
  resetGame,
  onHit,
  handleTimeUp,
  score,
  corruptionLevel,
  handleShower,
  handleGoMining,
}: ControlRendererProps) {
  if (gameState === "notStarted") {
    return <GameMenu onStartGame={startGame} />;
  } else if (gameState === "pre-run") {
    return <PreRunScreen corruptionLevel={corruptionLevel} handleShower={handleShower} handleGoMining={handleGoMining} />;
  } else if (gameState === "running") {
    return <GamePanel onHit={onHit} onTimeUp={handleTimeUp} score={score} corruptionLevel={corruptionLevel} />;
  } else if (gameState === "gameover") {
    return <GameOverScreen score={score} resetGame={resetGame} />;
  }
}

interface RenderImages {
  swing: string;
  hit: string;
  idle: string;
}

function Mine() {
  const [score, setScore] = useState<number>(0);
  const [showHitImage, setShowHitImage] = useState<boolean>(false);
  const [gameRunning, setGameRunning] = useState<boolean>(false);
  const [renderImages, setRenderImages] = useState<RenderImages>({ swing: swingImages[0], hit: hitImages[0], idle: idleImages[0] });
  const [corruptionLevel, setCorruptionLevel] = useState<number>(0);
  const currentSwingImageIndexRef = useRef<number>(0);
  const [gameState, setGameState] = useState<"notStarted" | "pre-run" | "running" | "gameover">("notStarted");

  function onHit() {
    if (gameRunning) {
      setScore(prev => prev + 1);
      setCorruptionLevel(prev => Math.min(prev + 20, MAX_CORRUPTION_LEVEL));
      setShowHitImage(true);
    }
  }

  useEffect(() => {
    if (showHitImage) {
      const timer = setTimeout(() => {
        setShowHitImage(false);
      }, 500); // Show the hit image for 500ms

      return () => clearTimeout(timer);
    }
  }, [showHitImage]);

  useEffect(() => {
    if (corruptionLevel >= MAX_CORRUPTION_LEVEL) {
      setGameRunning(false);
      setRenderImages({ swing: _lose, hit: _lose, idle: _lose });
      setGameState("gameover");
    } else {
      const imageIndex = Math.min(Math.floor(corruptionLevel / MAX_CORRUPTION_LEVEL * swingImages.length), swingImages.length - 1);
      const currentSwingImage = swingImages[imageIndex];
      const currentHitImage = hitImages[imageIndex];
      const currentIdleImage = idleImages[imageIndex];
      setRenderImages({ swing: currentSwingImage, hit: currentHitImage, idle: currentIdleImage })
    }
  }, [corruptionLevel]);

  const handleTimeUp = useCallback(() => {
    setGameRunning(false);
    setGameState("pre-run");
  }, [currentSwingImageIndexRef.current]);

  function resetGame() {
    setRenderImages({ swing: swingImages[0], hit: hitImages[0], idle: _ready });
    setCorruptionLevel(0);
    currentSwingImageIndexRef.current = 0;
    setScore(0);
    setGameState("notStarted");
  }

  function startGame() {
    resetGame();
    setGameRunning(true);
    setGameState("running");
  }

  function handleShower() {
    setCorruptionLevel(prev => Math.max(prev - 30, 0));
  }

  function handleGoMining() {
    setGameState("running");
    setGameRunning(true);
  }

  return (
    <Wrapper>
      <SideWrapper>
        {!gameRunning ? (
          <img src={renderImages.idle} alt="Start" style={{ height: "100%", width: "auto" }} />
        ) :
          showHitImage ? (
            <img src={renderImages.hit} alt="Hit" style={{ height: "100%", width: "auto" }} />
          ) : (
            <img src={renderImages.swing} alt="Swing" style={{ height: "100%", width: "auto" }} />
          )}
      </SideWrapper>
      <ControlRenderer
        gameState={gameState}
        startGame={startGame}
        resetGame={resetGame}
        onHit={onHit}
        handleTimeUp={handleTimeUp}
        score={score}
        corruptionLevel={corruptionLevel}
        handleShower={handleShower}
        handleGoMining={handleGoMining}
      />
    </Wrapper>
  );
}

export default Mine;