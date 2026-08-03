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
const endImages = [_1end, _2end, _3end, _4end, _5end, _6end];

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SideWrapper = styled(Wrapper)`
  width: 50%;
`;

interface AbsoluteWrapperProps {
  width?: string;
}

const AbsoluteWrapper = styled.div<AbsoluteWrapperProps>`
  position: absolute;
  bottom: 50px;
  padding: 20px;
  width: ${(props) => props.width || "50%"};
  background-color: rgba(5, 70, 0, 0.8);
  border-radius: 10px;
  border: 3px solid #002412;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
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
        backgroundColor: '#ff0000',
        borderRadius: '10px',
        transition: 'width 0.3s ease-in-out'
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

function Mine() {
  const [score, setScore] = useState<number>(0);
  const [showHitImage, setShowHitImage] = useState<boolean>(false);
  const [gameRunning, setGameRunning] = useState<boolean>(false);
  const [startScreenImage, setStartScreenImage] = useState<string>(_ready);
  const [corruptionLevel, setCorruptionLevel] = useState<number>(0);
  const [animationImages, setAnimationImages] = useState<string[]>([swingImages[0], hitImages[0]]);
  const currentSwingImageIndexRef = useRef<number>(0);

  function onHit() {
    if (gameRunning) {
      setScore(prev => prev + 1);
      setCorruptionLevel(prev => Math.min(prev + 20, MAX_CORRUPTION_LEVEL));
      setShowHitImage(true);
      console.log("Hit! currentSwingImageIndexRef.current:", currentSwingImageIndexRef.current, "Score:", score + 1, "Corruption Level:", Math.min(corruptionLevel + 20, MAX_CORRUPTION_LEVEL))
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
    const corruptionDecayInterval = setInterval(() => {
      setCorruptionLevel(prev => Math.max(prev - 1, 0));
    }, 200);
    return () => clearInterval(corruptionDecayInterval);
  }, []);

  useEffect(() => {
    if (corruptionLevel >= MAX_CORRUPTION_LEVEL) {
      setGameRunning(false);
      setStartScreenImage(_lose);
    } else {
      const imageIndex = Math.min(Math.floor(corruptionLevel / MAX_CORRUPTION_LEVEL * swingImages.length), swingImages.length - 1);
      if (imageIndex <= currentSwingImageIndexRef.current) return;
      currentSwingImageIndexRef.current = imageIndex;
      const currentSwingImage = swingImages[imageIndex];
      const currentHitImage = hitImages[imageIndex];
      setAnimationImages([currentSwingImage, currentHitImage]);
    }
  }, [corruptionLevel]);

  const handleTimeUp = useCallback(() => {
    setGameRunning(false);
    setStartScreenImage(endImages[currentSwingImageIndexRef.current]);
  }, [currentSwingImageIndexRef.current]);

  function resetGame() {
    setStartScreenImage(_ready);
    setAnimationImages([swingImages[0], hitImages[0]]);
    setCorruptionLevel(0);
    currentSwingImageIndexRef.current = 0;
    setScore(0);
  }

  function startGame() {
    resetGame();
    setGameRunning(true);
  }

  return (
    <Wrapper>
      {
        gameRunning
          ? <GamePanel
            onHit={onHit}
            onTimeUp={handleTimeUp}
            score={score}
            corruptionLevel={corruptionLevel}
          />
          : <GameMenu onStartGame={startGame} />}
      <SideWrapper>
        {!gameRunning ? (
          <img src={startScreenImage} alt="Start" style={{ height: "100%", width: "auto" }} />
        ) :
          showHitImage ? (
            <img src={animationImages[1]} alt="Hit" style={{ height: "100%", width: "auto" }} />
          ) : (
            <img src={animationImages[0]} alt="Swing" style={{ height: "100%", width: "auto" }} />
          )}
      </SideWrapper>
    </Wrapper>
  );
}

export default Mine;