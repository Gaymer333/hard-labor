import { useEffect, useState } from "react";
import styled from "styled-components";
import _1hit from "../../../assets/images/games/mine/1hit.jpg";
import _1swing from "../../../assets/images/games/mine/1swing.jpg";
import _2hit from "../../../assets/images/games/mine/2hit.jpg";
import _2swing from "../../../assets/images/games/mine/2swing.jpg";
import _3hit from "../../../assets/images/games/mine/3hit.jpg";
import _3swing from "../../../assets/images/games/mine/3swing.jpg";
import _copperUrl from "../../../assets/images/resources/cooper.png";

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

const AbsoluteWrapper = styled.div`
  position: absolute;
  bottom: 50px;
  padding: 20px;
  width: 50%;
  background-color: rgba(5, 70, 0, 0.8);
  border-radius: 10px;
  border: 3px solid #002412;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BAR_WIDTH = 800;
const BAR_HEIGHT = 40;
const BAR_SIDE_SAFE_MARGIN = 10;
const TARGET_SIDE_SAFE_MARGIN = 30;
const TARGET_DEFAULT_LENGTH = 100;

const ResourceDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
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

const AimLine = styled.div.attrs<{ position: number }>(props => ({
  style: { left: `${props.position}px` },
}))`
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

function Mine() {
  const [targetDetails, setTargetDetails] = useState<TargetDetails | null>(null);
  const [aimPosition, setAimPosition] = useState<number>(0);

  const [score, setScore] = useState<number>(0);
  const [showHitImage, setShowHitImage] = useState<boolean>(false);

  const hit = hitImages[Math.min(Math.floor(score / 10), hitImages.length - 1)];
  const swing = swingImages[Math.min(Math.floor(score / 10), swingImages.length - 1)];

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
      setAimPosition(prev => {
        const newPosition = prev + 2.2;
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
      <AbsoluteWrapper>
        <ResourceDisplay>
          <img src={_copperUrl} alt="Copper" style={{ height: "32px", width: "32px" }} />: {score}
        </ResourceDisplay>
        <BarBackground>
          {targetDetails && <Target start={targetDetails.start} length={targetDetails.length} />}
          <AimLine position={aimPosition} />
        </BarBackground>
      </AbsoluteWrapper>
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