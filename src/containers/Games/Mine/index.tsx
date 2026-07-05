import { useEffect, useState } from "react";
import styled from "styled-components";
import _1hit from "../../../assets/images/games/mine/1hit.jpg";
import _1swing from "../../../assets/images/games/mine/1swing.jpg";
import _2hit from "../../../assets/images/games/mine/2hit.jpg";
import _2swing from "../../../assets/images/games/mine/2swing.jpg";
import _3hit from "../../../assets/images/games/mine/3hit.jpg";
import _3swing from "../../../assets/images/games/mine/3swing.jpg";

const hitImages = [_1hit, _2hit, _3hit];
const swingImages = [_1swing, _2swing, _3swing];

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
  const [showHitImage, setShowHitImage] = useState<boolean>(false);

  const hit = hitImages[Math.min(Math.floor(score / 10), hitImages.length - 1)];
  const swing = swingImages[Math.min(Math.floor(score / 10), swingImages.length - 1)];

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
        setShowHitImage(true);
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

  useEffect(() => {
    if (showHitImage) {
      const timer = setTimeout(() => {
        setShowHitImage(false);
      }, 500); // Show the hit image for 500ms

      return () => clearTimeout(timer);
    }
  }, [showHitImage]);

  return (
    <Wrapper>
      <SideWrapper>
        <div>Score: {score}</div>
        <BarBackground>
          {targetDetails && <Target start={targetDetails.start} length={targetDetails.length} />}
          <AimLine position={aimPosition} />
        </BarBackground>
      </SideWrapper>
      <SideWrapper>
        {showHitImage ? (
          <img src={hit} alt="Hit" style={{ height: "100%", width: "auto" }} />
        ) : (
          <img src={swing} alt="Swing" style={{ height: "100%", width: "auto" }} />
        )}
      </SideWrapper>
    </Wrapper>
  );
}

export default Mine;