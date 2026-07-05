import { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BAR_WIDTH = 300;
const BAR_SIDE_SAFE_MARGIN = 20;
const TARGET_DEFAULT_LENGTH = 50;

const BarBackground = styled.div`
  width: ${BAR_WIDTH}px;
  height: 20px;
  background-color: #00260a;
  border-radius: 10px;
`

const Target = styled.div<{ start: number; length: number }>`
  position: relative;
  top: 0;
  left: ${props => props.start}px;
  width: ${props => props.length}px;
  height: 20px;
  background-color: #20c720;
`;

const AimLine = styled.div.attrs<{ position: number }>(props => ({
  style: { left: `${props.position}px` },
}))`
  position: relative;
  top: -20px;
  width: 2px;
  height: 20px;
  background-color: red;
`;

interface TargetDetails {
  start: number;
  length: number;
}

function Mine() {
  const [targetDetails, setTargetDetails] = useState<TargetDetails | null>(null);
  const [aimPosition, setAimPosition] = useState<number>(0);

  const [score, setScore] = useState<number>(0);

  function generateTargetDetails() {
    const start = Math.floor(Math.random() * (BAR_WIDTH - TARGET_DEFAULT_LENGTH - 2 * BAR_SIDE_SAFE_MARGIN)) + BAR_SIDE_SAFE_MARGIN;
    const length = TARGET_DEFAULT_LENGTH;
    setTargetDetails({ start, length });
  }

  useEffect(() => {
    generateTargetDetails();
  }, []);

  useEffect(() => {
    const aimMoveingInterval = setInterval(() => {
      setAimPosition(prev => {
        const newPosition = prev + 1;
        if (newPosition > BAR_WIDTH - BAR_SIDE_SAFE_MARGIN) {
          return BAR_SIDE_SAFE_MARGIN; // Reset to the left side if it goes beyond the bar width
        }
        return newPosition;
      });
    }, 5);

    return () => {
      clearInterval(aimMoveingInterval);
    };
  }, []);

  function shoot() {
    if (targetDetails) {
      const { start, length } = targetDetails;
      if (aimPosition >= start - 5 && aimPosition <= start + length + 5) {
        setScore(prev => prev + 1);
        generateTargetDetails(); // Generate a new target after a successful hit
      }
    }
  }

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
  }, [aimPosition, targetDetails]);

  return (
    <Wrapper>
      <div>Score: {score}</div>
      <BarBackground>
        {targetDetails && <Target start={targetDetails.start} length={targetDetails.length} />}
        <AimLine position={aimPosition} />
      </BarBackground>
    </Wrapper>
  );
}

export default Mine;