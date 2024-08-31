import { NFA } from "../automaton/automaton"

const ST_RAD_OUT = 30, ST_RAD_IN = 25, ST_FONT = "20px Cambria";
const TR_ARR_HEAD = 10, TR_SELF_RAD = 15, TR_PAD = 10, TR_ELV = 30, TR_FONT = "20px Cambria";
const INIT_ARR_LEN = 20, INIT_ARR_PAD = 10, INIT_ARR_HEAD = 10;
const EPSILON = 'ε', LEFT_ARROW = "← ", RIGHT_ARROW = " →";

export function clearCanvas(canvas: HTMLCanvasElement){
    const ctx = canvas.getContext("2d");

    if (ctx === null){
        throw new Error("cannot get context");
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * draw a state in the automata diagram.
 * @param canvas the canvas to draw on.
 * @param x the x coordinate of the center of the state's circle.
 * @param y the y coordinate of the center of the state's circle.
 * @param state the state.
 * @param automaton the entire NFA.
 */
export function drawState(canvas: HTMLCanvasElement, color: string, x: number, y: number, state: string, automaton: NFA): void {
    const ctx = canvas.getContext("2d");

    if (ctx === null){
        throw new Error("cannot get context");
    }
    
    ctx.save();

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    
    // draw the outer circle
    ctx.beginPath();
    ctx.arc(x, y, ST_RAD_OUT, 0, 2 * Math.PI);
    ctx.stroke();

    // write the state's name
    ctx.font = ST_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state, x, y);

    if (automaton.acceptingStates.has(state)) {
        // draw th inner circle
        ctx.beginPath();
        ctx.arc(x, y, ST_RAD_IN, 0, 2 * Math.PI);
        ctx.stroke();
    }

    ctx.restore();

    if (state === automaton.initialState) {
        // draw an arrow above the outer circle
        ctx.beginPath();
        ctx.moveTo(x, y - ST_RAD_OUT - INIT_ARR_PAD - INIT_ARR_LEN);
        ctx.lineTo(x, y - ST_RAD_OUT - INIT_ARR_PAD);
        ctx.stroke();

        // draw the arrowhead
        ctx.beginPath();
        ctx.moveTo(x - INIT_ARR_HEAD * Math.cos(Math.PI / 3),
            y - ST_RAD_OUT - INIT_ARR_PAD - INIT_ARR_HEAD * Math.sin(Math.PI / 3));
        ctx.lineTo(x + INIT_ARR_HEAD * Math.cos(Math.PI / 3),
            y - ST_RAD_OUT - INIT_ARR_PAD - INIT_ARR_HEAD * Math.sin(Math.PI / 3));
        ctx.lineTo(x, y - ST_RAD_OUT - INIT_ARR_PAD);
        ctx.closePath();
        ctx.fill();
    }
}

/**
 * draw a transition from a state to itself. 
 * @param canvas the canvas to draw on.
 * @param x the x coordinate of the center of the state's circle.
 * @param y the y coordinate of the center of the state's circle. 
 * @param char the char (or characters) that define this transition.
 */
function drawSelfTransition(canvas: HTMLCanvasElement, x: number, y: number, char: string): void {
    const ctx = canvas.getContext("2d");

    if (ctx === null){
        throw new Error("cannot get context");
    }
    
    const centerX = canvas.width / 2, centerY = canvas.height / 2;
    const angle = Math.atan2(y - centerY, x - centerX);

    const loopCenterY = y + (TR_SELF_RAD + ST_RAD_OUT) * Math.sin(angle);
    const loopCenterX = x + (TR_SELF_RAD + ST_RAD_OUT) * Math.cos(angle);

    const startAngle = 3 / 4 * Math.PI;
    const endAngle = 1 / 4 * Math.PI;

    // draw the arc

    ctx.beginPath();
    ctx.arc(loopCenterX, loopCenterY, TR_SELF_RAD,
        Math.PI / 2 + angle + startAngle,
        Math.PI / 2 + angle + endAngle);
    ctx.stroke();

    // arrow endpoint
    const arrowX = loopCenterX + TR_SELF_RAD * Math.cos(Math.PI / 2 + angle + endAngle);
    const arrowY = loopCenterY + TR_SELF_RAD * Math.sin(Math.PI / 2 + angle + endAngle);

    // arrowhead
    const arrowAngle = (Math.PI / 2 + angle + endAngle) + Math.PI / 2;

    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
        arrowX - TR_ARR_HEAD * Math.cos(arrowAngle - Math.PI / 6),
        arrowY - TR_ARR_HEAD * Math.sin(arrowAngle - Math.PI / 6)
    );
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
        arrowX - TR_ARR_HEAD * Math.cos(arrowAngle + Math.PI / 6),
        arrowY - TR_ARR_HEAD * Math.sin(arrowAngle + Math.PI / 6)
    );
    ctx.stroke();

    // write the letter

    const controlX = x + (2 * TR_SELF_RAD + ST_RAD_OUT + TR_PAD) * Math.cos(angle);
    const controlY = y + (2 * TR_SELF_RAD + ST_RAD_OUT + TR_PAD) * Math.sin(angle);

    ctx.save();
    ctx.translate(controlX, controlY);

    if (angle > Math.PI / 2 || angle < -Math.PI / 2)
        // the text is "too upside down"
        ctx.rotate(angle + Math.PI);
    else
        ctx.rotate(angle);

    ctx.font = TR_FONT;
    ctx.fillText(char === '' ? EPSILON : char, 0, 0); 

    ctx.restore(); 
}

