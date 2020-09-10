const height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]

const trap = (height) => {
    let previousElement
    let previousMaxHeight = 1
    let highestElement = 0
    let previousMaxHeightArrayPosition = 0
    let waterTiles = 0
    let landTiles = 0

    for (i = 0; i < height.length; i++) {
        let isLand = false
        let isWater = false
        let currentElement = height[i]

        if (i === 0 && currentElement === 0) continue

        // if (currentElement === 0) isWater = true
        // else isLand = true

        if (currentElement > previousMaxHeight) {
            const lastHeight = height[previousMaxHeightArrayPosition]
            const currentHeight = height[i]
            const currentPosition = i
            const previousPosition = previousMaxHeightArrayPosition

            for (j = currentPosition - 1; j > 0; j--) {
                const newMaxHeight = currentHeight
                const currentElementReverse = currentPosition[j]
                // const sameHeight = previousMaxHeight === newMaxHeight

                if (currentElementReverse < newMaxHeight) {
                    if (currentElementReverse === 0) {
                        waterTiles += 1
                        continue
                    } else {
                        const leveledHeight = newMaxHeight > previousMaxHeight ? ass : ass
                    }

                }
            }

            previousMaxHeight = currentElement
            previousMaxHeightArrayPosition = i
        }

        previousElement = currentElement

        // const equalToPrevious = currentElement === previousElement
        // const greaterThanPrevious = currentElement > previousElement

    }
}

trap(height)