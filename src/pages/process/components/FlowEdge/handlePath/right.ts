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
    if (moveData.x > 0) {
      // 向右
      setCanvasSize({
        x: SAFE_DISTANCE * 2 + Math.abs(moveData.x),
        y: SAFE_DISTANCE * 2 + Math.abs(moveData.y)
      })
      if (moveData.y < -SAFE_DISTANCE) {
        // 安全距离5 向上移动 上边距减小
        setPositionTL({
          x: positionTL.x - SAFE_DISTANCE * 2,
          y: positionTL.y + moveData.y - SAFE_DISTANCE
        })
      } else {
        setPositionTL({
          x: positionTL.x - SAFE_DISTANCE * 2,
          y: positionTL.y - SAFE_DISTANCE
        })
      }
      if (moveData.y < -SAFE_DISTANCE) {
        // 安全距离5
        const flag = Math.abs(moveData.y) >= Math.abs(moveData.x)
        if (flag) {
          // 箭头向上
          // 两折线
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE + Math.abs(moveData.y)
          })
          path.push({
            x: SAFE_DISTANCE + Math.abs(moveData.x),
            y: SAFE_DISTANCE + Math.abs(moveData.y)
          })
          path.push({
            x: SAFE_DISTANCE + Math.abs(moveData.x),
            y: SAFE_DISTANCE
          })
        } else {
          // 箭头向右
          const mid = Math.round(Math.abs(moveData.x) / 2) + SAFE_DISTANCE
          // 三折线
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE + Math.abs(moveData.y)
          })
          path.push({
            x: mid,
            y: SAFE_DISTANCE + Math.abs(moveData.y)
          })
          path.push({
            x: mid,
            y: SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
        }
      } else if (moveData.y > SAFE_DISTANCE) {
        // 安全距离5
        const flag = Math.abs(moveData.y) >= Math.abs(moveData.x)
        if (flag) {
          // 箭头向下
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE + Math.abs(moveData.x),
            y: SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE + Math.abs(moveData.x),
            y: SAFE_DISTANCE + Math.abs(moveData.y)
          })
        } else {
          const mid = Math.round(Math.abs(moveData.x) / 2) + SAFE_DISTANCE
          // 三折线
          // 箭头向右
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: mid,
            y: SAFE_DISTANCE
          })
          path.push({
            x: mid,
            y: SAFE_DISTANCE + Math.abs(moveData.y)
          })
          path.push({
            x: SAFE_DISTANCE + Math.abs(moveData.x),
            y: SAFE_DISTANCE + Math.abs(moveData.y)
          })
        }
      } else {
        // 直线向右
        // 箭头向右
        path.push({
          x: SAFE_DISTANCE,
          y: SAFE_DISTANCE
        })
        path.push({
          x: Math.abs(moveData.x) + SAFE_DISTANCE,
          y: SAFE_DISTANCE
        })
      }
    } else {
      // 向左
      const midHeight = Math.round(data.height / 2)
      const safeY = midHeight + SAFE_DISTANCE * 2
      if (moveData.y <= -safeY) {
        // 向上移动，上边距减少
        setPositionTL({
          x: positionTL.x + moveData.x - SAFE_DISTANCE * 2,
          y: positionTL.y + moveData.y - SAFE_DISTANCE
        })
      } else if (moveData.y > -safeY && moveData.y <= 0) {
        setPositionTL({
          x: positionTL.x + moveData.x - SAFE_DISTANCE * 2,
          y: positionTL.y - safeY
        })
      } else if (moveData.y >= safeY) {
        setPositionTL({
          x: positionTL.x + moveData.x - SAFE_DISTANCE * 2,
          y: positionTL.y - SAFE_DISTANCE
        })
      } else {
        setPositionTL({
          x: positionTL.x + moveData.x - SAFE_DISTANCE * 2,
          y: positionTL.y - SAFE_DISTANCE
        })
      }
      if (moveData.y <= -safeY) {
        setCanvasSize({
          x: SAFE_DISTANCE * 4 + Math.abs(moveData.x),
          y: SAFE_DISTANCE * 2 + Math.abs(moveData.y)
        })
        // 上
        const flag = Math.abs(moveData.y) >= Math.abs(moveData.x)
        if (flag) {
          // 箭头：右、上、左、上
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE * 3,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE * 3,
            y: SAFE_DISTANCE * 4
          })
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE * 4
          })
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
        } else {
          // 箭头: 右上左
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE * 3,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE * 3,
            y: SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
        }
      } else if (moveData.y > -safeY && moveData.y <= 0) {
          // 上
          setCanvasSize({
            x: SAFE_DISTANCE * 4 + Math.abs(moveData.x),
            y: safeY + SAFE_DISTANCE
          })
          // 箭头: 右、上、左、下、左
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: safeY
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE * 3,
            y: safeY
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE * 3,
            y: SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE * 3,
            y: SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE * 3,
            y: safeY - Math.abs(moveData.y),
          })
          path.push({
            x: SAFE_DISTANCE,
            y: safeY - Math.abs(moveData.y)
          })
      } else if (moveData.y >= safeY) {
        // 下
        setCanvasSize({
          x: SAFE_DISTANCE * 4 + Math.abs(moveData.x),
          y: SAFE_DISTANCE * 2 + Math.abs(moveData.y)
        })
        // 左边
        const flag = Math.abs(moveData.y) >= Math.abs(moveData.x)
        if (flag) {
          // 箭头:右、下、左、下
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE * 3,
            y: SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE * 3,
            y: Math.abs(moveData.y) - 2 * SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) - 2 * SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
        } else {
          // 箭头: 右、下、左
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE,
            y: SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE * 3,
            y: SAFE_DISTANCE
          })
          path.push({
            x: Math.abs(moveData.x) + SAFE_DISTANCE * 3,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
          path.push({
            x: SAFE_DISTANCE,
            y: Math.abs(moveData.y) + SAFE_DISTANCE
          })
        }
      } else {
        setCanvasSize({
          x: SAFE_DISTANCE * 4 + Math.abs(moveData.x),
          y: safeY + SAFE_DISTANCE
        })
        // 箭头: 右、下、左、上、左
        path.push({
          x: Math.abs(moveData.x) + SAFE_DISTANCE,
          y: SAFE_DISTANCE
        })
        path.push({
          x: Math.abs(moveData.x) + SAFE_DISTANCE * 3,
          y: SAFE_DISTANCE
        })
        path.push({
          x: Math.abs(moveData.x) + SAFE_DISTANCE * 3,
          y: safeY
        })
        path.push({
          x: SAFE_DISTANCE * 3,
          y: safeY
        })
        path.push({
          x: SAFE_DISTANCE * 3,
          y: Math.abs(moveData.y) + SAFE_DISTANCE
        })
        path.push({
          x: SAFE_DISTANCE,
          y: Math.abs(moveData.y) + SAFE_DISTANCE
        })
      }
    }
    return path
}
export default handlePath