/**
 * draw a transition (arrow) in the automaton diagram.
 * @param ctx canvas' context.
 * @param x1 source state's circle x coordinate.
 * @param y1 source state's circle y coordinate.
 * @param x2 destination state's circle x coordinate.
 * @param y2 destination state's circle y coordinate.
 * @param char the char(s) corresponding to the transition.
 */
function drawTransition(canvas: HTMLCanvasElement, x1: number, y1: number, x2: number, y2: number, char: string): void {
    const ctx = canvas.getContext("2d");

    if (ctx === null){
        throw new Error("cannot get context");
    }
    
    // self loop

    if (x1 === x2 && y1 === y2) {
        drawSelfTransition(canvas, x1, y1, char);
        return;
    }

    // two different states

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const startX = x1 + ST_RAD_OUT * Math.cos(angle), endX = x2 - ST_RAD_OUT * Math.cos(angle);
    const startY = y1 + ST_RAD_OUT * Math.sin(angle), endY = y2 - ST_RAD_OUT * Math.sin(angle);

    const midX = (startX + endX) / 2, midY = (startY + endY) / 2;
    const dx = endX - startX, dy = endY - startY;
    const perpX = -dy, perpY = dx;
    
    // normalize the perpendicular vector
    const length = Math.sqrt(perpX * perpX + perpY * perpY);
    const unitPerpX = perpX / length;
    const unitPerpY = perpY / length;

    // control point for the quadratic curve
    const controlX = midX + unitPerpX * TR_ELV;
    const controlY = midY + unitPerpY * TR_ELV;

    // draw the arc
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(controlX, controlY, endX, endY);
    ctx.stroke(); 

    // draw the head
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - TR_ARR_HEAD * Math.cos(angle - Math.PI / 6),
        endY - TR_ARR_HEAD * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - TR_ARR_HEAD * Math.cos(angle + Math.PI / 6),
        endY - TR_ARR_HEAD * Math.sin(angle + Math.PI / 6));
    ctx.stroke();

    // write the letter

    ctx.save();
    ctx.translate(controlX, controlY);

    if (angle > Math.PI / 2 || angle < -Math.PI / 2)
        // the text is "too upside down"
        ctx.rotate(angle + Math.PI);
    else
        ctx.rotate(angle);

    ctx.font = TR_FONT;

    if (endX > startX)
        ctx.fillText((char === '' ? EPSILON : char) + RIGHT_ARROW, 0, 0); 
    else if (endX < startX)
        ctx.fillText(LEFT_ARROW + (char === '' ? EPSILON : char), 0, 0); 
    else if (endY > startY) 
        // same x but the arrow is at the bottom end of the transition arrow
        ctx.fillText((char === '' ? EPSILON : char) + RIGHT_ARROW, 0, 0); 
    else 
        ctx.fillText(LEFT_ARROW + (char === '' ? EPSILON : char), 0, 0); 

    ctx.restore(); 
}

/**
 * calculate the position of each state's circle in the canvas.
 * @param canvas the canvas.
 * @param automaton the automaton.
 * @returns a mapping of states and positions (state, {x, y}).
 */
function calculatePositions(canvas: HTMLCanvasElement, automaton: NFA) : Map<string, {x: number, y: number}>{
    const centerX = canvas.width / 2, centerY = canvas.height / 2;
    const rotationPerState = (2 * Math.PI) / automaton.states.size;
    const margin = ST_RAD_OUT + TR_PAD + 2 * TR_SELF_RAD + 30;
    const radius = Math.min(canvas.width, canvas.height) / 2 - margin;

    const map = new Map<string, {x: number, y: number}>();

    [...automaton.states].forEach((state, index) => 
        map.set(state, { 
            x: centerX + radius * Math.cos(index * rotationPerState), 
            y: centerY + radius * Math.sin(index * rotationPerState)
        }));

    return map;
}

/**
 * draw an entire automaton diagram.
 * @param canvas a canvas to draw on.
 * @param automaton an automaton to draw.
 * @returns the positions of the states.
 */
export function drawAutomaton(canvas: HTMLCanvasElement, automaton: NFA): Map<string, {x: number, y: number}> {
    const positions = calculatePositions(canvas, automaton);

    const sameEnds = (f: string[], s: string[]): boolean => f[0] === s[0] && f[2] === s[2];

    for (const [state, position] of positions){
        drawState(canvas, "black", position.x, position.y, state, automaton);
    } 

    for (const [src, transitions] of automaton.transitions){
        const fromSrc = new Map<string, Set<string>>();

        // add char to dest
        for (var [char, dests] of transitions){
            char = char === '' ? EPSILON : char;

            for (const dest of dests){
                const destEntry = fromSrc.get(dest);

                if (destEntry){
                    destEntry.add(char);
                } else {
                    fromSrc.set(dest, new Set([char]));
                }
            }
        }

        // draw all the arrows from the current source

        const srcPos = positions.get(src);

        if (srcPos === undefined){
            throw new Error("missing source's position");
        }

        const {x: x1, y: y1} = srcPos;

        for (const [dest, chars] of fromSrc){
            const destPos = positions.get(dest);

            if (destPos === undefined){
                throw new Error("missing destinations's position");
            }

            const {x: x2, y: y2} = destPos;

            drawTransition(canvas, x1, y1, x2, y2, [...chars].join(", "));
        }
    }

    return positions;
}
