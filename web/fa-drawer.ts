import { AState, DFA, NFA, Character, sameState, isAcceptingState, ATransition, makeATransition } from "../typescript/automata.js"

const OUT_RAD = 30, IN_RAD = 25;
const TRANSITION_ARROW_HEAD_SIZE = 10;
const INIT_ARROW_LEN = 20, INIT_ARROW_PAD = 10, INIT_ARROW_HEAD_SIZE = 10;
const STATE_NAME_FONT = '20px Cambria';
const TRANSITION_FONT = '20px Cambria';
const TRANSITION_CHAR_PAD = 10;
const SELF_LOOP_RAD = 15;
const ELEVATION = 30;

/**
 * draw a state in the automata diagram.
 * @param ctx canvas' context.
 * @param x the x coordinate of the center of the state's circle.
 * @param y the y coordinate of the center of the state's circle.
 * @param state the state.
 * @param dfa the entire dfa.
 */
function drawState(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, state: AState, fa: DFA | NFA): void {
    ctx.save();

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    
    // draw the outer circle
    ctx.beginPath();
    ctx.arc(x, y, OUT_RAD, 0, 2 * Math.PI);
    ctx.stroke();

    // write the state's name
    ctx.font = STATE_NAME_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.name, x, y);

    if (isAcceptingState(fa, state)) {
        // draw th inner circle
        ctx.beginPath();
        ctx.arc(x, y, IN_RAD, 0, 2 * Math.PI);
        ctx.stroke();
    }

    ctx.restore();

    if (sameState(state, fa.initialState)) {
        // draw an arrow above the outer circle
        ctx.beginPath();
        ctx.moveTo(x, y - OUT_RAD - INIT_ARROW_PAD - INIT_ARROW_LEN);
        ctx.lineTo(x, y - OUT_RAD - INIT_ARROW_PAD);
        ctx.stroke();

        // draw the arrowhead
        ctx.beginPath();
        ctx.moveTo(x - INIT_ARROW_HEAD_SIZE * Math.cos(Math.PI / 3),
            y - OUT_RAD - INIT_ARROW_PAD - INIT_ARROW_HEAD_SIZE * Math.sin(Math.PI / 3));
        ctx.lineTo(x + INIT_ARROW_HEAD_SIZE * Math.cos(Math.PI / 3),
            y - OUT_RAD - INIT_ARROW_PAD - INIT_ARROW_HEAD_SIZE * Math.sin(Math.PI / 3));
        ctx.lineTo(x, y - OUT_RAD - INIT_ARROW_PAD);
        ctx.closePath();
        ctx.fill();
    }
}

function drawSelfTransition(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, char: Character): void {
    // const loopCenterY = y - OUT_RAD - SELF_LOOP_RAD;

    const centerX = canvas.width / 2, centerY = canvas.height / 2;
    const angle = Math.atan2(y - centerY, x - centerX);
    const loopCenterY = y + (SELF_LOOP_RAD + OUT_RAD) * Math.sin(angle);
    const loopCenterX = x + (SELF_LOOP_RAD + OUT_RAD) * Math.cos(angle);

    const startAngle = 3 / 4 * Math.PI;
    const endAngle = 1 / 4 * Math.PI;

    // draw the arc

    ctx.beginPath();
    ctx.arc(loopCenterX, loopCenterY, SELF_LOOP_RAD,
        Math.PI / 2 + angle + startAngle,
        Math.PI / 2 + angle + endAngle);
    ctx.stroke();

    // arrow endpoint
    const arrowX = loopCenterX + SELF_LOOP_RAD * Math.cos(Math.PI / 2 + angle + endAngle);
    const arrowY = loopCenterY + SELF_LOOP_RAD * Math.sin(Math.PI / 2 + angle + endAngle);

    // arrowhead
    const arrowAngle = (Math.PI / 2 + angle + endAngle) + Math.PI / 2;

    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
        arrowX - TRANSITION_ARROW_HEAD_SIZE * Math.cos(arrowAngle - Math.PI / 6),
        arrowY - TRANSITION_ARROW_HEAD_SIZE * Math.sin(arrowAngle - Math.PI / 6)
    );
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
        arrowX - TRANSITION_ARROW_HEAD_SIZE * Math.cos(arrowAngle + Math.PI / 6),
        arrowY - TRANSITION_ARROW_HEAD_SIZE * Math.sin(arrowAngle + Math.PI / 6)
    );
    ctx.stroke();

    // write the letter

    const controlX = x + (2 * SELF_LOOP_RAD + OUT_RAD + TRANSITION_CHAR_PAD) * Math.cos(angle);
    const controlY = y + (2 * SELF_LOOP_RAD + OUT_RAD + TRANSITION_CHAR_PAD) * Math.sin(angle);

    ctx.save();
    ctx.translate(controlX, controlY);

    if (angle > Math.PI / 2 || angle < -Math.PI / 2)
        // the text is "too upside down"
        ctx.rotate(angle + Math.PI);
    else
        ctx.rotate(angle);

    ctx.font = TRANSITION_FONT;
    ctx.fillText(char === '' ? 'ε' : char, 0, 0); 

    ctx.restore(); 
}

/**
 * draw a transition (arrow) in the automata diagram.
 * @param ctx canvas' context.
 * @param x1 source state's circle x coordinate.
 * @param y1 source state's circle y coordinate.
 * @param x2 destination state's circle x coordinate.
 * @param y2 destination state's circle y coordinate.
 * @param char the char corresponding to the transition.
 */
