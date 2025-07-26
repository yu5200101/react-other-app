import type { PathParams, PathAry } from '@/pages/process/components/flowTypes';
import { SAFE_DISTANCE } from '.'

const handlePath = ({
  moveData,
  setCanvasSize,
  setPositionTL,
  positionTL,
  data
}: PathParams): PathAry => {
    const path = []
    if (moveData.y > 0) {
      // 向下
      setCanvasSize({
        x: SAFE_DISTANCE * 2 + Math.abs(moveData.x),
        y: SAFE_DISTANCE * 2 + Math.abs(moveData.y)
      })
      if (moveData.x < -SAFE_DISTANCE) {
        // 安全距离5 向左移动 左边距减小
        setPositionTL({
          x: positionTL.x + moveData.x - SAFE_DISTANCE,
          y: positionTL.y - SAFE_DISTANCE
        })
      } else {
        setPositionTL({
          x: positionTL.x - SAFE_DISTANCE,
          y: positionTL.y - SAFE_DISTANCE
        })
      }
      if (moveData.x > SAFE_DISTANCE) {
        // 安全距离5
        const flag = Math.abs(moveData.x) >= Math.abs(moveData.y)
        if (flag) {
          // 箭头：下、右
          // 两折线
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE,
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
        } else {
          // 箭头：下、右、下
          const mid = Math.round(Math.abs(moveData.y) / 2) + SAFE_DISTANCE
          // 三折线
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
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
            y:  Math.abs(moveData.y) + SAFE_DISTANCE,
          })
        }
      } else if (moveData.x < -SAFE_DISTANCE) {
        // 安全距离5
        const flag = Math.abs(moveData.x) >= Math.abs(moveData.y)
        if (flag) {
          // 箭头：下、左
          // 两折线
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })

        } else {
          // 箭头:下，左，下
          const mid = Math.round(Math.abs(moveData.y) / 2) + SAFE_DISTANCE
          // 三折线
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE
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
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
        }
      } else {
        // 直线向下
        // 箭头：下
        path.push({
          x: SAFE_DISTANCE,
          y: SAFE_DISTANCE
        })
        path.push({
          x: SAFE_DISTANCE,
          y: Math.abs(moveData.y) + SAFE_DISTANCE
        })
      }
    } else {
      // 向上
      const midWidth = Math.round(data.width / 2)
      const safeX = midWidth + SAFE_DISTANCE * 2
      if (moveData.x >= safeX) {
        setPositionTL({
          x: positionTL.x - SAFE_DISTANCE,
          y: positionTL.y + moveData.y - SAFE_DISTANCE
        })
      } else if (moveData.x < safeX && moveData.x > 0) {
        setPositionTL({
          x: positionTL.x - SAFE_DISTANCE,
          y: positionTL.y + moveData.y - SAFE_DISTANCE
        })
      } else if (moveData.x <= -safeX) {
        // 向左移动 左边距减小
        setPositionTL({
          x: positionTL.x + moveData.x - SAFE_DISTANCE,
          y: positionTL.y + moveData.y - SAFE_DISTANCE
        })
      } else {
        setPositionTL({
          x: positionTL.x - safeX - SAFE_DISTANCE,
          y: positionTL.y + moveData.y - SAFE_DISTANCE
        })
      }
      if (moveData.x >= safeX) {
        setCanvasSize({
          x: SAFE_DISTANCE * 2 + Math.abs(moveData.x),
          y: SAFE_DISTANCE * 4 + Math.abs(moveData.y)
        })
        // 右边
        const flag = Math.abs(moveData.x) >= Math.abs(moveData.y)
        if (flag) {
          // 箭头：下、右、上、右
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE,
          })
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE * 3
          })
          path.push({
            x: Math.abs(moveData.x) - SAFE_DISTANCE * 2,
            y: Math.abs(moveData.y) + SAFE_DISTANCE * 3
          })
          path.push({
            x: Math.abs(moveData.x) - SAFE_DISTANCE * 2,
            y: SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
        } else {
          // 箭头:下、右、上
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE * 3
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE * 3
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
        }
      } else if (moveData.x < safeX && moveData.x > 0) {
          setCanvasSize({
            x: safeX + SAFE_DISTANCE * 2,
            y: SAFE_DISTANCE * 4 + Math.abs(moveData.y)
          })
          // 箭头：下、右、上、左、上
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE * 3
          })
          path.push({
            x: safeX + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE * 3
          })
          path.push({
            x: safeX + SAFE_DISTANCE,
            y: SAFE_DISTANCE * 4
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE * 4
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
      } else if (moveData.x <= -safeX) {
        setCanvasSize({
          x: SAFE_DISTANCE * 2 + Math.abs(moveData.x),
          y: SAFE_DISTANCE * 4 + Math.abs(moveData.y)
        })
        // 左边
        const flag = Math.abs(moveData.x) >= Math.abs(moveData.y)
        if (flag) {
          // 箭头:下、左、上、左
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE * 3
          })
          path.push({
            x: SAFE_DISTANCE * 4,
            y: Math.abs(moveData.y) + SAFE_DISTANCE * 3
          })
          path.push({
            x: SAFE_DISTANCE * 4,
            y: SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
        } else {
          // 箭头:下、左、上
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE * 3
          })
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE * 3
          })
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
        }
      } else {
        setCanvasSize({
          x: safeX + SAFE_DISTANCE * 2,
          y: SAFE_DISTANCE * 4 + Math.abs(moveData.y)
        })
        // 箭头:下、左、上、右、上
        path.push({
          x: safeX  + SAFE_DISTANCE,
          y: Math.abs(moveData.y) + SAFE_DISTANCE
        })
        path.push({
          x: safeX  + SAFE_DISTANCE,
          y: Math.abs(moveData.y) + SAFE_DISTANCE * 3
        })
        path.push({
          x: SAFE_DISTANCE,
          y: Math.abs(moveData.y) + SAFE_DISTANCE * 3
        })
        path.push({
          x: SAFE_DISTANCE,
          y: SAFE_DISTANCE * 4
        })
        path.push({
          x: safeX + SAFE_DISTANCE + moveData.x,
          y: SAFE_DISTANCE * 4
        })
        path.push({
          x: safeX + SAFE_DISTANCE + moveData.x,
          y: SAFE_DISTANCE
        })
      }
    }
    return path
}
export default handlePath