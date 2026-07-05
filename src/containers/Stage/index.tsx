import styled from "styled-components"
import Games from "../Games"

const StageWrapper = styled.div`
  width: 1200px;
  height: 100vh;
  background-color: #303030;
`

function Stage() {
  return (
    <StageWrapper>
      <Games />
    </StageWrapper>
  )
}

export default Stage