function drawTransition(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, char: Character): void {
    // self loop

    if (x1 === x2 && y1 === y2) {
        drawSelfTransition(canvas, ctx, x1, y1, char);
        return;
    }

    // two different states

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const startX = x1 + OUT_RAD * Math.cos(angle), startY = y1 + OUT_RAD * Math.sin(angle);
    const endX = x2 - OUT_RAD * Math.cos(angle), endY = y2 - OUT_RAD * Math.sin(angle);

    const midX = (startX + endX) / 2, midY = (startY + endY) / 2;
    const dx = endX - startX, dy = endY - startY;
    const perpX = -dy, perpY = dx;
    
    // normalize the perpendicular vector
    const length = Math.sqrt(perpX * perpX + perpY * perpY);
    const unitPerpX = perpX / length;
    const unitPerpY = perpY / length;

    // control point for the quadratic curve
    const controlX = midX + unitPerpX * ELEVATION;
    const controlY = midY + unitPerpY * ELEVATION;

    // draw the arc
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(controlX, controlY, endX, endY);
    ctx.stroke(); 

    // draw the head
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - TRANSITION_ARROW_HEAD_SIZE * Math.cos(angle - Math.PI / 6),
        endY - TRANSITION_ARROW_HEAD_SIZE * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - TRANSITION_ARROW_HEAD_SIZE * Math.cos(angle + Math.PI / 6),
        endY - TRANSITION_ARROW_HEAD_SIZE * Math.sin(angle + Math.PI / 6));
    ctx.stroke();

    // write the letter

    ctx.save();
    ctx.translate(controlX, controlY);

    if (angle > Math.PI / 2 || angle < -Math.PI / 2)
        // the text is "too upside down"
        ctx.rotate(angle + Math.PI);
    else
        ctx.rotate(angle);

    ctx.font = TRANSITION_FONT;

    if (endX > startX)
        ctx.fillText((char === '' ? 'ε' : char) + " →", 0, 0); 
    else if (endX < startX)
        ctx.fillText("← " + (char === '' ? 'ε' : char), 0, 0); 
    else if (endY > startY) 
        // same x but the arrow is at the bottom end of the transition arrow
        ctx.fillText((char === '' ? 'ε' : char) + " →", 0, 0); 
    else 
        ctx.fillText("← " + (char === '' ? 'ε' : char), 0, 0); 

    ctx.restore(); 
}

function calculatePositionOfState(canvas: HTMLCanvasElement, state: AState, allStates: AState[]){
    const centerX = canvas.width / 2, centerY = canvas.height / 2;
    const rotationPerState = (2 * Math.PI) / allStates.length;
    const margin = OUT_RAD + TRANSITION_CHAR_PAD + 2 * SELF_LOOP_RAD + 30;
    const radius = Math.min(canvas.width, canvas.height) / 2 - margin;
    const index = allStates.findIndex(t => sameState(t, state));

    return {
        state: state,
        x: centerX + radius * Math.cos(index * rotationPerState),
        y: centerY + radius * Math.sin(index * rotationPerState)
    };
}

/**
 * calculate the position of each state's circle in the canvas.
 * @param canvas the canvas.
 * @param states a list of states.
 * @returns a list of positions: { state, x, y };
 */
function calculatePositions(canvas: HTMLCanvasElement, states: AState[]) {
    const centerX = canvas.width / 2, centerY = canvas.height / 2;
    const rotationPerState = (2 * Math.PI) / states.length;
    const margin = OUT_RAD + TRANSITION_CHAR_PAD + 2 * SELF_LOOP_RAD + 30;
    const radius = Math.min(canvas.width, canvas.height) / 2 - margin;

    return states.map((state, index) =>
    ({
        state: state,
        x: centerX + radius * Math.cos(index * rotationPerState),
        y: centerY + radius * Math.sin(index * rotationPerState)
    }));
}

/**
 * draw an entire DFA diagram.
 * @param dfa
 */
export function drawAutomata(fa: DFA | NFA, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    const positions = calculatePositions(canvas, fa.states);

    const sameEnds = (f: ATransition, s: ATransition): boolean => sameState(f.src, s.src) && sameState(f.dest, s.dest);

    positions.forEach(stateP => drawState(ctx, "black", stateP.x, stateP.y, stateP.state, fa));

    var combinedList = [];

    var toSkip: ATransition[] = [];

    for (let i = 0; i < fa.transitions.length; i++) {
        const curr = fa.transitions[i];

        if (toSkip.indexOf(curr) > -1)
            continue;

        // find all arrows with same ends as the current
        const sameArrow = fa.transitions.filter(t => sameEnds(curr, t));

        const combinedTransition = makeATransition(curr.src, 
            sameArrow.map(t => t.char === '' ? 'ε' : t.char).join(', '), curr.dest);

        toSkip = toSkip.concat(sameArrow);

        // push the combined one
        combinedList.push(combinedTransition);
    }

    combinedList.forEach(transiton => {
        const origin = positions.findIndex(pos => sameState(pos.state, transiton.src));
        const end = positions.findIndex(pos => sameState(pos.state, transiton.dest));

        if (origin === -1 || end === -1)
            throw new Error("invalid transitions")  // shouldn't happen

        drawTransition(canvas, ctx,
            positions[origin].x, positions[origin].y,
            positions[end].x, positions[end].y,
            transiton.char);
    });
}

export function colorState(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, color: string, state: AState, fa: DFA | NFA){
    const pos = calculatePositionOfState(canvas, state, fa.states);

    drawState(ctx, color, pos.x, pos.y, state, fa);
}
