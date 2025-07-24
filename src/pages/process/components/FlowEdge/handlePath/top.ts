import type { PathParams, PathAry } from '@/pages/process/components/flowTypes';
import { SAFE_DISTANCE } from './'

const handlePath = ({
  moveData,
  setCanvasSize,
  setPositionTL,
  positionTL,
  data
}: PathParams): PathAry => {
    const path = []
    if (moveData.y < 0) {
      // 向上
      setCanvasSize({
        x: SAFE_DISTANCE * 2 + Math.abs(moveData.x),
        y: SAFE_DISTANCE * 2 + Math.abs(moveData.y)
      })
      if (moveData.x < -SAFE_DISTANCE) {
        // 安全距离5 向左移动 左边距减小
        setPositionTL({
          x: positionTL.x + moveData.x - SAFE_DISTANCE,
          y: positionTL.y + moveData.y
        })
      } else {
        setPositionTL({
          x: positionTL.x - SAFE_DISTANCE,
          y: positionTL.y + moveData.y
        })
      }
      if (moveData.x > SAFE_DISTANCE) {
        // 安全距离5
        const flag = Math.abs(moveData.x) >= Math.abs(moveData.y)
        if (flag) {
          // 箭头向右
          // 两折线
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
        } else {
          // 箭头向上
          const mid = Math.round(Math.abs(moveData.y) / 2) + SAFE_DISTANCE
          // 三折线
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: mid
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: mid
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
        }
      } else if (moveData.x < -SAFE_DISTANCE) {
        // 安全距离5
        const flag = Math.abs(moveData.x) >= Math.abs(moveData.y)
        if (flag) {
          // 箭头向左
          // 两折线
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
        } else {
          // 箭头向上
          const mid = Math.round(Math.abs(moveData.y) / 2) + SAFE_DISTANCE
          // 三折线
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: mid,
          })
          path.push({
            x: SAFE_DISTANCE,
            y: mid
          })
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
        }
      } else {
        // 直线向上
        // 箭头向上
        path.push({
          x: SAFE_DISTANCE,
          y: Math.abs(moveData.y) + SAFE_DISTANCE
        })
        path.push({
          x: SAFE_DISTANCE,
          y: SAFE_DISTANCE
        })
      }
    } else {
      // 向下
      const midWidth = Math.round(data.width / 2)
      const tempSize = SAFE_DISTANCE * 2
      const safeX = midWidth + tempSize
      if (moveData.x >= safeX) {
        setPositionTL({
          x: positionTL.x - SAFE_DISTANCE,
          y: positionTL.y - tempSize
        })
      } else if (moveData.x > -safeX && moveData.x <= 0) {
        setPositionTL({
          x: positionTL.x - safeX - SAFE_DISTANCE,
          y: positionTL.y - tempSize
        })
      } else if (moveData.x <= -safeX) {
        // 向左移动 左边距减小
        setPositionTL({
          x: positionTL.x + moveData.x - SAFE_DISTANCE,
          y: positionTL.y - tempSize
        })
      } else {
        setPositionTL({
          x: positionTL.x - SAFE_DISTANCE,
          y: positionTL.y - tempSize
        })
      }
      if (moveData.x >= safeX) {
        setCanvasSize({
          x: SAFE_DISTANCE * 2 + Math.abs(moveData.x),
          y: tempSize + SAFE_DISTANCE * 2 + Math.abs(moveData.y)
        })
        // 右边
        const flag = Math.abs(moveData.x) >= Math.abs(moveData.y)
        if (flag) {
          // 箭头向右
          path.push({
            x: SAFE_DISTANCE,
            y: tempSize + SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) - tempSize,
            y: SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) - tempSize,
            y: Math.abs(moveData.y) + tempSize + SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + tempSize + SAFE_DISTANCE
          })
        } else {
          // 箭头向下
          path.push({
            x: SAFE_DISTANCE,
            y: tempSize + SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + tempSize + SAFE_DISTANCE
          })
        }
      } else if (moveData.x < safeX && moveData.x > 0) {
          setCanvasSize({
            x: safeX + SAFE_DISTANCE * 2,
            y: SAFE_DISTANCE * 4 + Math.abs(moveData.y)
          })
          // 箭头向右，向下，向左，向下
          path.push({
            x: SAFE_DISTANCE,
            y: tempSize + SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: safeX + SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: safeX + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + tempSize + SAFE_DISTANCE
          })
      } else if (moveData.x <= -safeX) {
        setCanvasSize({
          x: SAFE_DISTANCE * 2 + Math.abs(moveData.x),
          y: tempSize + SAFE_DISTANCE * 2 + Math.abs(moveData.y)
        })
        // 左边
        const flag = Math.abs(moveData.x) >= Math.abs(moveData.y)
        if (flag) {
          // 箭头向左
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: tempSize + SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: tempSize + SAFE_DISTANCE * 2,
            y: SAFE_DISTANCE
          })
          path.push({
            x: tempSize + SAFE_DISTANCE * 2,
            y: Math.abs(moveData.y) + tempSize + SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + tempSize + SAFE_DISTANCE
          })
        } else {
          // 箭头向下
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: tempSize + SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + tempSize + SAFE_DISTANCE
          })
        }
      } else {
        setCanvasSize({
          x: safeX + SAFE_DISTANCE * 2,
          y: SAFE_DISTANCE * 4 + Math.abs(moveData.y)
        })
        // 箭头向左，向下，向右，向下
        path.push({
          x: safeX + SAFE_DISTANCE,
          y: tempSize + SAFE_DISTANCE
        })
        path.push({
          x: safeX + SAFE_DISTANCE,
          y: SAFE_DISTANCE
        })
        path.push({
          x: SAFE_DISTANCE,
          y: SAFE_DISTANCE
        })
        path.push({
          x: SAFE_DISTANCE,
          y: Math.abs(moveData.y) + SAFE_DISTANCE
        })
        path.push({
          x: safeX  + SAFE_DISTANCE - Math.abs(moveData.x),
          y: Math.abs(moveData.y) + SAFE_DISTANCE
        })
        path.push({
          x: safeX  + SAFE_DISTANCE - Math.abs(moveData.x),
          y: Math.abs(moveData.y) + tempSize + SAFE_DISTANCE
        })
      }
    }
    return path
}
export default handlePath